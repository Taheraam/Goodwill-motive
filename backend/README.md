# Goodwill Motive — API

NestJS 11 + Prisma (MongoDB). All routes are served under `/api`.

## Request pipeline

```
request → CORS allow-list → ValidationPipe (whitelist) → ThrottlerGuard
        → JwtAuthGuard (@Public opt-out) → RolesGuard (@Roles) → controller → service → Prisma
```

## Modules

| Module | Responsibility |
|---|---|
| `auth` | Signup/login (bcrypt), Google + GitHub OAuth, access/refresh JWTs, guards |
| `users` | Profiles, leaderboard |
| `contributions` | Points + daily streaks, written in one Prisma transaction |
| `quizzes`, `lessons`, `missions`, `qa`, `communities` | Learning features |
| `impact` | Campaigns and impact records |
| `payments` | Razorpay orders, signature verification, webhook, idempotent crediting |
| `moderation` | Abuse reports (admin/moderator only) |
| `mail` | Nodemailer transactional email |
| `rag-bot` | FAQ assistant: keyword retrieval over a curated knowledge base, Gemini optional |

## Run

```bash
cp .env.example .env
npm run prisma:push      # sync schema to MongoDB
npm run start:dev
npm test && npm run test:e2e
```

See `.env.example` for every environment variable and what happens when it is unset.
