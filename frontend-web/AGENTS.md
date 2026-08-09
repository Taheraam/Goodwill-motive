# Goodwill Motive — Web Frontend Agent

## Stack
- Next.js 15 (App Router + Turbopack)
- TypeScript
- TailwindCSS v4 (use `@import "tailwindcss"` NOT `@tailwind base/components/utilities`)
- Zustand for auth state
- TanStack Query via `@tanstack/react-query`
- Axios for API calls

## TailwindCSS v4 Notes
- CSS: `@import "tailwindcss"` at top
- Custom theme: `@theme { --color-primary: #E85D04; }`
- No `tailwind.config.js` needed for v4
- Use `bg-primary`, `text-primary` etc. after defining in `@theme`

## API Client
- Base: `src/lib/api.ts`
- Intercepts requests to add `Authorization: Bearer <token>`
- Token stored in `localStorage` via `src/store/auth.ts`

## Key Files
- `src/app/page.tsx` — Landing page
- `src/app/globals.css` — Tailwind + design tokens
- `src/lib/api.ts` — Axios client
- `src/store/auth.ts` — Zustand auth store

## Run Commands
```bash
cd frontend-web
npm run dev      # dev server
npm run build    # production build
```