import { Controller, Get, Param, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Public } from '../auth/public.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Public()
  @Get()
  async list(@Query('take') take?: string) {
    return this.lessonsService.list(take ? parseInt(take, 10) : 50);
  }

  @Public()
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.lessonsService.get(id);
  }
}