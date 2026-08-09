import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.lesson.findMany({ where: { isPublished: true } });
  }

  async get(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }
}