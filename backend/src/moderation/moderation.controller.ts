import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateReportDto } from './dto/moderation.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../auth/roles.guard';
import { USER_ROLES } from '@goodwill/shared';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('report')
  async submit(@Body() dto: CreateReportDto, @CurrentUser('sub') userId: string) {
    return this.moderationService.submit(dto, userId);
  }

  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  @Get('reports')
  async list() {
    return this.moderationService.list();
  }

  @Roles(USER_ROLES.ADMIN, USER_ROLES.MODERATOR)
  @Patch('reports/:id/resolve')
  async resolve(@Param('id') id: string) {
    return this.moderationService.resolve(id);
  }
}