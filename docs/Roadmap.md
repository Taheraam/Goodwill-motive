# Roadmap Document

## Goodwill Motive

---

## Phase 1 — Foundation (Completed)

- [x] Philosophy and ethical boundaries defined
- [x] Product name: Goodwill Motive
- [x] Contribution system concept
- [x] Emotional direction and UX principles
- [x] Technical stack selected
- [x] Project folder structure created
- [x] Documentation suite (PRD, Architecture, Database Design, API Spec, Contribution Engine, UX Flows)

---

## Phase 2 — MVP Core (In Progress)

### Goals
Validate emotional connection, retention, meaningful participation, and contribution mechanics.

### Features
- [ ] Authentication (Email, Google, Apple OAuth)
- [ ] User profiles with avatars, streaks, contribution score
- [ ] Daily missions system
- [ ] Quiz system (categories, difficulties, progress tracking)
- [ ] Question & Answer system
- [ ] Contribution engine (scoring, validation, streaks, anti-abuse)
- [ ] Community goals (simple global counters)
- [ ] Impact dashboard (personal + global metrics)
- [ ] Landing page (web)
- [ ] Basic moderation (AI-assisted + user reporting)

### Technical Milestones
- [ ] Next.js web app scaffolded and running
- [ ] Expo mobile app scaffolded and running
- [ ] NestJS backend with Prisma ORM
- [ ] PostgreSQL schema migrated
- [ ] REST API endpoints for all MVP features
- [ ] JWT authentication flow
- [ ] CI/CD pipeline (GitHub Actions)

### Timeline
- **Week 1-2:** Foundation + Auth + Profiles
- **Week 3-4:** Learning + Q&A systems
- **Week 5-6:** Contribution engine + Missions
- **Week 7-8:** Impact dashboard + Community goals
- **Week 9-10:** Polish, testing, validation

---

## Phase 3 — Community Expansion

### Goals
Increase retention through social features and collaboration.

### Features
- [ ] Community groups (study, language, humanitarian)
- [ ] Community joining / leaving / moderation
- [ ] Collaborative missions (community-specific)
- [ ] Rankings and leaderboards
- [ ] Cause-based groups
- [ ] Advanced interaction (comments, discussions)
- [ ] Push notifications system

### Technical Milestones
- [ ] Real-time updates (Socket.io or Supabase Realtime)
- [ ] Advanced caching strategy (Redis)
- [ ] Notification service integration
- [ ] Enhanced moderation queue

---

## Phase 4 — Humanitarian Expansion

### Goals
Connect platform activity to real-world outcomes transparently.

### Features
- [ ] NGO partnership portal
- [ ] Sponsor campaign creation and management
- [ ] Advanced transparency reports
- [ ] Verified impact tracking
- [ ] Campaign attribution in user impact dashboards
- [ ] Public API for third-party impact verification

### Technical Milestones
- [ ] Impact calculation service
- [ ] Integration with sponsor APIs
- [ ] Reporting pipeline
- [ ] Audit log system

---

## Phase 5 — AI Augmentation

### Goals
Support humans at scale without replacing human connection.

### Features
- [ ] AI-assisted moderation (toxicity detection, spam filtering)
- [ ] Educational assistance (concept explanations, quiz hints)
- [ ] Translation system for multilingual support
- [ ] Impact analytics and summarization
- [ ] Personalized learning recommendations

### Technical Milestones
- [ ] AI service integration (OpenAI / Claude / local models)
- [ ] Multilingual content pipeline
- [ ] Recommendation engine

---

## Phase 6 — Global Scale

### Goals
Scale to multiple regions and languages with enterprise reliability.

### Features
- [ ] Full localization (i18n)
- [ ] Regional community support
- [ ] Multi-region infrastructure
- [ ] Advanced analytics and A/B testing
- [ ] Enterprise/institutional accounts
- [ ] Advanced security and compliance (GDPR, COPPA)

### Technical Milestones
- [ ] CDN edge deployment
- [ ] Database read replicas per region
- [ ] Automated scaling infrastructure
- [ ] Compliance audits

---

## Feature Priority Matrix

| Feature | Phase | Priority | Risk |
|---------|-------|----------|------|
| Authentication | MVP | Critical | Low |
| Profiles + Streaks | MVP | Critical | Low |
| Quizzes | MVP | Critical | Low |
| Q&A System | MVP | Critical | Medium |
| Contribution Engine | MVP | Critical | Medium |
| Daily Missions | MVP | Critical | Low |
| Impact Dashboard | MVP | High | Low |
| Community Goals | MVP | High | Low |
| Communities | Phase 3 | High | Medium |
| Leaderboards | Phase 3 | Medium | Low |
| NGO Integration | Phase 4 | High | High |
| Sponsor Campaigns | Phase 4 | High | High |
| AI Moderation | Phase 5 | Medium | Medium |
| Translation | Phase 5 | Medium | Medium |
| Live Tutoring | Future | Low | High |
| Blockchain | Future | Low | High |

---

## Technical Debt Tracking

### Known Shortcuts (MVP)
1. **In-memory rate limiting** → Replace with Redis-backed throttler in Phase 3
2. **Simple quiz JSON storage** → Migrate to structured quiz engine in Phase 3
3. **Manual sponsor impact updates** → Automated pipeline in Phase 4
4. **Single-region deployment** → Multi-region in Phase 6

### Future Rewrites
- Contribution engine v2: Event-sourced architecture for auditability
- Real-time system migration to dedicated service
- Mobile app navigation refactor once feature set stabilizes

---

## Review Cadence

- **Weekly:** Development sprint review
- **Bi-weekly:** Product + UX review
- **Monthly:** Architecture + roadmap review
- **Quarterly:** Strategic direction review
