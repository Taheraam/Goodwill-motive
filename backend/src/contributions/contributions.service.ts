import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContributionsService {
  constructor(private readonly prisma: PrismaService) {}

  async record(userId: string, actionType: string, value: number, quality = 50, validation = 50) {
    const contribution = await this.prisma.contribution.create({
      data: { userId, actionType, contributionValue: value, qualityScore: quality, validationScore: validation },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { contributionScore: { increment: value } },
    });

    await this.updateStreak(userId);

    return contribution;
  }

  async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    if (lastActivity) {
      lastActivity.setHours(0, 0, 0, 0);
    }

    let newStreakCount = user.streakCount;
    let newLongestStreak = user.longestStreak;

    if (!lastActivity) {
      newStreakCount = 1;
    } else {
      const daysSinceLast = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLast === 0) {
        return;
      } else if (daysSinceLast === 1) {
        newStreakCount = user.streakCount + 1;
      } else {
        newStreakCount = 1;
      }
    }

    if (newStreakCount > newLongestStreak) {
      newLongestStreak = newStreakCount;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        streakCount: newStreakCount,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      },
    });
  }

  async getUserContributions(userId: string, limit = 50) {
    return this.prisma.contribution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const [quizCount, questionCount, answerCount, missionCount] = await Promise.all([
      this.prisma.quizAttempt.count({ where: { userId } }),
      this.prisma.question.count({ where: { authorId: userId } }),
      this.prisma.answer.count({ where: { authorId: userId } }),
      this.prisma.userMission.count({ where: { userId, status: 'completed' } }),
    ]);

    return {
      contributionScore: user.contributionScore,
      streakCount: user.streakCount,
      longestStreak: user.longestStreak,
      reputationScore: user.reputationScore,
      quizCount,
      questionCount,
      answerCount,
      missionCount,
    };
  }
}
