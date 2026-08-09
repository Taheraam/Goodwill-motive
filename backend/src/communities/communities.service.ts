import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.community.findMany({ orderBy: { memberCount: 'desc' } });
  }

  async get(id: string) {
    return this.prisma.community.findUnique({
      where: { id },
      include: {
        userCommunities: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
      },
    });
  }

  async join(id: string, userId: string) {
    await this.prisma.userCommunity.create({ data: { userId, communityId: id } });
    await this.prisma.community.update({ where: { id }, data: { memberCount: { increment: 1 } } });
    return { joined: true };
  }

  async leave(id: string, userId: string) {
    await this.prisma.userCommunity.deleteMany({ where: { userId, communityId: id } });
    await this.prisma.community.update({ where: { id }, data: { memberCount: { decrement: 1 } } });
    return { left: true };
  }
}