import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
  private async updateStreak(tx: Prisma.TransactionClient, userId: string) {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { lastActivityDate: true, streakCount: true, longestStreak: true },
    });
    if (!user) return;

    const now = new Date();
    const today = dayNumber(now);
    const lastDay = user.lastActivityDate ? dayNumber(new Date(user.lastActivityDate)) : null;

    // Streaks count calendar days (IST), not rolling 24h windows. With the old
    // "24–48 hours since last activity" rule, a user active at 23:00 and again at
    // 01:00 the next day never got their streak incremented.
    let newStreak: number;
    if (lastDay === null) newStreak = 1;
    else if (today === lastDay) newStreak = Math.max(user.streakCount, 1); // same day
    else if (today === lastDay + 1) newStreak = user.streakCount + 1; // consecutive day
    else newStreak = 1; // missed at least one day

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

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Days since epoch in India Standard Time — the platform's audience timezone. */
export function dayNumber(date: Date): number {
  return Math.floor((date.getTime() + IST_OFFSET_MS) / 86_400_000);
}
