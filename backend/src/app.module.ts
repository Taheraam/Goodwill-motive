import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ContributionsModule } from './contributions/contributions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { LessonsModule } from './lessons/lessons.module';
import { MissionsModule } from './missions/missions.module';
import { QaModule } from './qa/qa.module';
import { CommunitiesModule } from './communities/communities.module';
import { ImpactModule } from './impact/impact.module';
import { ModerationModule } from './moderation/moderation.module';
import { PaymentsModule } from './payments/payments.module';
import { RagBotModule } from './rag-bot/rag-bot.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'dev-secret-change-in-production'),
        signOptions: { expiresIn: '15m' },
      }),
      global: true,
    }),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    ContributionsModule,
    QuizzesModule,
    LessonsModule,
    MissionsModule,
    QaModule,
    CommunitiesModule,
    ImpactModule,
    ModerationModule,
    PaymentsModule,
    RagBotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
