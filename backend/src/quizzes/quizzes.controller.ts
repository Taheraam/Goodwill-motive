import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { SubmitQuizAttemptDto } from './dto/quizzes.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Public()
  @Get()
  async list(@Query('take') take?: string) {
    return this.quizzesService.list(take ? parseInt(take, 10) : 50);
  }

  @Public()
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.quizzesService.get(id);
  }

  @Post(':id/attempt')
  async attempt(
    @Param('id') id: string,
    @Body() dto: SubmitQuizAttemptDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.quizzesService.attempt(userId, id, dto.answers);
  }
}
