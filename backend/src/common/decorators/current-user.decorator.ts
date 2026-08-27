import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@goodwill/shared';

/**
 * Custom decorator to extract authenticated user information from the request context.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser('sub') userId: string) { ... }
 *
 *   @Get('me')
 *   getMe(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return data ? user?.[data] : user;
  },
);
