import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(take = 50) {
    return this.prisma.lesson.findMany({
      where: { isPublished: true },
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }
}