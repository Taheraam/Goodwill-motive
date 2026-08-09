import { Controller, Get, Post, Param, Body, Request, UnauthorizedException } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get()
  async list() {
    return this.quizzesService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.quizzesService.get(id);
  }

  @Post(':id/attempt')
  async attempt(@Param('id') id: string, @Body() body: { answers: { questionId: string; selectedOption: number }[] }, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.quizzesService.attempt(userId, id, body.answers);
  }
}
