import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClient;

  async onModuleInit() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      this.logger.warn('DATABASE_URL not set — Prisma will not connect');
      return;
    }
    this.client = new PrismaClient();
    await this.client.$connect();
    this.logger.log('Prisma connected to MongoDB');
  }

  async onModuleDestroy() {
    if (this.client) await this.client.$disconnect();
  }

  get user() { return this.client.user; }
  get category() { return this.client.category; }
  get mission() { return this.client.mission; }
  get userMission() { return this.client.userMission; }
  get contribution() { return this.client.contribution; }
  get question() { return this.client.question; }
  get answer() { return this.client.answer; }
  get lesson() { return this.client.lesson; }
  get quiz() { return this.client.quiz; }
  get quizAttempt() { return this.client.quizAttempt; }
  get community() { return this.client.community; }
  get userCommunity() { return this.client.userCommunity; }
  get badge() { return this.client.badge; }
  get userBadge() { return this.client.userBadge; }
  get impactCampaign() { return this.client.impactCampaign; }
  get impactRecord() { return this.client.impactRecord; }
  get report() { return this.client.report; }

  $connect() { return this.client.$connect(); }
  $disconnect() { return this.client.$disconnect(); }
}
