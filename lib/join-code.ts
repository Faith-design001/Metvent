// lib/join-code.ts
// Format and validation rules for Metvent attendee join codes.
// Format is defined in organiser-screens.md: 6 characters from a reduced alphanumeric set.

export const JOIN_CODE_LENGTH = 6;
export const JOIN_CODE_CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const JOIN_CODE_MESSAGES = {
  empty: 'Enter a join code.',
  invalid: 'Join codes are 6 characters using letters and numbers.',
  unavailable: 'Joining is not available yet.',
} as const;

export type JoinCodeValidationResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Validates the format of an attendee-entered join code on the server.
 * Normalizes input by trimming and converting to uppercase.
 * Excludes ambiguous characters (0, 1, I, O) per organiser-screens.md.
 */
export function validateJoinCodeFormat(input: unknown): JoinCodeValidationResult {
  if (typeof input !== 'string') {
    return { ok: false, error: JOIN_CODE_MESSAGES.empty };
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: JOIN_CODE_MESSAGES.empty };
  }

  const normalized = trimmed.toUpperCase();

  if (normalized.length !== JOIN_CODE_LENGTH) {
    return { ok: false, error: JOIN_CODE_MESSAGES.invalid };
  }

  for (let i = 0; i < normalized.length; i++) {
    if (!JOIN_CODE_CHARSET.includes(normalized[i])) {
      return { ok: false, error: JOIN_CODE_MESSAGES.invalid };
    }
  }

  return { ok: true, code: normalized };
}
