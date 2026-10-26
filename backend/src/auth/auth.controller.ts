import { Controller, Post, Get, Body, Query, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SignupDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';

const STATE_COOKIE = 'gm_oauth_state';
type Provider = 'google' | 'github';

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Tighter limits than the global default: these are the brute-force targets.
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.token);
  }

  /**
   * Step 1 of OAuth: the browser navigates here (full page load, not XHR).
   * We set a random `state` in an httpOnly cookie and send the browser to Google/GitHub.
   */
  @Public()
  @Get('google')
  startGoogle(@Res() res: Response) {
    return this.startOAuth('google', res);
  }

  @Public()
  @Get('github')
  startGithub(@Res() res: Response) {
    return this.startOAuth('github', res);
  }

  @Public()
  @Get('google/callback')
  googleCallback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res() res: Response) {
    return this.finishOAuth('google', code, state, req, res);
  }

  @Public()
  @Get('github/callback')
  githubCallback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res() res: Response) {
    return this.finishOAuth('github', code, state, req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    // Stateless JWTs: the client discards its tokens. Access tokens expire in 15 minutes.
    return { message: 'Logged out' };
  }

  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }

  private startOAuth(provider: Provider, res: Response) {
    const state = this.authService.createOAuthState();
    res.cookie(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // sent on the top-level redirect back from the provider
      maxAge: 10 * 60 * 1000,
      path: '/api/auth',
    });
    return res.redirect(this.authService.getAuthorizeUrl(provider, state));
  }

  /**
   * Step 2: the provider redirects back with ?code&state. The state must match the cookie,
   * which proves this browser started the login (blocks login-CSRF).
   */
  private async finishOAuth(provider: Provider, code: string, state: string, req: Request, res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const fail = () => res.redirect(`${frontendUrl}/login?error=${provider}_oauth_failed`);

    const cookieState = readCookie(req, STATE_COOKIE);
    res.clearCookie(STATE_COOKIE, { path: '/api/auth' });
    if (!code || !this.authService.isValidOAuthState(state, cookieState)) return fail();

    try {
      const { tokens } = await this.authService.oauthCallback(provider, code);
      // Tokens go in the URL *fragment*: it is never sent to servers or leaked via the Referer header.
      const fragment = new URLSearchParams({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      return res.redirect(`${frontendUrl}/oauth/callback#${fragment}`);
    } catch {
      return fail();
    }
  }
}
