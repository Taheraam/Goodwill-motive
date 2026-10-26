import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const ROLES_KEY = 'roles';

/** Restrict a route to users whose DB role is in the list, e.g. @Roles('admin'). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Runs after JwtAuthGuard. The role is read from the database, not from the JWT,
 * so demoting a user takes effect immediately instead of when their token expires.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const userId: string | undefined = context.switchToHttp().getRequest().user?.sub;
    if (!userId) throw new ForbiddenException('Insufficient permissions');

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user || !required.includes(user.role)) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
