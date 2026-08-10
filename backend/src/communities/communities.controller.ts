import { Controller, Get, Post, Param, Request } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

interface AuthenticatedRequest {
  user: { sub: string };
}

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
  async join(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.communitiesService.join(id, req.user.sub);
  }

  @Post(':id/leave')
  async leave(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.communitiesService.leave(id, req.user.sub);
  }
}