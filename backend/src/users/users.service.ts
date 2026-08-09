import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userBadges: { include: { badge: true }, orderBy: { awardedAt: 'desc' }, take: 10 },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...rest } = user;
    return rest;
  }

  async updateProfile(id: string, dto: any) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, username: true, avatarUrl: true, bio: true },
    });
  }

  async getStats(id: string) {
    const [quizzes, answers, missions, contributions] = await Promise.all([
      this.prisma.quizAttempt.count({ where: { userId: id } }),
      this.prisma.answer.count({ where: { authorId: id } }),
      this.prisma.userMission.count({ where: { userId: id, status: 'completed' } }),
      this.prisma.contribution.findMany({
        where: { userId: id },
        select: { contributionValue: true, actionType: true },
      }),
    ]);

    const totalContribution = contributions.reduce((sum, c) => sum + c.contributionValue, 0);
    const mealsFunded = Math.floor(totalContribution / 100);
    const tutoringHours = Math.floor(contributions.filter(c => c.actionType === 'answer_accepted').length * 0.5);

    return {
      totalQuizzesCompleted: quizzes,
      totalQuestionsAnswered: answers,
      totalMissionsCompleted: missions,
      impactGenerated: { mealsFunded, tutoringHoursSupported: tutoringHours },
    };
  }

  async getLeaderboard() {
    return this.prisma.user.findMany({
      orderBy: { contributionScore: 'desc' },
      take: 50,
      select: { id: true, username: true, avatarUrl: true, contributionScore: true, streakCount: true },
    });
  }
}