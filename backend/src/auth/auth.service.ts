import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(dto: { email: string; password: string; username: string }) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email ? 'Email already registered' : 'Username already taken',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, passwordHash },
    });

    // Send Welcome Email
    this.mailService.sendWelcomeEmail(user.email, user.username).catch((err) => {
      this.logger.warn(`Failed to dispatch welcome email: ${err?.message}`);
    });

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitize(user), tokens };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastActivityDate: new Date() },
    });

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitize(user), tokens };
  }

  async googleAuth() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3001/api/auth/google/callback';
    if (!clientId) {
      return {
        url: null,
        message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env to enable.',
      };
    }
    const scope = encodeURIComponent('openid email profile');
    const state = Math.random().toString(36).substring(2);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
    return { url, state };
  }

  async googleCallback(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:3001/api/auth/google/callback';
    if (!clientId || !clientSecret) {
      throw new UnauthorizedException('Google OAuth not configured');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) throw new UnauthorizedException('Failed to exchange code with Google');
    const tokenData = (await tokenRes.json()) as { access_token: string };

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoRes.ok) throw new UnauthorizedException('Failed to fetch user info from Google');
    const googleUser = (await userInfoRes.json()) as {
      id: string;
      email: string;
      name?: string;
      picture?: string;
    };

    let isNewUser = false;
    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          username: (googleUser.name ?? googleUser.email.split('@')[0]).substring(0, 50),
          avatarUrl: googleUser.picture || null,
          passwordHash: null,
        },
      });
    }

    if (isNewUser) {
      this.mailService.sendWelcomeEmail(user.email, user.username).catch((err) => {
        this.logger.warn(`Failed to dispatch welcome email: ${err?.message}`);
      });
    }

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitize(user), tokens };
  }

  async githubAuth() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri =
      process.env.GITHUB_REDIRECT_URI ?? 'http://localhost:3001/api/auth/github/callback';
    if (!clientId) {
      return {
        url: null,
        message: 'GitHub OAuth not configured. Set GITHUB_CLIENT_ID in .env to enable.',
      };
    }
    const state = Math.random().toString(36).substring(2);
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
    return { url, state };
  }

  async githubCallback(code: string) {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri =
      process.env.GITHUB_REDIRECT_URI ?? 'http://localhost:3001/api/auth/github/callback';
    if (!clientId || !clientSecret) {
      throw new UnauthorizedException('GitHub OAuth not configured');
    }

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) throw new UnauthorizedException('Failed to exchange code with GitHub');
    const tokenData = (await tokenRes.json()) as { access_token: string };
    if (!tokenData.access_token) throw new UnauthorizedException('Invalid GitHub access token');

    // Fetch user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Goodwill-Motive-App',
      },
    });
    if (!userRes.ok) throw new UnauthorizedException('Failed to fetch GitHub profile');
    const githubUser = (await userRes.json()) as {
      id: number;
      login: string;
      name?: string;
      email?: string;
      avatar_url?: string;
    };

    let userEmail = githubUser.email;
    if (!userEmail) {
      // Fetch user emails
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Goodwill-Motive-App',
        },
      });
      if (emailRes.ok) {
        const emails = (await emailRes.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
        const primaryEmail = emails.find((e) => e.primary && e.verified) || emails[0];
        if (primaryEmail) userEmail = primaryEmail.email;
      }
    }

    if (!userEmail) {
      userEmail = `${githubUser.login}@users.noreply.github.com`;
    }

    let isNewUser = false;
    let user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          email: userEmail,
          username: (githubUser.name || githubUser.login).substring(0, 50),
          avatarUrl: githubUser.avatar_url || null,
          passwordHash: null,
        },
      });
    }

    if (isNewUser) {
      this.mailService.sendWelcomeEmail(user.email, user.username).catch((err) => {
        this.logger.warn(`Failed to dispatch welcome email: ${err?.message}`);
      });
    }

    const tokens = this.generateTokens(user.id);
    return { user: this.sanitize(user), tokens };
  }

  async refresh(_token: string) {
    return { message: 'Refresh not yet configured. Use JWT access tokens.' };
  }

  async oauth(_dto: { provider: string; idToken: string }) {
    return {
      message:
        'Use GET /auth/google or GET /auth/github for OAuth flows.',
    };
  }

  async logout(_token: string) {
    return { message: 'Logged out' };
  }

  async me(userId: string) {
    if (!userId) return null;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;
    return this.sanitize(user);
  }

  private generateTokens(userId: string) {
    const payload = { sub: userId };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  private sanitize(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}
