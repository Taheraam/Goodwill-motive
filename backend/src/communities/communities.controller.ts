import { Controller, Get, Post, Param } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  async list() {
    return this.communitiesService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.communitiesService.get(id);
  }

  @Post(':id/join')
  async join(@Param('id') id: string) {
    return this.communitiesService.join(id, 'stub-user-id');
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string) {
    return this.communitiesService.leave(id, 'stub-user-id');
  }
}