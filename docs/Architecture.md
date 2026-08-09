# System Architecture Document

## Goodwill Motive

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────────┐          ┌─────────────────────────┐  │
│  │   Web App       │          │   Mobile App            │  │
│  │   (Next.js)     │          │   (React Native + Expo) │  │
│  └────────┬────────┘          └───────────┬─────────────┘  │
└───────────┼───────────────────────────────┼────────────────┘
            │                               │
            └──────────────┬────────────────┘
                           │ HTTPS / REST / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                    API GATEWAY LAYER                         │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │   Auth     │ │  Mission   │ │  Learning  │              │
│  │  Service   │ │  Service   │ │  Service   │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │Contribution│ │ Community  │ │   Impact   │              │
│  │  Service   │ │  Service   │ │  Service   │              │
│  └────────────┘ └────────────┘ └────────────┘              │
│  ┌────────────┐                                             │
│  │ Moderation │                                             │
│  │  Service   │                                             │
│  └────────────┘                                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  PostgreSQL │  │ Redis Cache │  │   Object Storage    │ │
│  │  (Primary)  │  │  (Sessions) │  │  (Assets/Avatars)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────────┐  │
│  │ Firebase   │ │   Sponsor  │ │   Notification         │  │
│  │ / Auth0    │ │   APIs     │ │   Services             │  │
│  └────────────┘ └────────────┘ └────────────────────────┘  │
│  ┌────────────┐                                             │
│  │ Analytics  │                                             │
│  │ (PostHog)  │                                             │
│  └────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### Web Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand + React Query / TanStack Query
- **Authentication:** Firebase Auth or Auth0 (client-side)

### Mobile Stack
- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Styling:** NativeWind (Tailwind for RN)
- **Navigation:** Expo Router
- **State Management:** Zustand + TanStack Query

### Shared Patterns
- Component-driven architecture
- API client abstraction layer
- Consistent design tokens across platforms
- Mobile-first responsive design

---

## 3. Backend Architecture

### Core Stack
- **Runtime:** Node.js
- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL

### Module Structure

```
backend/
├── src/
│   ├── auth/              # Authentication & Authorization
│   ├── users/             # Profiles, streaks, stats, badges
│   ├── contributions/     # Scoring, validation, reputation, anti-abuse
│   ├── learning/          # Quizzes, modules, categories, progress
│   ├── missions/          # Daily missions, completion tracking
│   ├── qa/                # Questions & Answers system
│   ├── communities/       # Groups, discussions, events
│   ├── impact/            # Sponsor campaigns, tracking, reporting
│   ├── moderation/        # Reporting, reviews, safety
│   ├── common/            # Guards, filters, interceptors, pipes
│   └── prisma/            # Schema, migrations, seeders
```

### Design Patterns
- **Modular monolith** (each domain = NestJS module)
- **Repository pattern** via Prisma
- **DTO validation** with class-validator
- **JWT Guards** for route protection
- **Global exception filters** for consistent error responses
- **Rate limiting** via throttler

---

## 4. Infrastructure Flow

### Request Lifecycle
1. Client sends HTTPS request with JWT
2. API Gateway (NestJS) receives request
3. Auth Guard validates JWT + role
4. Request reaches Controller
5. Controller delegates to Service layer
6. Service executes business logic
7. Prisma ORM queries PostgreSQL
8. Response flows back through interceptors
9. Client receives standardized JSON response

### Authentication Flow
1. User signs in via OAuth (Google/Apple) or email/password
2. Firebase/Auth0 returns ID token
3. Client sends ID token to backend `/auth/verify`
4. Backend verifies token + creates/updates user record
5. Backend issues platform JWT (short-lived access + refresh tokens)
6. Client stores tokens securely (httpOnly cookies on web, SecureStorage on mobile)

### Real-Time Events
- Socket.io or Supabase Realtime for:
  - Live mission progress updates
  - Community goal counters
  - Collaborative event signals
  - Notification delivery

---

## 5. Scalability Strategy

### Horizontal Scaling
- Stateless NestJS services behind load balancer
- PostgreSQL read replicas for analytics/reporting queries
- Redis for session caching and rate-limit counters

### Caching
- Redis for:
  - User session data
  - Leaderboards (time-bucketed)
  - Contribution score aggregates
  - Rate limit counters
- CDN (Cloudflare) for:
  - Static assets
  - Lesson content delivery

### Database Optimization
- Indexing strategy on: `user_id`, `created_at`, `category`, `status`
- Pagination on all list endpoints (cursor-based for feeds)
- Prisma connection pooling

### Queue Systems (Future)
- BullMQ / RabbitMQ for:
  - Contribution score recalculation
  - Impact report generation
  - Bulk notification delivery
  - AI moderation jobs

---

## 6. Security Architecture

- JWT with short expiration + refresh token rotation
- Rate limiting on all public endpoints
- CORS configured for known origins only
- Helmet.js for HTTP security headers
- Input sanitization via ValidationPipe
- SQL injection prevention via Prisma ORM parameterized queries
- File upload restrictions (size, type, virus scanning)

---

## 7. Recommended Infrastructure

| Layer | Technology |
|-------|-----------|
| Web Hosting | Vercel |
| Backend Hosting | Railway / Render |
| Database | Supabase PostgreSQL / NeonDB |
| File Storage | Supabase Storage / AWS S3 |
| Cache | Redis (Upstash / Railway) |
| CDN | Cloudflare |
| Monitoring | Sentry + PostHog + Grafana |
| CI/CD | GitHub Actions |
