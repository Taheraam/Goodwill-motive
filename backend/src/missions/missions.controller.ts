import { Controller, Get, Post, Param, Request, UnauthorizedException } from '@nestjs/common';
import { MissionsService } from './missions.service';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  async list() {
    return this.missionsService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.missionsService.get(id);
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.missionsService.complete(id, userId);
  }
}
