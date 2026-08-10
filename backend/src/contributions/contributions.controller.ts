import { Controller, Get, Request } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

interface AuthenticatedRequest {
  user: { sub: string };
}

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get('me')
  async myStats(@Request() req: AuthenticatedRequest) {
    return this.contributionsService.getUserStats(req.user.sub);
  }
}
