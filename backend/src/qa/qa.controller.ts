import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { QaService } from './qa.service';
import { CreateQuestionDto, CreateAnswerDto } from './dto/qa.dto';
import { Public } from '../auth/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Public()
  @Get('questions')
  async listQuestions(@Query('cursor') cursor?: string, @Query('take') take?: string) {
    return this.qaService.listQuestions(cursor, take ? parseInt(take, 10) : 20);
  }

  @Post('questions')
  async createQuestion(@Body() dto: CreateQuestionDto, @CurrentUser('sub') userId: string) {
    return this.qaService.createQuestion(userId, dto);
  }

  @Get('questions/:id')
  async getQuestion(@Param('id') id: string) {
    return this.qaService.getQuestion(id);
  }

  @Post('answers')
  async createAnswer(@Body() dto: CreateAnswerDto, @CurrentUser('sub') userId: string) {
    return this.qaService.createAnswer(userId, dto);
  }

  @Patch('answers/:id/accept')
  async acceptAnswer(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.qaService.acceptAnswer(id, userId);
  }
}
