# Goodwill Motive MVP — Task Tracker

## ✅ COMPLETED — UI/UX Redesign
- [x] Landing page redesigned with Earth video hero
- [x] SVG icon library (60+ icons)
- [x] Glassmorphism design system (globals.css)
- [x] Navbar, HeroVideo, ScrollReveal components
- [x] Login, Signup pages redesigned
- [x] App pages redesigned: dashboard, missions, learn, impact, profile
- [x] Admin pages redesigned: login, dashboard, users, reports
- [x] OAuth callback page
- [x] Google OAuth on signup + login
- [x] Hero text / spacing fixed
- [x] Stats moved below hero section

## ✅ COMPLETED — Build Session 1
- [x] Smooth scroll for anchor links (`html { scroll-behavior: smooth }`)
- [x] Mobile hamburger menu closes on link tap
- [x] Skeleton loading component created (`components/Skeleton.tsx`)
- [x] Toast notifications installed (`sonner`)
- [x] Toaster added to root layout with glass styling
- [x] Toast on login success/error in auth store
- [x] Toast on signup success/error in auth store
- [x] Skeleton loading applied to dashboard (missions + campaigns)

## 🔴 MUST DO — Core Functionality
- [ ] Verify Google OAuth redirect URI in Google Cloud Console
- [ ] Test signup flow end-to-end with new credentials
- [ ] Test login flow with `admin@goodwill.com / Admin@1234`
- [ ] Connect Q&A "Ask Question" button → POST `/api/questions`
- [ ] Connect quiz attempt flow (take quiz → submit → score)
- [ ] Connect mission completion button → POST `/missions/:id/complete`

## 🟡 MEDIUM PRIORITY — UX Polish
- [ ] Skeleton loading for other pages (missions, learn, impact, profile, admin)
- [ ] Add dark mode toggle in settings
- [ ] Profile settings page (password change, edit username)
- [ ] Admin users page — real table with role editing
- [ ] Admin reports page — real moderation with approve/reject
- [ ] Fix responsive layout on 320px screens

## 🟢 NICE TO HAVE
- [ ] SEO meta tags + OpenGraph
- [ ] Favicon
- [ ] Custom 404 page
- [ ] Accessibility audit (aria-labels, focus management)
- [ ] Leaderboard page
- [ ] Badge showcase page
- [ ] Notification system (Socket.io)
- [ ] Live quiz competition (multiplayer)
- [ ] Performance optimization (lazy load, Suspense)
