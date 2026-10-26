import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, MaxLength, MinLength, ArrayMaxSize, ValidateNested } from 'class-validator';
import { RagBotService } from './rag-bot.service';
import { Public } from '../auth/public.decorator';

class ChatHistoryItem {
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(4000)
  content: string;
}

class ChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItem)
  history?: ChatHistoryItem[];
}

@Controller('bot')
export class RagBotController {
  constructor(private readonly ragBotService: RagBotService) {}

  /** Each call can hit a paid LLM API, so it gets a tighter per-IP limit than the global one. */
  @Public()
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Post('chat')
  @HttpCode(HttpStatus.OK)
  async chat(@Body() dto: ChatDto) {
    return this.ragBotService.answerQuestion(dto.message, dto.history ?? []);
  }

  @Public()
  @Get('suggestions')
  async getSuggestions() {
    return { suggestions: this.ragBotService.getSuggestedPrompts() };
  }
}
