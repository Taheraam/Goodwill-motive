# Database Design Document

## Goodwill Motive

---

## 1. Entity Relationship Overview

```
users ||--o{ contributions : makes
users ||--o{ questions : asks
users ||--o{ answers : writes
users ||--o{ lessons : creates
users ||--o{ user_missions : participates
users ||--o{ user_communities : joins
users ||--o{ user_badges : earns

missions ||--o{ user_missions : assigned_to

questions ||--o{ answers : has
questions }o--|| categories : belongs_to

answers }o--|| questions : answers

lessons }o--|| categories : belongs_to

communities ||--o{ user_communities : has

badges ||--o{ user_badges : awarded

impact_campaigns ||--o{ impact_records : generates
```

---

## 2. Table Schemas

### 2.1 users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'user', -- user, moderator, admin
  contribution_score INTEGER NOT NULL DEFAULT 0,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  streak_count INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_users_username` (username)
- `idx_users_email` (email)
- `idx_users_contribution_score` (contribution_score DESC)

**Constraints:**
- `username` must match `^[a-zA-Z0-9_]{3,50}$`
- `role` in `('user', 'moderator', 'admin')`

---

### 2.2 categories

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'learning', 'humanitarian', 'language'
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.3 missions

```sql
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  mission_type VARCHAR(50) NOT NULL, -- 'learning', 'teaching', 'collaboration'
  contribution_reward INTEGER NOT NULL DEFAULT 0,
  rules JSONB NOT NULL DEFAULT '{}', -- e.g., {"min_quizzes": 3}
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_daily BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_missions_active_dates` (is_active, starts_at, ends_at)
- `idx_missions_daily` (is_daily, is_active)

---

### 2.4 user_missions

```sql
CREATE TABLE user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress', -- in_progress, completed, expired
  progress JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);
```

**Indexes:**
- `idx_user_missions_user` (user_id, status)

---

### 2.5 contributions

```sql
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'quiz_complete', 'answer_helpful', 'mission_complete', 'streak_maintain'
  contribution_value INTEGER NOT NULL DEFAULT 0,
  quality_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  validation_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_contributions_user` (user_id, created_at DESC)
- `idx_contributions_type` (action_type, created_at DESC)

---

### 2.6 questions

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- open, solved, closed
  accepted_answer_id UUID,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_questions_author` (author_id, created_at DESC)
- `idx_questions_category` (category_id, status, created_at DESC)
- `idx_questions_status` (status, created_at DESC)

---

### 2.7 answers

```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  helpfulness_score INTEGER NOT NULL DEFAULT 0, -- 0-100
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_answers_question` (question_id, upvotes DESC)
- `idx_answers_author` (author_id, created_at DESC)

---

### 2.8 lessons

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_url TEXT,
  duration_minutes INTEGER,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner', -- beginner, intermediate, advanced
  engagement_metrics JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_lessons_category` (category_id, difficulty, created_at DESC)
- `idx_lessons_creator` (creator_id)

---

### 2.9 quizzes

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner',
  questions JSONB NOT NULL DEFAULT '[]', -- Array of {question, options, correctIndex, explanation}
  time_limit_seconds INTEGER,
  contribution_value INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.10 quiz_attempts

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]',
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Indexes:**
- `idx_quiz_attempts_user` (user_id, created_at DESC)

---

### 2.11 communities

```sql
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'study', -- study, language, humanitarian
  icon_url TEXT,
  member_count INTEGER NOT NULL DEFAULT 0,
  activity_metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.12 user_communities

```sql
CREATE TABLE user_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member', -- member, moderator, admin
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, community_id)
);
```

---

### 2.13 badges

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  requirement_type VARCHAR(50) NOT NULL, -- streak, contribution, teaching, milestone
  requirement_value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.14 user_badges

```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
```

---

### 2.15 impact_campaigns

```sql
CREATE TABLE impact_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sponsor VARCHAR(255),
  description TEXT,
  target_amount INTEGER NOT NULL, -- e.g., target meals to fund
  current_amount INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(50) NOT NULL DEFAULT 'meals', -- meals, hours, books
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  transparency_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2.16 impact_records

```sql
CREATE TABLE impact_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES impact_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL, -- quiz_complete, mission_complete, community_goal
  impact_value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Data Validation Rules

| Entity | Rule |
|--------|------|
| username | 3-50 chars, alphanumeric + underscore only |
| email | Valid email format, unique |
| contribution_score | Cannot be negative |
| streak_count | Cannot be negative; reset to 0 if gap > 1 day |
| quiz score | 0 <= score <= max_score |
| mission status | Enum: in_progress, completed, expired |
| question status | Enum: open, solved, closed |
| role | Enum: user, moderator, admin |

---

## 4. Query Optimization Notes

### Heavy Queries
- Leaderboard aggregation (cached in Redis, refreshed every 5 min)
- Contribution history with pagination (cursor-based)
- Community goal progress (materialized or cached)

### Indexing Strategy
- All foreign keys indexed automatically by Prisma
- Composite indexes on `(user_id, created_at DESC)` for feed queries
- Partial index on `questions(status = 'open')` for active feeds

### Pagination Strategy
- Cursor-based pagination for all list endpoints to avoid OFFSET performance degradation
- Keyset pagination using `(created_at, id)` composite cursor

### Caching Requirements
- User profile stats: 1 minute
- Leaderboards: 5 minutes
- Active missions: 1 minute
- Community goal progress: 30 seconds
