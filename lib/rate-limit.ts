// lib/rate-limit.ts
// In-memory sliding window rate limiter for failed join code attempts per security.md.
// Tracks failed attempts only; venue IP addresses have a high ceiling (60 attempts per 10 minutes).

export const FAILED_JOIN_CODES_LIMIT = 60;
export const FAILED_JOIN_CODES_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export const RATE_LIMIT_MESSAGES = {
  joinCodeExceeded: 'Too many failed code attempts. Please wait a few minutes before trying again.',
} as const;

// In-memory record storing timestamps of failed attempts per IP
const failedJoinAttemptsByIp = new Map<string, number[]>();

/**
 * Checks whether an IP address is allowed to attempt a join code.
 * Cleans expired timestamps outside the sliding window.
 */
export function isJoinCodeAttemptAllowed(ip: string, now: number = Date.now()): boolean {
  if (!ip) {
    return true;
  }

  const attempts = failedJoinAttemptsByIp.get(ip);
  if (!attempts || attempts.length === 0) {
    return true;
  }

  const cutoff = now - FAILED_JOIN_CODES_WINDOW_MS;
  const recentAttempts = attempts.filter((timestamp) => timestamp > cutoff);

  if (recentAttempts.length !== attempts.length) {
    if (recentAttempts.length === 0) {
      failedJoinAttemptsByIp.delete(ip);
      return true;
    }
    failedJoinAttemptsByIp.set(ip, recentAttempts);
  }

  return recentAttempts.length < FAILED_JOIN_CODES_LIMIT;
}

/**
 * Records a single failed join code attempt for an IP address.
 */
export function recordFailedJoinCodeAttempt(ip: string, now: number = Date.now()): void {
  if (!ip) {
    return;
  }

  const cutoff = now - FAILED_JOIN_CODES_WINDOW_MS;
  const existing = failedJoinAttemptsByIp.get(ip) ?? [];
  const recent = existing.filter((timestamp) => timestamp > cutoff);
  recent.push(now);

  failedJoinAttemptsByIp.set(ip, recent);
}

/**
 * Clears recorded attempts for an IP address. Used primarily in unit tests.
 */
export function resetJoinCodeRateLimit(ip: string): void {
  failedJoinAttemptsByIp.delete(ip);
}
