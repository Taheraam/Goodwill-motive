import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type OAuthProfile = { email: string; name: string; avatarUrl: string | null };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Sandbox OAuth (fake Google/GitHub users) exists only for local development.
   * It must never be reachable in production, even if someone guesses the sandbox code.
   */
  private get sandboxAllowed(): boolean {
    return process.env.NODE_ENV !== 'production' && process.env.ALLOW_OAUTH_SANDBOX === 'true';
  }

  // ---------------------------------------------------------------------------
  // Email + password
  // ---------------------------------------------------------------------------

  async signup(dto: { email: string; password: string; username: string }) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email ? 'Email already registered' : 'Username already taken',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, passwordHash },
    });

    this.mailService.sendWelcomeEmail(user.email, user.username).catch((err) => {
      this.logger.warn(`Failed to dispatch welcome email: ${err?.message}`);
    });

    return { user: this.sanitize(user), tokens: this.generateTokens(user.id) };
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // Note: login deliberately does NOT touch lastActivityDate. That field drives streaks;
    // updating it here made the first contribution of a new day look like "same day"
    // and the streak never incremented.

    return { user: this.sanitize(user), tokens: this.generateTokens(user.id) };
  }

  // ---------------------------------------------------------------------------
  // OAuth — authorization-code flow with a per-browser `state` value
  // ---------------------------------------------------------------------------

  /** Random, unguessable value; the controller stores it in an httpOnly cookie. */
  createOAuthState(): string {
    return randomBytes(24).toString('hex');
  }

  /** Constant-time compare of the `state` Google/GitHub sent back vs. the cookie. */
  isValidOAuthState(fromProvider: string | undefined, fromCookie: string | undefined): boolean {
    if (!fromProvider || !fromCookie) return false;
    const a = Buffer.from(fromProvider);
    const b = Buffer.from(fromCookie);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  /** Returns the provider URL to redirect the browser to. */
  getAuthorizeUrl(provider: 'google' | 'github', state: string): string {
    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = this.redirectUri('google');
      if (!clientId) return this.sandboxUrl('google', redirectUri, state);
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        state,
        prompt: 'select_account',
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = this.redirectUri('github');
    if (!clientId) return this.sandboxUrl('github', redirectUri, state);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user:email',
      state,
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  }

  async oauthCallback(provider: 'google' | 'github', code: string) {
    const profile = code.startsWith('sandbox_')
      ? this.sandboxProfile(provider)
      : provider === 'google'
        ? await this.fetchGoogleProfile(code)
        : await this.fetchGithubProfile(code);

    let isNewUser = false;
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
    if (!user) {
      isNewUser = true;
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          username: await this.uniqueUsername(profile.name),
          avatarUrl: profile.avatarUrl,
          passwordHash: null,
        },
      });
    }

    if (isNewUser) {
      this.mailService.sendWelcomeEmail(user.email, user.username).catch((err) => {
        this.logger.warn(`Failed to dispatch welcome email: ${err?.message}`);
      });
    }

    return { user: this.sanitize(user), tokens: this.generateTokens(user.id) };
  }

  private redirectUri(provider: 'google' | 'github'): string {
    const fromEnv = provider === 'google' ? process.env.GOOGLE_REDIRECT_URI : process.env.GITHUB_REDIRECT_URI;
    return fromEnv ?? `http://localhost:3001/api/auth/${provider}/callback`;
  }

  private sandboxUrl(provider: 'google' | 'github', redirectUri: string, state: string): string {
    if (!this.sandboxAllowed) {
      throw new UnauthorizedException(`${provider} OAuth is not configured`);
    }
    this.logger.warn(`${provider.toUpperCase()}_CLIENT_ID missing. Using sandbox OAuth (dev only).`);
    return `${redirectUri}?code=sandbox_${provider}_user&state=${state}`;
  }

  private sandboxProfile(provider: 'google' | 'github'): OAuthProfile {
    // Previously this branch ran even in production → anyone could log in with ?code=sandbox_google_user
    if (!this.sandboxAllowed) throw new UnauthorizedException('Sandbox OAuth is disabled');
    return provider === 'google'
      ? { email: 'google.hero@goodwillmotive.org', name: 'Goodwill Hero (Google)', avatarUrl: null }
      : { email: 'github.hero@goodwillmotive.org', name: 'Goodwill Hero (GitHub)', avatarUrl: null };
  }

  private async fetchGoogleProfile(code: string): Promise<OAuthProfile> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new UnauthorizedException('Google OAuth not configured');

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: this.redirectUri('google'),
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) throw new UnauthorizedException('Failed to exchange code with Google');
    const tokenData = (await tokenRes.json()) as { access_token: string };

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userInfoRes.ok) throw new UnauthorizedException('Failed to fetch user info from Google');
    const g = (await userInfoRes.json()) as {
      email: string;
      verified_email?: boolean;
      name?: string;
      picture?: string;
    };

    // Only trust emails Google has verified — we link accounts by email.
    if (!g.email || g.verified_email === false) {
      throw new UnauthorizedException('Google account email is not verified');
    }
    return { email: g.email, name: g.name ?? g.email.split('@')[0], avatarUrl: g.picture ?? null };
  }

  private async fetchGithubProfile(code: string): Promise<OAuthProfile> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new UnauthorizedException('GitHub OAuth not configured');

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: this.redirectUri('github'),
      }),
    });
    if (!tokenRes.ok) throw new UnauthorizedException('Failed to exchange code with GitHub');
    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) throw new UnauthorizedException('Invalid GitHub access token');

    const headers = { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'Goodwill-Motive-App' };
    const userRes = await fetch('https://api.github.com/user', { headers });
    if (!userRes.ok) throw new UnauthorizedException('Failed to fetch GitHub profile');
    const gh = (await userRes.json()) as { login: string; name?: string; avatar_url?: string };

    // The public profile email can be unverified. Always use the verified primary email,
    // otherwise an attacker could claim someone else's address and take over that account.
    const emailRes = await fetch('https://api.github.com/user/emails', { headers });
    if (!emailRes.ok) throw new UnauthorizedException('Failed to fetch GitHub emails');
    const emails = (await emailRes.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
    const primary = emails.find((e) => e.primary && e.verified);
    if (!primary) throw new UnauthorizedException('GitHub account has no verified primary email');

    return { email: primary.email, name: gh.name || gh.login, avatarUrl: gh.avatar_url ?? null };
  }

  /** OAuth display names collide easily ("John Smith"); usernames are unique in the schema. */
  private async uniqueUsername(name: string): Promise<string> {
    const base = name.substring(0, 44);
    const taken = await this.prisma.user.findUnique({ where: { username: base } });
    return taken ? `${base}_${randomBytes(3).toString('hex')}` : base;
  }

  // ---------------------------------------------------------------------------
  // Tokens
  // ---------------------------------------------------------------------------

  /**
   * Exchanges a valid refresh token for a fresh access + refresh pair.
   * Access tokens live 15 minutes; without this, users were logged out every 15 minutes.
   */
  async refresh(refreshToken: string) {
    let payload: { sub: string; typ?: string };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.typ !== 'refresh') throw new UnauthorizedException('Not a refresh token');

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User no longer exists');

    return { tokens: this.generateTokens(user.id) };
  }

  async me(userId: string) {
    if (!userId) return null;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user ? this.sanitize(user) : null;
  }

  private generateTokens(userId: string) {
    return {
      accessToken: this.jwtService.sign({ sub: userId, typ: 'access' }, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign({ sub: userId, typ: 'refresh' }, { expiresIn: '7d' }),
    };
  }

  private sanitize(user: User) {
    const { passwordHash: _passwordHash, ...rest } = user;
    return rest;
  }
}
