import { Controller, Post, Get, Body, Query, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SignupDto, LoginDto, OAuthDto, RefreshTokenDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Get('google')
  async googleAuth() {
    return this.authService.googleAuth();
  }

  @Public()
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    if (!code) {
      return res.redirect(`${frontendUrl}/login?error=google_oauth_failed`);
    }
    try {
      const result = await this.authService.googleCallback(code);
      return res.redirect(
        `${frontendUrl}/oauth/callback?userId=${result.user.id}&token=${result.tokens.accessToken}`,
      );
    } catch {
      return res.redirect(`${frontendUrl}/login?error=google_oauth_failed`);
    }
  }

  @Public()
  @Post('oauth')
  async oauth(@Body() dto: OAuthDto) {
    return this.authService.oauth(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { message: 'Logged out' };
  }

  @Get('me')
  async me(@CurrentUser('sub') userId: string) {
    return this.authService.me(userId);
  }
}
