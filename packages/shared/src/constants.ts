/**
 * Contribution point values used across the platform.
 * Single source of truth — never hardcode these in services or frontend.
 */
export const CONTRIBUTION_POINTS = {
  QUESTION_ASKED: 5,
  ANSWER_GIVEN: 10,
  ANSWER_ACCEPTED: 25,
  QUIZ_PASS_THRESHOLD: 60,
  MEALS_PER_POINT: 100,
  TUTORING_HOURS_PER_ACCEPTED: 0.5,
  TUTORING_HOURS_PER_ANSWER: 0.1,
} as const;

/**
 * Valid user roles in the system.
 */
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Action types used in the contribution system.
 */
export const ACTION_TYPES = {
  QUIZ_COMPLETE: 'quiz_complete',
  QUESTION_ASKED: 'question_asked',
  ANSWER_GIVEN: 'answer_given',
  ANSWER_ACCEPTED: 'answer_accepted',
  MISSION_COMPLETE: 'mission_complete',
} as const;

export type ActionType = (typeof ACTION_TYPES)[keyof typeof ACTION_TYPES];

/**
 * Status values for questions.
 */
export const QUESTION_STATUS = {
  OPEN: 'open',
  SOLVED: 'solved',
  CLOSED: 'closed',
} as const;

/**
 * Status values for missions.
 */
export const MISSION_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
} as const;

/**
 * Status values for reports.
 */
export const REPORT_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed',
} as const;

/**
 * Quiz difficulty levels.
 */
export const DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];
