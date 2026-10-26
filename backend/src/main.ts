import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // rawBody: the Razorpay webhook signature is computed over the exact bytes received.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const logger = new Logger('Bootstrap');

  // Render/Vercel sit behind a proxy. Without this, every request appears to come from the
  // proxy's IP and the rate limiter throttles all users as if they were one client.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Explicit allow-list. The old /\.vercel\.app$/ regex trusted *any* site hosted on Vercel.
  const allowedOrigins = (process.env.CORS_ORIGINS ?? process.env.FRONTEND_URL ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: allowedOrigins, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`Goodwill Motive API running on http://0.0.0.0:${port}/api (CORS: ${allowedOrigins.join(', ')})`);
}
bootstrap();
