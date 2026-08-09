import { Controller, Get, Post, Param, Body, Request, UnauthorizedException } from '@nestjs/common';
import { QaService } from './qa.service';

@Controller()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Get('questions')
  async listQuestions() {
    return this.qaService.listQuestions();
  }

  @Post('questions')
  async createQuestion(@Body() body: { title: string; content: string; categoryId: string }, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.qaService.createQuestion(userId, body);
  }

  @Get('questions/:id')
  async getQuestion(@Param('id') id: string) {
    return this.qaService.getQuestion(id);
  }

  @Post('answers')
  async createAnswer(@Body() body: { questionId: string; content: string }, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.qaService.createAnswer(userId, body.questionId, body.content);
  }

  @Post('answers/:id/upvote')
  async upvote(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.qaService.upvote(userId, id);
  }

  @Post('answers/:id/accept')
  async accept(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.qaService.accept(userId, id);
  }
}
