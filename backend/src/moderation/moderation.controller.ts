import { Controller, Post, Get, Body, Param, Patch, Request } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { CreateReportDto } from './dto/moderation.dto';

interface AuthenticatedRequest {
  user: { sub: string };
}

@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('report')
  async submit(@Body() dto: CreateReportDto, @Request() req: AuthenticatedRequest) {
    return this.moderationService.submit(dto, req.user.sub);
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