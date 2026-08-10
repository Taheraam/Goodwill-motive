import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/users.dto';
import { CONTRIBUTION_POINTS } from '@goodwill/shared';

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

  async updateProfile(id: string, dto: UpdateProfileDto) {
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
      this.prisma.contribution.aggregate({
        where: { userId: id },
        _sum: { contributionValue: true },
      }),
    ]);

    const totalContribution = contributions._sum.contributionValue ?? 0;
    const mealsFunded = Math.floor(totalContribution / CONTRIBUTION_POINTS.MEALS_PER_POINT);

    return {
      totalQuizzesCompleted: quizzes,
      totalQuestionsAnswered: answers,
      totalMissionsCompleted: missions,
      impactGenerated: { mealsFunded, tutoringHoursSupported: Math.floor(answers * CONTRIBUTION_POINTS.TUTORING_HOURS_PER_ACCEPTED) },
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