# Goodwill Motive — Backend Agent

## Stack
- NestJS + TypeScript
- Prisma ORM v7 with PostgreSQL + `@prisma/adapter-pg`
- JWT auth via `@nestjs/jwt`
- Rate limiting via `@nestjs/throttler`
- Socket.io for real-time

## Prisma 7 Notes
- Generator: `prisma-client` outputs to `src/generated/prisma/`
- Import: `from '../generated/prisma/client'`
- Connection: Use `PrismaPg` adapter from `@prisma/adapter-pg` with a `pg.Pool`
- Run `npx prisma generate --no-hints` after schema changes
- Migrations via `prisma.config.ts` (NOT the schema `url` field)

## Key Patterns
- Always use `await prisma.$connect()` explicitly after adapter setup
- Use `ThrottlerGuard` on public endpoints
- ValidationPipe on global level
- API prefix: `/api`
- Response envelope: `{ success, data, meta }`

## Run Commands
```bash
cd backend
npm run start:dev     # dev with watch
npm run build         # production build
npm run prisma:migrate  # run migrations
npm run prisma:seed    # seed data
```