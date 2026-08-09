# UX Flow Documentation

## Goodwill Motive

---

## 1. Onboarding Flow

### 1.1 Landing Page
- Hero headline: **"Learn Together. Help Others. Change Real Lives."**
- Subtitle brief explanation
- Primary CTA: **"Start Contributing"**
- Secondary CTA: **"Join the Mission"**
- Live impact counter scrolling (meals funded, contributors, etc.)

### 1.2 Account Creation
```
Landing Page
  → Click "Start Contributing"
  → Sign Up Screen (Email / Google / Apple)
  → Terms & Community Guidelines Acknowledgment
  → Welcome Animation
```

### 1.3 Profile Setup
```
Welcome
  → Choose Username + Avatar
  → Select Interests (Learning categories)
  → Select Causes (Humanitarian focus areas)
  → Choose Learning Topics
  → Brief tour tooltip (3 steps)
  → First Mission Unlocked
```

### 1.4 First Mission
- Immediate assignment: "Complete Your First Quiz"
- Inline guidance on how quizzes work
- Immediate contribution points awarded
- Emotional feedback: "You just funded 0.1 meals!"

---

## 2. Daily Ritual Flow

### 2.1 Opening the App
```
Splash Screen (warm, hopeful animation)
  → Home Dashboard
    ├─ Daily Mission Card (prominent, top)
    ├─ Streak Indicator (flame icon + days)
    ├─ Contribution Score Progress Bar
    ├─ Community Goal Progress Bar
    └─ Quick Actions: Quiz | Answer | Teach
```

### 2.2 Mission Completion Loop
```
Tap Daily Mission
  → Mission Detail Screen
    ├─ Objective description
    ├─ Estimated time
    ├─ Contribution reward preview
    └─ Progress tracker
  → Complete Required Action(s)
  → Success Screen
    ├─ Contribution points earned (animated)
    ├─ Streak maintained / increased
    ├─ Impact generated ("+0.5 meals funded")
    └─ Share option (optional, non-intrusive)
  → Return to Dashboard (updated state)
```

### 2.3 End-of-Day Narrative
- Optional evening summary notification:
  - "Today you: completed 2 quizzes, helped 1 person, maintained your 12-day streak."
  - "Your actions helped fund 1.2 meals today."

---

## 3. Ask & Help Flow

### 3.1 Asking a Question
```
Tap "Ask" (bottom nav or FAB)
  → Question Form
    ├─ Title input (helper text: "Be specific")
    ├─ Category selector
    ├─ Rich text description
    └─ Submit
  → Confirmation: "Your question is live!"
  → View Question (with loading state for answers)
```

### 3.2 Answering a Question
```
Browse Questions Feed
  → Filter: Open | My Categories | Trending
  → Tap Question Card
  → Read Question
  → Tap "Answer"
  → Compose Answer (rich text, guidelines visible)
  → Submit
  → Confirmation: "Thanks for helping the community!"
  → Contribution points awarded
```

### 3.3 Validation Flow
```
Question Author Views Answers
  → Reads answers
  → Upvotes helpful answers
  → Marks best answer as "Accepted"
  → Both author and answerer receive contribution points
```

### 3.4 Moderation in Q&A
- AI triage runs on all submissions (< 200ms)
- Flagged content hidden pending review
- Users can report answers/questions
- Reported content enters moderation queue

---

## 4. Quiz & Learning Flow

### 4.1 Browsing Quizzes
```
Tap "Learn" (bottom nav)
  → Category Grid (Math, Science, Tech, Languages, etc.)
  → Difficulty Filter (Beginner / Intermediate / Advanced)
  → Quiz Cards (title, duration, difficulty, contributor avatar)
  → Tap to Preview
```

### 4.2 Taking a Quiz
```
Quiz Preview
  → Tap "Start Quiz"
  → Question Card (one at a time, swipe optional)
    ├─ Progress indicator
    ├─ Timer (if applicable)
    ├─ Multiple choice options
    └─ Skip option (no penalty, no points)
  → Submit Final Answer
  → Results Screen
    ├─ Score: X / Y
    ├─ Correct answers highlighted
    ├─ Explanations for incorrect answers
    ├─ Contribution points earned
    └─ CTA: "Next Quiz" or "Back to Learn"
```

