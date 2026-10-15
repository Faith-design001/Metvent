import { beforeEach, describe, expect, it } from 'vitest';
import {
  FAILED_JOIN_CODES_LIMIT,
  FAILED_JOIN_CODES_WINDOW_MS,
  isJoinCodeAttemptAllowed,
  recordFailedJoinCodeAttempt,
  resetJoinCodeRateLimit,
} from '../lib/rate-limit';

describe('Join Code Rate Limiter', () => {
  const testIp = '192.168.1.100';

  beforeEach(() => {
    resetJoinCodeRateLimit(testIp);
  });

  it('allows attempts initially', () => {
    expect(isJoinCodeAttemptAllowed(testIp)).toBe(true);
  });

  it('allows up to 60 failed attempts within a 10-minute window', () => {
    const baseTime = Date.now();
    for (let i = 0; i < FAILED_JOIN_CODES_LIMIT; i++) {
      expect(isJoinCodeAttemptAllowed(testIp, baseTime)).toBe(true);
      recordFailedJoinCodeAttempt(testIp, baseTime);
    }

    // 61st attempt is blocked
    expect(isJoinCodeAttemptAllowed(testIp, baseTime)).toBe(false);
  });

  it('allows attempts after the 10-minute window expires', () => {
    const baseTime = Date.now();
    for (let i = 0; i < FAILED_JOIN_CODES_LIMIT; i++) {
      recordFailedJoinCodeAttempt(testIp, baseTime);
    }
    expect(isJoinCodeAttemptAllowed(testIp, baseTime)).toBe(false);

    // After 10 minutes + 1 ms, it should be allowed again
    const afterWindow = baseTime + FAILED_JOIN_CODES_WINDOW_MS + 1;
    expect(isJoinCodeAttemptAllowed(testIp, afterWindow)).toBe(true);
  });

  it('resets attempts when cleared', () => {
    const baseTime = Date.now();
    for (let i = 0; i < FAILED_JOIN_CODES_LIMIT; i++) {
      recordFailedJoinCodeAttempt(testIp, baseTime);
    }
    expect(isJoinCodeAttemptAllowed(testIp, baseTime)).toBe(false);

    resetJoinCodeRateLimit(testIp);
    expect(isJoinCodeAttemptAllowed(testIp, baseTime)).toBe(true);
  });
});
