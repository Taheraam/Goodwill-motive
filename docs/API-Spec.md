# API Specification

## Goodwill Motive

---

## Base URL

- **Development:** `http://localhost:3001`
- **Staging:** `https://api-staging.goodwillmotive.org`
- **Production:** `https://api.goodwillmotive.org`

---

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_access_token>
```

---

## Response Format

All responses follow this envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## Endpoints

### Authentication

#### POST /auth/signup
Create user account via email/password.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "learner_01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "username": "learner_01", "email": "user@example.com" },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

---

#### POST /auth/login
Authenticate user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

---

#### POST /auth/oauth
Verify OAuth token from Google/Apple.

**Body:**
```json
{
  "provider": "google",
  "idToken": "..."
}
```

---

#### POST /auth/refresh
Refresh access token.

**Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

---

#### POST /auth/logout
End session (revoke refresh token).

---

#### GET /auth/me
Return current authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "username": "learner_01",
    "email": "user@example.com",
    "role": "user",
    "streakCount": 12,
    "contributionScore": 1450,
    "reputationScore": 89
  }
}
```

---

### Users

#### GET /users/:id
Fetch public profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "username": "learner_01",
    "avatarUrl": "https://...",
    "bio": "Passionate about learning and helping others.",
    "streakCount": 12,
    "longestStreak": 30,
    "contributionScore": 1450,
    "reputationScore": 89,
    "badges": [
      { "id": "...", "name": "First Steps", "iconUrl": "...", "awardedAt": "..." }
    ],
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

#### PATCH /users/:id
Update profile (own profile only, unless admin).

**Body:**
```json
{
  "username": "new_name",
  "bio": "Updated bio",
  "avatarUrl": "https://..."
}
```

---

#### GET /users/:id/stats
Fetch detailed contribution stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalQuizzesCompleted": 42,
    "totalQuestionsAnswered": 15,
    "totalTeachingMinutes": 120,
    "totalMissionsCompleted": 28,
    "communityGoalsContributed": 5,
    "impactGenerated": {
      "mealsFunded": 14,
      "tutoringHoursSupported": 3
    }
  }
}
```

---

#### GET /users/leaderboard
Fetch global contribution leaderboard.

**Query:**
- `period` (optional): `week`, `month`, `all_time` — default `all_time`
- `limit` (optional): default 50, max 100
- `cursor` (optional): pagination cursor

---

### Missions

#### GET /missions
Fetch active missions for current user.

**Query:**
- `type` (optional): `learning`, `teaching`, `collaboration`
- `includeDaily` (optional): boolean — default true

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Complete 3 Quizzes",
      "description": "Test your knowledge in any category.",
      "missionType": "learning",
      "contributionReward": 50,
      "rules": { "minQuizzes": 3 },
      "status": "in_progress",
      "progress": { "quizzesCompleted": 1 },
      "endsAt": "2026-05-10T23:59:59Z"
    }
  ]
}
```

---

#### GET /missions/:id
Fetch mission details.

---

#### POST /missions/:id/complete
Submit mission completion (validated server-side).

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": true,
    "contributionAwarded": 50,
    "newScore": 1500,
    "newStreak": 13
  }
}
```

---

### Contributions

#### GET /contributions/me
Fetch personal contribution history.

**Query:**
- `limit` (optional): default 20
- `cursor` (optional): pagination cursor

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "actionType": "quiz_complete",
      "contributionValue": 25,
      "qualityScore": 85,
      "createdAt": "2026-05-09T08:30:00Z"
    }
  ]
}
```

---

#### POST /contributions/validate
Admin/moderator endpoint to validate a contribution.

**Body:**
```json
{
  "contributionId": "...",
  "validationScore": 90,
  "notes": "High quality answer"
}
```

---

### Questions & Answers

#### GET /questions
Fetch questions feed.

**Query:**
- `category` (optional): category ID
- `status` (optional): `open`, `solved`
- `limit` (optional): default 20
- `cursor` (optional): pagination cursor

---

#### POST /questions
Create a question.

**Body:**
```json
{
  "title": "How does photosynthesis work?",
  "content": "I'm confused about the role of chlorophyll...",
  "categoryId": "..."
}
```

---

#### GET /questions/:id
Fetch question with answers.

---

#### POST /answers
Submit an answer.

**Body:**
```json
{
  "questionId": "...",
  "content": "Chlorophyll absorbs light energy..."
}
```

---

#### POST /answers/:id/upvote
Upvote an answer.

---

#### POST /answers/:id/accept
Mark answer as accepted (question author only).

---

### Learning (Quizzes & Lessons)

#### GET /lessons
Fetch lessons.

**Query:**
- `category` (optional)
- `difficulty` (optional): `beginner`, `intermediate`, `advanced`

---

#### GET /lessons/:id
Fetch lesson details.

---

#### GET /quizzes
Fetch quizzes.

**Query:**
- `category` (optional)
- `difficulty` (optional)

---

#### GET /quizzes/:id
Fetch quiz with questions.

---

#### POST /quizzes/:id/attempt
Submit quiz attempt.

**Body:**
```json
{
  "answers": [
    { "questionIndex": 0, "selectedOption": 2 },
    { "questionIndex": 1, "selectedOption": 0 }
  ],
  "timeTakenSeconds": 120
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "maxScore": 10,
    "percentage": 80,
    "contributionAwarded": 20,
    "passed": true
  }
}
```

---

### Communities

#### GET /communities
Fetch communities.

**Query:**
- `type` (optional)
- `search` (optional)

---

#### GET /communities/:id
Fetch community details with members.

---

#### POST /communities/:id/join
Join a community.

---

#### POST /communities/:id/leave
Leave a community.

---

### Impact

#### GET /impact/dashboard
Fetch humanitarian metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "globalStats": {
      "totalQuizzesCompleted": 54200,
      "totalMealsFunded": 1240,
      "totalTutoringHours": 360,
      "totalContributors": 8400
    },
    "activeCampaigns": [
      {
        "id": "...",
        "name": "Feed a Child Campaign",
        "sponsor": "GlobalLearn Foundation",
        "targetAmount": 5000,
        "currentAmount": 3240,
        "unit": "meals",
        "endsAt": "2026-06-01T00:00:00Z"
      }
    ],
    "personalImpact": {
      "mealsFunded": 14,
      "tutoringHoursSupported": 3,
      "communityGoalsHelped": 5
    }
  }
}
```

---

#### GET /impact/campaigns
Fetch all sponsor campaigns.

---

#### GET /impact/campaigns/:id
Fetch campaign details.

---

### Moderation

#### POST /reports
Submit a report.

**Body:**
```json
{
  "targetType": "answer", -- question, answer, user, community
  "targetId": "...",
  "reason": "harassment", -- harassment, spam, misinformation, other
  "details": "This answer contains abusive language."
}
```

---

## Rate Limits

| Endpoint Category | Limit |
|-------------------|-------|
| Authentication | 10 requests / minute |
| General API | 100 requests / minute |
| Contribution submission | 30 requests / minute |
| Quiz attempts | 20 requests / minute |
