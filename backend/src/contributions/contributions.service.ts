import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContributionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a contribution and updates user score atomically.
   * Wrapped in a $transaction to prevent inconsistencies if the process crashes mid-operation.
   */
  async record(userId: string, actionType: string, value: number, quality = 50, validation = 50) {
    return this.prisma.$transaction(async (tx) => {
      const contribution = await tx.contribution.create({
        data: {
          userId,
          actionType,
          contributionValue: value,
          qualityScore: quality,
          validationScore: validation,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { contributionScore: { increment: value } },
      });

      await this.updateStreak(tx, userId);

      return contribution;
    });
  }

  /**
   * Updates the user's streak within the same transaction context.
   */
  private async updateStreak(tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0], userId: string) {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { lastActivityDate: true, streakCount: true, longestStreak: true },
    });
    if (!user) return;

    const now = new Date();
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    let newStreak = user.streakCount;

    if (lastActivity) {
      const diffMs = now.getTime() - lastActivity.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours >= 24 && diffHours < 48) {
        // Consecutive day — increment streak
        newStreak = user.streakCount + 1;
      } else if (diffHours >= 48) {
        // Missed a day — reset streak
        newStreak = 1;
      }
      // Within same day — no change
    } else {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, user.longestStreak);

    await tx.user.update({
      where: { id: userId },
      data: {
        streakCount: newStreak,
        longestStreak: newLongest,
        lastActivityDate: now,
      },
    });
  }

  /**
   * Consolidated user stats method — single source of truth.
   */
  async getUserStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { contributionScore: true, streakCount: true, longestStreak: true, reputationScore: true },
    });
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
