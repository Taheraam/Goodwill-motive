# Goodwill Motive

Cross-platform humanitarian social-learning ecosystem.

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Backend
```bash
cd backend
# Set DATABASE_URL in .env
npm run start:dev
```

### Web Frontend
```bash
cd frontend-web
npm run dev
```

### Mobile (Expo)
```bash
cd frontend-mobile
npx expo start
```

## Project Structure

```
goodwill-motive/
├── docs/              # Technical documentation (PRD, Architecture, etc.)
├── frontend-web/      # Next.js web application
├── frontend-mobile/   # React Native + Expo mobile app
├── backend/           # NestJS + Prisma API
├── database/          # DB migrations & seeders
├── design-system/     # Shared design tokens
└── infrastructure/   # IaC & deployment configs
```