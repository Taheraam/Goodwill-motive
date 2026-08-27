import { Controller, Get, Post, Param } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
  async complete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.missionsService.complete(id, userId);
  }
}

