import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

const jwt = new JwtService({ secret: 'x'.repeat(32) });

function ctx(headers: Record<string, string>, isPublic: boolean) {
  const request: any = { headers };
  const reflector = { getAllAndOverride: () => isPublic } as unknown as Reflector;
  const context: any = {
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({ getRequest: () => request }),
  };
  return { guard: new JwtAuthGuard(jwt, reflector), context, request };
}

describe('JwtAuthGuard', () => {
  it('rejects protected routes without a token', () => {
    const { guard, context } = ctx({}, false);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('rejects a refresh token used as an access token', () => {
    const refresh = jwt.sign({ sub: 'u1', typ: 'refresh' });
    const { guard, context } = ctx({ authorization: `Bearer ${refresh}` }, false);
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('attaches the user on public routes when a valid token is sent', () => {
    const access = jwt.sign({ sub: 'u1', typ: 'access' });
    const { guard, context, request } = ctx({ authorization: `Bearer ${access}` }, true);
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user.sub).toBe('u1');
  });

  it('lets anonymous callers through public routes', () => {
    const { guard, context, request } = ctx({}, true);
    expect(guard.canActivate(context)).toBe(true);
    expect(request.user).toBeUndefined();
  });
});
