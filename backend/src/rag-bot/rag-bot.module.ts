import { Module } from '@nestjs/common';
import { RagBotService } from './rag-bot.service';
import { RagBotController } from './rag-bot.controller';

@Module({
  controllers: [RagBotController],
  providers: [RagBotService],
  exports: [RagBotService],
})
export class RagBotModule {}
