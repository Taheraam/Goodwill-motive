# Goodwill Motive

A social-learning platform where learning activity (quizzes, missions, Q&A) earns
contribution points, and donors can sponsor meals directly through Razorpay.

```
 Next.js 16 (Vercel) ──HTTPS/JSON──► NestJS 11 API (Render) ──Prisma──► MongoDB Atlas
                                       │  ThrottlerGuard → JwtAuthGuard → RolesGuard
                                       ├─ Google / GitHub OAuth 2.0 (state cookie)
                                       ├─ Razorpay orders + signature check + webhook
                                       ├─ Nodemailer (welcome, donation receipts)
                                       └─ FAQ assistant (keyword retrieval → Gemini)
```

## Stack

| Layer | Tech |
|---|---|
| Web | Next.js 16, React 19, TypeScript, TanStack Query, Zustand, Tailwind 4 |
| API | NestJS 11, class-validator, JWT (access + refresh), bcrypt, @nestjs/throttler |
| Data | Prisma 6 + MongoDB (replica set required for transactions) |
| Payments | Razorpay Checkout + webhooks (`payment.captured`, `payment.failed`) |
| Infra | Turborepo, Docker (API image), Docker Compose (Mongo + API), Render, Vercel |
| CI | GitHub Actions: build, typecheck, unit + e2e tests, `npm audit`, Docker build |

`frontend-mobile/` is an early Expo prototype and is not part of CI.

## Quick start

Prerequisites: Node.js 20+, and Docker (for local MongoDB) or a MongoDB Atlas URI.

```bash
npm ci
cp backend/.env.example backend/.env        # fill in DATABASE_URL and JWT_SECRET

# Option A — everything in Docker (Mongo replica set + API on :3001)
docker compose -f infrastructure/docker-compose.yml up --build

# Option B — API on your machine against Atlas or the compose Mongo
npm run build --workspace=@goodwill/shared
npm run prisma:push --workspace=backend
npm run dev:backend

# Web app on :3000
npm run dev:web
```

## Tests

```bash
npm test --workspace=backend          # unit tests (payments, auth, quizzes, streaks, guards)
npm run test:e2e --workspace=backend  # boots the real app module with Prisma mocked
```

## Security notes

- All routes require a JWT unless marked `@Public()`; admin routes use `@Roles('admin')`.
- `/payments/verify` checks Razorpay's HMAC signature; `/payments/webhook` checks the
  webhook HMAC over the raw body. Crediting an order is idempotent (`created → success` once).
- Sandbox OAuth and sandbox payments only work when `NODE_ENV !== production`.

## Project structure

```
backend/          NestJS API + Prisma schema
frontend-web/     Next.js web app
frontend-mobile/  Expo prototype
packages/shared/  Shared TypeScript types and constants
infrastructure/   docker-compose.yml
docs/             Product and design notes
```
