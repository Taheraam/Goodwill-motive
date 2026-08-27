import { Controller, Get } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get('me')
  async myStats(@CurrentUser('sub') userId: string) {
    return this.contributionsService.getUserStats(userId);
  }
}

