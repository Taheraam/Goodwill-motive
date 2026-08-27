import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateReportDto } from './dto/moderation.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('report')
  async submit(@Body() dto: CreateReportDto, @CurrentUser('sub') userId: string) {
    return this.moderationService.submit(dto, userId);
  }

  @Get('reports')
  async list() {
    return this.moderationService.list();
  }

  @Patch('reports/:id/resolve')
  async resolve(@Param('id') id: string) {
    return this.moderationService.resolve(id);
  }
}