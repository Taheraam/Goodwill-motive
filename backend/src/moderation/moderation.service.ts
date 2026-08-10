import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/moderation.dto';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateReportDto, reporterId: string) {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        targetUserId: dto.targetUserId,
        reason: dto.reason,
        details: dto.details,
        status: 'pending',
      },
    });
  }

  async list(take = 50) {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        reporter: { select: { id: true, username: true } },
      },
    });
  }

  async resolve(id: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');
    return this.prisma.report.update({
      where: { id },
      data: { status: 'resolved' },
    });
  }
}