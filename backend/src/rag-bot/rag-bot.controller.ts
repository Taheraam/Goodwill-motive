import { Controller, Post, Get, Body } from '@nestjs/common';
import { RagBotService, ChatMessage } from './rag-bot.service';
import { Public } from '../auth/public.decorator';

class ChatDto {
  message: string;
  history?: ChatMessage[];
}

@Controller('bot')
export class RagBotController {
  constructor(private readonly ragBotService: RagBotService) {}

  @Public()
  @Post('chat')
  async chat(@Body() dto: ChatDto) {
    if (!dto.message || typeof dto.message !== 'string') {
      return {
        reply: 'Please ask a question about Goodwill Motive!',
        sources: [],
        suggestedQuestions: this.ragBotService.getSuggestedPrompts(),
      };
    }
    return this.ragBotService.answerQuestion(dto.message, dto.history || []);
  }

  @Public()
  @Get('suggestions')
  async getSuggestions() {
    return {
      suggestions: this.ragBotService.getSuggestedPrompts(),
    };
  }
}
