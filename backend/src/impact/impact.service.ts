import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImpactService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalQuizzes, totalAnswers, totalContributors] = await Promise.all([
      this.prisma.quizAttempt.count(),
      this.prisma.answer.count(),
      this.prisma.user.count(),
    ]);

    const totalContribution = await this.prisma.contribution.aggregate({ _sum: { contributionValue: true } });
    const mealsFunded = Math.floor((totalContribution._sum.contributionValue ?? 0) / 100);
    const tutoringHours = Math.floor(totalAnswers * 0.1);

    const activeCampaigns = await this.prisma.impactCampaign.findMany({ where: { isActive: true } });

    return {
      globalStats: { totalQuizzesCompleted: totalQuizzes, totalMealsFunded: mealsFunded, totalTutoringHours: tutoringHours, totalContributors },
      activeCampaigns,
      personalImpact: { mealsFunded: 0, tutoringHoursSupported: 0, communityGoalsHelped: 0 },
    };
  }

  async listCampaigns() {
    return this.prisma.impactCampaign.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  }

  async getCampaign(id: string) {
    return this.prisma.impactCampaign.findUnique({ where: { id } });
  }
}