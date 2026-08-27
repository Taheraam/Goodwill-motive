import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContributionsService } from '../contributions/contributions.service';
import { ACTION_TYPES } from '@goodwill/shared';

@Injectable()
export class MissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contributions: ContributionsService,
  ) {}

  async list() {
    const now = new Date();
    return this.prisma.mission.findMany({
      where: { isActive: true, OR: [{ startsAt: null }, { startsAt: { lte: now } }], AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }] },
    });
  }

  async get(id: string) {
    return this.prisma.mission.findUnique({ where: { id } });
  }

  async complete(missionId: string, userId: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) return { completed: false, error: 'Mission not found' };

    const record = await this.prisma.userMission.findUnique({ where: { userId_missionId: { userId, missionId } } });
    if (!record || record.status === 'completed') return { completed: false, error: 'Mission not assigned or already completed' };

    await this.prisma.userMission.update({
      where: { userId_missionId: { userId, missionId } },
      data: { status: 'completed', completedAt: new Date() },
    });

    await this.contributions.record(userId, ACTION_TYPES.MISSION_COMPLETE, mission.contributionReward);

    return { completed: true, contributionAwarded: mission.contributionReward };
  }
}