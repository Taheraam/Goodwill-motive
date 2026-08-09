import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContributionsService } from '../contributions/contributions.service';

@Injectable()
export class QaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contributions: ContributionsService,
  ) {}

  async listQuestions() {
    return this.prisma.question.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        category: true,
        _count: { select: { answers: true } },
      },
    });
  }

  async getQuestion(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        answers: { include: { author: { select: { id: true, username: true, avatarUrl: true } } } },
      },
    });
  }

  async createQuestion(userId: string, dto: { title: string; content: string; categoryId: string }) {
    const question = await this.prisma.question.create({
      data: {
        authorId: userId,
        title: dto.title,
        content: dto.content,
        categoryId: dto.categoryId,
        status: 'open',
      },
    });
    await this.contributions.record(userId, 'question_asked', 5);
    return question;
  }

  async createAnswer(userId: string, questionId: string, content: string) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const answer = await this.prisma.answer.create({
      data: { authorId: userId, questionId, content, upvotes: 0, helpfulnessScore: 0 },
    });
    await this.contributions.record(userId, 'answer_given', 10);
    return answer;
  }

  async upvote(userId: string, answerId: string) {
    const answer = await this.prisma.answer.update({
      where: { id: answerId },
      data: { upvotes: { increment: 1 } },
    });
    return { upvotes: answer.upvotes };
  }

  async accept(userId: string, answerId: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id: answerId } });
    if (!answer) throw new NotFoundException('Answer not found');

    const question = await this.prisma.question.findUnique({ where: { id: answer.questionId } });
    if (question?.authorId !== userId) throw new UnauthorizedException('Only the question author can accept an answer');

    await this.prisma.answer.updateMany({ where: { questionId: answer.questionId }, data: { isAccepted: false } });
    await this.prisma.answer.update({ where: { id: answerId }, data: { isAccepted: true, helpfulnessScore: 100 } });
    await this.prisma.question.update({ where: { id: answer.questionId }, data: { acceptedAnswerId: answerId, status: 'solved' } });

    await this.contributions.record(answer.authorId, 'answer_accepted', 25);
    return { accepted: true };
  }
}
