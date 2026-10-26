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
      take: Math.min(Math.max(take, 1), 100),
      select: {
        id: true,
        title: true,
        difficulty: true,
        contributionValue: true,
        category: { select: { name: true } },
      },
    });
  }

  /**
   * Public quiz payload. `correctOption` is stripped: it used to be sent to the browser,
   * so anyone could read the answers from the network tab and score 100% every time.
   */
  async get(id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException('Quiz not found');
    const questions = this.questionsOf(quiz).map(({ correctOption: _hidden, ...publicFields }) => publicFields);
    return { ...quiz, questions };
  }

  private questionsOf(quiz: { questions: unknown }): QuizQuestion[] {
    return Array.isArray(quiz.questions) ? (quiz.questions as QuizQuestion[]) : [];
  }

  async attempt(
    userId: string,
    quizId: string,
    answers: { questionId: string; selectedOption: number }[],
  ) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz not found');

    const questions = this.questionsOf(quiz);

    // Count each question at most once: sending the same correct answer 10 times
    // used to add 10 points.
    const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.selectedOption]));
    let score = 0;
    for (const q of questions) {
      if (answerByQuestion.get(q.id) === q.correctOption) score++;
    }

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= CONTRIBUTION_POINTS.QUIZ_PASS_THRESHOLD;

    // XP is awarded only the first time a user passes a given quiz;
    // retaking a passed quiz is allowed for practice but earns nothing.
    let rewarded = 0;
    if (passed && !(await this.hasPassedBefore(userId, quiz.id, totalQuestions))) {
      rewarded = Math.round(quiz.contributionValue * (percentage / 100));
      await this.contributions.record(userId, ACTION_TYPES.QUIZ_COMPLETE, rewarded);
    }

    await this.prisma.quizAttempt.create({
      data: { userId, quizId, score, maxScore: totalQuestions, answers: answers as any },
    });

    return { score, totalQuestions, percentage, passed, contributionAwarded: rewarded };
  }

  private async hasPassedBefore(userId: string, quizId: string, totalQuestions: number) {
    if (totalQuestions === 0) return false;
    const previous = await this.prisma.quizAttempt.findMany({
      where: { userId, quizId },
      select: { score: true, maxScore: true },
    });
    return previous.some(
      (a) => a.maxScore > 0 && (a.score / a.maxScore) * 100 >= CONTRIBUTION_POINTS.QUIZ_PASS_THRESHOLD,
    );
  }
}
