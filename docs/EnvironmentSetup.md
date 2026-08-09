# Goodwill Motive — Environment Variables

Copy this file to `.env` in each service and fill in the values.

---

## Backend (`backend/.env`)

```env
# Database (Supabase or local PostgreSQL)
# Example Supabase: postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
# Example local: postgresql://postgres:postgres@localhost:5432/goodwillmotive
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklm.supabase.co:5432/postgres"

# JWT secret — change this to a random 64+ char string in production
JWT_SECRET="dev-jwt-secret-change-in-production"

# API server port
PORT=3001

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3000"
```

---

## Frontend Web (`frontend-web/.env.local`)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Supabase (optional — only needed if using Supabase Auth directly)
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Frontend Mobile (`frontend-mobile/.env`)

```env
# Same as frontend web
EXPO_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Never commit these files!

```
.env
.env.local
.env.production
```

They are already in `.gitignore` via the workspaces' individual git repos.