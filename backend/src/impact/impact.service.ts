import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CONTRIBUTION_POINTS } from '@goodwill/shared';

@Injectable()
export class ImpactService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalQuizzes, totalAnswers, totalContributors] = await Promise.all([
      this.prisma.quizAttempt.count(),
      this.prisma.answer.count(),
      this.prisma.user.count(),
    ]);

    const totalContribution = await this.prisma.contribution.aggregate({
      _sum: { contributionValue: true },
    });
    const mealsFunded = Math.floor(
      (totalContribution._sum.contributionValue ?? 0) / CONTRIBUTION_POINTS.MEALS_PER_POINT,
    );
    const tutoringHours = Math.floor(
      totalAnswers * CONTRIBUTION_POINTS.TUTORING_HOURS_PER_ANSWER,
    );

    const activeCampaigns = await this.prisma.impactCampaign.findMany({
      where: { isActive: true },
      take: 10,
    });

    return {
      globalStats: {
        totalQuizzesCompleted: totalQuizzes,
        totalMealsFunded: mealsFunded,
        totalTutoringHours: tutoringHours,
        totalContributors,
      },
      activeCampaigns,
      personalImpact: { mealsFunded: 0, tutoringHoursSupported: 0, communityGoalsHelped: 0 },
    };
  }

  async listCampaigns(take = 50) {
    return this.prisma.impactCampaign.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async getCampaign(id: string) {
    const campaign = await this.prisma.impactCampaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}