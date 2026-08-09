import { Controller, Get, Param } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  async list() {
    return this.lessonsService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.lessonsService.get(id);
  }
}