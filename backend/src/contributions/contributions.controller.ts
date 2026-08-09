import { Controller, Get, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get('me')
  async getMyContributions(@Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.contributionsService.getUserStats(userId);
  }

  @Post('validate')
  async validate() {
    return { message: 'Peer validation coming soon' };
  }
}
