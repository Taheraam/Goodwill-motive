import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (isPublic) {
      // Public routes still learn *who* is calling when a valid token is present.
      // Before this, @CurrentUser() was always undefined on public routes, so
      // donations were never linked to the logged-in donor.
      if (token) {
        const payload = this.verifyAccessToken(token);
        if (payload) request.user = payload;
      }
      return true;
    }

    if (!token) throw new UnauthorizedException('Missing or invalid authorization header');
    const payload = this.verifyAccessToken(token);
    if (!payload) throw new UnauthorizedException('Invalid or expired token');
    request.user = payload;
    return true;
  }

  private extractToken(request: { headers: Record<string, string | undefined> }): string | null {
    const header = request.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : null;
  }

  /** Refresh tokens are only valid at POST /auth/refresh, never as API credentials. */
  private verifyAccessToken(token: string): { sub: string; typ?: string } | null {
    try {
      const payload = this.jwtService.verify<{ sub: string; typ?: string }>(token);
      return payload.typ === 'refresh' ? null : payload;
    } catch {
      return null;
    }
  }
}
