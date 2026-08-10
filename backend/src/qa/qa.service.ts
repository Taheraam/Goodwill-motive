import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContributionsService } from '../contributions/contributions.service';
import { CreateQuestionDto, CreateAnswerDto } from './dto/qa.dto';
import { CONTRIBUTION_POINTS, ACTION_TYPES } from '@goodwill/shared';

@Injectable()
export class QaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contributionsService: ContributionsService,
  ) {}

  async listQuestions(cursor?: string, take = 20) {
    const limit = Math.min(take, 100); // Cap at 100 to prevent abuse
    return this.prisma.question.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
        _count: { select: { answers: true } },
      },
    });
  }

  async getQuestion(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        category: true,
        answers: {
          include: {
            author: { select: { id: true, username: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    });
    if (!question) throw new NotFoundException('Question not found');

    // Increment view count
    await this.prisma.question.update({ where: { id }, data: { viewCount: { increment: 1 } } });

    return question;
  }

  async createQuestion(userId: string, dto: CreateQuestionDto) {
    const question = await this.prisma.question.create({
      data: {
        authorId: userId,
        title: dto.title,
        content: dto.content,
        categoryId: dto.categoryId,
      },
    });

    await this.contributionsService.record(
      userId,
      ACTION_TYPES.QUESTION_ASKED,
      CONTRIBUTION_POINTS.QUESTION_ASKED,
    );

    return question;
  }

  async createAnswer(userId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({ where: { id: dto.questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const answer = await this.prisma.answer.create({
      data: {
        questionId: dto.questionId,
        authorId: userId,
        content: dto.content,
      },
    });

    await this.contributionsService.record(
      userId,
      ACTION_TYPES.ANSWER_GIVEN,
      CONTRIBUTION_POINTS.ANSWER_GIVEN,
    );

    return answer;
  }

  async acceptAnswer(answerId: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true },
    });
    if (!answer) throw new NotFoundException('Answer not found');
    if (answer.question.authorId !== userId) {
      throw new ForbiddenException('Only the question author can accept an answer');
    }

    await this.prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    });
    await this.prisma.question.update({
      where: { id: answer.questionId },
      data: { status: 'solved' },
    });

    await this.contributionsService.record(
      answer.authorId,
      ACTION_TYPES.ANSWER_ACCEPTED,
      CONTRIBUTION_POINTS.ANSWER_ACCEPTED,
    );

    return { message: 'Answer accepted' };
  }
}
