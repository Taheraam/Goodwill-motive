import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const env = { ...process.env };
  afterEach(() => {
    process.env = { ...env };
  });

  const make = () => {
    const prisma: any = { user: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() } };
    const mail: any = { sendWelcomeEmail: jest.fn().mockResolvedValue(true) };
    return { svc: new AuthService(prisma, new JwtService({ secret: 'z'.repeat(32) }), mail), prisma };
  };

  it('rejects the sandbox OAuth code in production (was a login bypass)', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOW_OAUTH_SANDBOX = 'true';
    const { svc, prisma } = make();
    await expect(svc.oauthCallback('google', 'sandbox_google_user')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('rejects the sandbox OAuth code unless explicitly enabled in dev', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.ALLOW_OAUTH_SANDBOX;
    const { svc } = make();
    await expect(svc.oauthCallback('github', 'sandbox_github_user')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('compares OAuth state values safely', () => {
    const { svc } = make();
    const state = svc.createOAuthState();
    expect(svc.isValidOAuthState(state, state)).toBe(true);
    expect(svc.isValidOAuthState(state, undefined)).toBe(false);
    expect(svc.isValidOAuthState('short', state)).toBe(false);
  });
});
