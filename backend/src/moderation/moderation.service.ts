import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: any) {
    const report = await this.prisma.report.create({ data: dto });
    return { reported: true, reportId: report.id };
  }
}