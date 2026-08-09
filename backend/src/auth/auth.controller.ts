import { Controller, Post, Get, Body, Request, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() body: { email: string; password: string; username: string }) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Public()
  @Get('google')
  async googleAuth() {
    return this.authService.googleAuth();
  }

  @Public()
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: any) {
    if (!code) return res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/login?error=google_oauth_failed`);
    try {
      const result = await this.authService.googleCallback(code);
      return res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/oauth/callback?userId=${result.user.id}&token=${result.tokens.accessToken}`);
    } catch {
      return res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/login?error=google_oauth_failed`);
    }
  }

  @Public()
  @Post('oauth')
  async oauth(@Body() body: { provider: string; idToken: string }) {
    return this.authService.oauth(body);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() body: { token: string }) {
    return this.authService.refresh(body.token);
  }

  @Post('logout')
  async logout() {
    return { message: 'Logged out' };
  }

  @Get('me')
  async me(@Request() req: any) {
    return this.authService.me(req.user?.sub);
  }
}
