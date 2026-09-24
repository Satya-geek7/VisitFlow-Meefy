/**
 * System-wide constants for Express Backend (apps/api)
 * Strict compliance with RULES.md §10
 */

export const OTP_CONFIG = {
  /** Length of the numerical OTP code */
  DIGITS: 6,
  /** Time to live in seconds (10 minutes) */
  TTL_SECONDS: 600,
  /** Maximum failed attempts before lockout */
  MAX_ATTEMPTS: 5,
  /** Minimum seconds to wait before requesting another OTP for same phone */
  COOLDOWN_SECONDS: 60,
  /** Maximum sends per phone per rate limit window */
  MAX_SENDS_PER_WINDOW: 3,
  /** Window for rate limiting sends in milliseconds (10 minutes) */
  RATE_LIMIT_WINDOW_MS: 10 * 60 * 1000,
} as const;

export const SESSION_CONFIG = {
  /** Visitor session token validity in seconds (30 minutes) */
  TTL_SECONDS: 1800,
} as const;
