import { Controller, Get, Post, Patch, Body, Param, Query, Request } from '@nestjs/common';
import { QaService } from './qa.service';
import { CreateQuestionDto, CreateAnswerDto } from './dto/qa.dto';
import { Public } from '../auth/public.decorator';

interface AuthenticatedRequest {
  user: { sub: string };
}

@Controller()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Public()
  @Get('questions')
  async listQuestions(@Query('cursor') cursor?: string, @Query('take') take?: string) {
    return this.qaService.listQuestions(cursor, take ? parseInt(take, 10) : 20);
  }

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionDto, @Request() req: AuthenticatedRequest) {
    return this.qaService.createQuestion(req.user.sub, dto);
  }

  @Get('questions/:id')
  async getQuestion(@Param('id') id: string) {
    return this.qaService.getQuestion(id);
  }

  @Post('answers')
  async createAnswer(@Body() dto: CreateAnswerDto, @Request() req: AuthenticatedRequest) {
    return this.qaService.createAnswer(req.user.sub, dto);
  }

  @Patch('answers/:id/accept')
  async acceptAnswer(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.qaService.acceptAnswer(id, req.user.sub);
  }
}
