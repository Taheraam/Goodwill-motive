import { Controller, Get, Post, Param } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  async list() {
    return this.communitiesService.list();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.communitiesService.findOne(id);
  }

  @Post(':id/join')
  async join(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.communitiesService.join(id, userId);
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.communitiesService.leave(id, userId);
  }
}