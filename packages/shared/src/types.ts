/**
 * Shared TypeScript types for the Goodwill Motive platform.
 * Used by both backend and frontend to ensure API contract consistency.
 */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  bio?: string | null;
  role: string;
  contributionScore: number;
  reputationScore: number;
  streakCount: number;
  longestStreak: number;
  lastActivityDate?: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface UserStats {
  contributionScore: number;
  streakCount: number;
  longestStreak: number;
  reputationScore: number;
  quizCount: number;
  questionCount: number;
  answerCount: number;
  missionCount: number;
}

export interface MissionSummary {
  id: string;
  title: string;
  description: string;
  missionType: string;
  contributionReward: number;
  isDaily: boolean;
}

export interface CampaignSummary {
  id: string;
  name: string;
  description?: string | null;
  sponsor?: string | null;
  currentAmount: number;
  targetAmount: number;
  unit: string;
  isActive: boolean;
}

export interface QuizSummary {
  id: string;
  title: string;
  difficulty: string;
  contributionValue: number;
  category: { name: string } | null;
}

export interface QuestionSummary {
  id: string;
  title: string;
  content: string;
  status: string;
  viewCount: number;
  author: { id: string; username: string; avatarUrl?: string | null };
  _count: { answers: number };
}

export interface QuizAttemptResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatarUrl?: string | null;
  contributionScore: number;
  streakCount: number;
}

export interface ImpactDashboard {
  globalStats: {
    totalQuizzesCompleted: number;
    totalMealsFunded: number;
    totalTutoringHours: number;
    totalContributors: number;
  };
  activeCampaigns: CampaignSummary[];
  personalImpact: {
    mealsFunded: number;
    tutoringHoursSupported: number;
    communityGoalsHelped: number;
  };
}

/** JWT payload structure */
export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}
