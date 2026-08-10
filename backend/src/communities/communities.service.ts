import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(take = 50) {
    return this.prisma.community.findMany({
      orderBy: { memberCount: 'desc' },
      take,
    });
  }

  async findOne(id: string) {
    const community = await this.prisma.community.findUnique({ where: { id } });
    if (!community) throw new NotFoundException('Community not found');
    return community;
  }

  async join(id: string, userId: string) {
    // Idempotency: check if already a member
    const existing = await this.prisma.userCommunity.findUnique({
      where: { userId_communityId: { userId, communityId: id } },
    });
    if (existing) {
      throw new ConflictException('You are already a member of this community');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.userCommunity.create({ data: { userId, communityId: id } });
      await tx.community.update({ where: { id }, data: { memberCount: { increment: 1 } } });
      return { message: 'Joined community successfully' };
    });
  }

  async leave(id: string, userId: string) {
    const existing = await this.prisma.userCommunity.findUnique({
      where: { userId_communityId: { userId, communityId: id } },
    });
    if (!existing) {
      throw new NotFoundException('You are not a member of this community');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.userCommunity.delete({ where: { userId_communityId: { userId, communityId: id } } });
      await tx.community.update({ where: { id }, data: { memberCount: { decrement: 1 } } });
      return { message: 'Left community successfully' };
    });
  }
}