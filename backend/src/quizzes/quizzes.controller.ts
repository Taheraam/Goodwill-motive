import { Controller, Get, Post, Param, Body, Request, Query } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { SubmitQuizAttemptDto } from './dto/quizzes.dto';
import { Public } from '../auth/public.decorator';

interface AuthenticatedRequest {
  user: { sub: string };
}

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
    @Request() req: AuthenticatedRequest,
  ) {
    return this.quizzesService.attempt(req.user.sub, id, dto.answers);
  }
}