### 4.3 Progress Tracking
- Profile → Learning tab shows:
  - Quizzes completed by category
  - Average score
  - Time spent learning
  - Skills growth chart (simple bar chart)

---

## 5. Community Interaction Flow

### 5.1 Discovering Communities
```
Tap "Connect" (bottom nav)
  → Community Discovery
    ├─ Search bar
    ├─ Categories: Study Groups | Languages | Humanitarian
    ├─ Trending communities
    └─ Recommended for you (based on interests)
```

### 5.2 Joining a Community
```
Tap Community Card
  → Community Detail Screen
    ├─ Name, description, member count
    ├─ Recent activity
    ├─ Active missions
    └─ Join button
  → Tap Join
  → Welcome message
  → Access to community-specific missions
```

### 5.3 Collaborative Missions
- Community-wide goals visible to all members
- Live progress bar updates
- Members list shows who contributed today
- Goal completion triggers celebration screen + bonus points

---

## 6. Impact & Transparency Flow

### 6.1 Personal Impact Dashboard
```
Tap "Impact" (bottom nav)
  → Personal Impact
    ├─ Total meals funded (animated counter)
    ├─ Total tutoring hours supported
    ├─ Learning stats (lessons, quizzes, answers)
    ├─ Streak calendar (heat map)
    └─ Recent contribution timeline
```

### 6.2 Global Impact Dashboard
- Scroll down from personal impact
- Global counter: "Community has funded 12,400 meals"
- Active campaigns with progress bars
- Sponsor attribution (ethical, non-intrusive)
- Recent transparency reports

### 6.3 Transparency Deep-Dive
```
Tap Campaign Card
  → Campaign Detail
    ├─ Sponsor name & verification badge
    ├─ Campaign goal & progress
    ├─ Conversion rules (e.g., "1000 quizzes = 1 meal")
    ├─ Distribution timeline
    ├─ NGO partner details
    └─ Verified outcome reports (PDF links)
```

---

## 7. Profile & Progression Flow

### 7.1 Profile Screen
```
Tap Profile (bottom nav)
  → Profile Header
    ├─ Avatar + Username + Title (e.g., "Mentor")
    ├─ Edit Profile button
    ├─ Contribution Score (big number)
    └─ Streak badge
  → Tabs:
    ├─ Stats (charts & numbers)
    ├─ Badges (earned + locked)
    ├─ Activity (recent contributions)
    └─ Impact (humanitarian outcomes)
```

### 7.2 Level Up Experience
When user crosses a title threshold:
- Subtle celebration animation
- New title displayed prominently
- Share card generated (optional)
- Next milestone preview

---

## 8. Error & Empty States

### 8.1 No Connection
- Warm illustration + message: "Even helpers need a breather. Check your connection."
- Retry button

### 8.2 Empty Feed
- "No questions in this category yet. Be the first to ask!"
- Primary CTA to create content

### 8.3 Mission Failed / Expired
- "This mission has ended. But your streak is safe — new missions arrive daily!"
- No guilt, no penalty beyond mission expiration

---

## 9. Notification Strategy

### 9.1 Push Notifications (Respectful)
- **Daily Mission Ready** (morning, ~8am local): "Today's mission is ready. 5 minutes to make an impact."
- **Streak Warning** (evening, if no activity): "Just a tap away from keeping your streak alive."
- **Answer Accepted**: "Your answer was marked as helpful! +25 points."
- **Community Goal Near Completion**: "We're 90% to our weekly goal!"

### 9.2 Notification Rules
- Never more than 3 push notifications per day
- No guilt-based copy (avoid "Don't break your streak!")
- Focus on opportunity, not obligation
- Easy opt-out in settings

---

## 10. Responsive Behavior

### Mobile (Primary)
- Bottom tab navigation (4-5 tabs)
- Stacked card layouts
- Full-screen modals for creation flows
- Swipe gestures for quiz navigation

### Tablet
- Side navigation rail
- Two-column layouts for feeds
- Split view for question + answers

### Desktop (Web)
- Top navigation bar
- Multi-column dashboard
- Persistent sidebar for impact stats
- Hover states for desktop interactions
