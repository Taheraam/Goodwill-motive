# Contribution Engine Specification

## Goodwill Motive

---

## 1. Core Principle

Contribution must reward:
- **Usefulness**
- **Quality**
- **Consistency**
- **Real participation**

NOT spam activity.

---

## 2. Contribution Formula

```
Contribution Score = Quality × Consistency × Validation × Meaningful Impact
```

### Scaled Calculation

For each action, the system computes:

```
base_points = action_type_base_value
quality_multiplier = (quality_score / 100) ^ 1.5  -- e.g., 0.71 at quality 80
validation_multiplier = (validation_score / 100) ^ 1.2
streak_multiplier = min(1 + (streak_count × 0.02), 2.0)  -- max 2x at 50-day streak
reputation_weight = 1 + (reputation_score / 1000)  -- slight boost for trusted users

final_contribution = base_points × quality_multiplier × validation_multiplier × streak_multiplier × reputation_weight
```

**Rounded to nearest integer. Minimum 1 point per valid action.**

---

## 3. Action Type Base Values

| Action | Base Points |
|--------|------------|
| `quiz_complete` | 10 (× difficulty: 1× / 1.5× / 2×) |
| `quiz_perfect_score` | +5 bonus |
| `answer_submitted` | 5 |
| `answer_accepted` | 25 |
| `answer_upvoted` | 3 (per upvote, max 5 per answer) |
| `mission_complete` | 20-100 (based on mission difficulty) |
| `streak_maintain` | 2 (daily login + activity) |
| `streak_milestone` | 50 (7 days), 200 (30 days), 500 (100 days) |
| `lesson_created` | 15 |
| `lesson_completed` | 10 |
| `community_goal_contribution` | 10 |
| `profile_completed` | 5 (one-time) |

---

## 4. Quality Score (0-100)

Determined by:

| Factor | Weight | How Calculated |
|--------|--------|----------------|
| Peer validation | 30% | Upvotes, accepted answers |
| Consistency | 25% | Regularity of contributions |
| Content length & depth | 20% | Answer length, quiz performance |
| Anti-spam signals | 25% | Not flagged, passes AI check |

---

## 5. Validation Score (0-100)

Determined by:

| Factor | Weight | How Calculated |
|--------|--------|----------------|
| Community upvotes | 40% | Ratio of upvotes to views |
| Moderator validation | 30% | Explicit moderator approval |
| AI moderation pass | 20% | Toxicity / spam score |
| Author reputation | 10% | Reputation of contributing user |

---

## 6. Reputation System

### Reputation Score (0-1000)
- Starts at 100 for new users
- Gains: +5 per accepted answer, +2 per helpful answer, +10 per milestone
- Losses: -20 per spam flag (confirmed), -50 per harassment report (confirmed)

### Trust Tiers

| Tier | Score | Benefits |
|------|-------|----------|
| Newcomer | 0-99 | Limited daily actions, requires review |
| Contributor | 100-299 | Full participation |
| Mentor | 300-599 | Validation weight × 1.5 |
| Leader | 600-999 | Validation weight × 2.0, moderation votes |
| Legend | 1000+ | Validation weight × 2.5, community moderation |

---

## 7. Streak System

### Rules
- Streak increments when user completes **at least one meaningful action** per calendar day
- Meaningful actions: quiz, answer, mission completion
- Grace period: If user misses 1 day, streak continues (displayed as "Protected")
- If user misses 2+ consecutive days, streak resets to 0

### Streak Multipliers

| Streak | Multiplier |
|--------|-----------|
| 1-6 days | 1.0 |
| 7-13 days | 1.14 |
| 14-29 days | 1.28 |
| 30-49 days | 1.6 |
| 50+ days | 2.0 (cap) |

---

## 8. Progression Titles

### Beginner (0-499 contribution score)
- **Contributor** (0-99)
- **Learner** (100-249)
- **Guide** (250-499)

### Intermediate (500-1999)
- **Mentor** (500-999)
- **Educator** (1000-1499)
- **Collaborator** (1500-1999)

### Advanced (2000+)
- **Humanitarian Mentor** (2000-3499)
- **Knowledge Builder** (3500-5999)
- **Community Leader** (6000+)

---

## 9. Anti-Abuse Systems

### 9.1 Rate Limiting
Max actions per time window per user:
- Answers: 10/hour
- Questions: 5/hour
- Quizzes: 20/hour
- Missions: 5/hour

### 9.2 Cooldowns
- Same quiz cannot be retaken within 10 minutes
- Same question cannot be answered multiple times by same user
- Consecutive identical actions trigger warning

### 9.3 Farming Detection
Flag if within 1 hour:
- More than 5 quizzes with 0% score
- More than 3 answers with <20 length and 0 upvotes
- Rapid sequential actions (<3 seconds apart)

### 9.4 Duplicate Detection
- Exact text match across answers → flagged
- Similarity > 85% via hash → flagged
- Cross-references reported to moderators

### 9.5 Suspicious Activity Scoring

| Behavior | Score Penalty |
|----------|---------------|
| Rapid-fire actions | -10 per burst |
| Zero-effort answers | -5 each |
| Confirmed spam | -50 + content removal |
| Bot-like patterns | Account review + -100 |

---

## 10. Badge System

### Milestone Badges

| Badge | Requirement |
|-------|-------------|
| First Steps | Complete first quiz |
| helper | Answer first question |
| On Fire | 7-day streak |
| Unstoppable | 30-day streak |
| Legendary | 100-day streak |
| Quiz Whiz | Complete 50 quizzes |
| Teacher\'s Pet | Have 10 answers accepted |
| Community Hero | Contribute to 10 community goals |
| Rising Star | Reach 500 contribution score |
| Humanitarian | Reach 2000 contribution score |

---

## 11. Community Goals

### Goal Types
- `global_quiz_count`: Complete X quizzes globally
- `global_teaching_minutes`: Teach for X minutes collectively
- `global_doubts_solved`: Solve X questions together

### Contribution Distribution
When a community goal is achieved:
1. All participants who contributed receive bonus points
2. Bonus = (personal_contribution / total_contribution) × goal_reward_pool
3. Minimum 1 point for any participation

---

## 12. Impact Conversion

Community activity triggers sponsor-backed humanitarian outcomes.

### Conversion Rules
- Every 1000 quizzes completed globally → sponsor funds 1 meal
- Every 100 questions answered → sponsor funds 30 min tutoring support
- Every 10 community goals achieved → sponsor funds educational materials

These ratios are configurable per campaign and stored in `impact_campaigns`.

---

## 13. Re-calculation & Backfills

### Score Recalculation
- User contribution score is **derived** from contributions table, not stored as raw value
- However, `users.contribution_score` is cached and updated via triggers / background jobs
- If recalculation needed: sum all `contribution_value` from `contributions` where `user_id = ?`

### Daily Jobs
- Streak evaluation (runs at 00:05 UTC)
- Badge assignment check
- Leaderboard cache refresh
- Impact campaign progress update
