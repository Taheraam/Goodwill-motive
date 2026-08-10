import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContributionsService } from '../contributions/contributions.service';
import { ACTION_TYPES, CONTRIBUTION_POINTS } from '@goodwill/shared';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
}

@Injectable()
export class QuizzesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contributions: ContributionsService,
  ) {}

  async list(take = 50) {
    return this.prisma.quiz.findMany({
      where: { isActive: true },
      take,
      select: {
        id: true,
        title: true,
        difficulty: true,
        contributionValue: true,
        category: { select: { name: true } },
      },
    });
  }

  async get(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async attempt(
    userId: string,
    quizId: string,
    answers: { questionId: string; selectedOption: number }[],
  ) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const questions: QuizQuestion[] = Array.isArray(quiz.questions)
      ? (quiz.questions as unknown as QuizQuestion[])
      : [];

    let score = 0;
    for (const ans of answers) {
      const question = questions.find((q) => q.id === ans.questionId);
      if (question && question.correctOption === ans.selectedOption) {
        score++;
      }
    }

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= CONTRIBUTION_POINTS.QUIZ_PASS_THRESHOLD;

    await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        maxScore: totalQuestions,
        answers: answers as any,
      },
    });

    if (passed) {
      const reward = Math.round(quiz.contributionValue * (percentage / 100));
      await this.contributions.record(userId, ACTION_TYPES.QUIZ_COMPLETE, reward);
    }

    return { score, totalQuestions, percentage, passed };
  }
}
