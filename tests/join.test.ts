import { describe, expect, it } from 'vitest';
import {
  JOIN_CODE_CHARSET,
  JOIN_CODE_LENGTH,
  JOIN_CODE_MESSAGES,
  validateJoinCodeFormat,
} from '../lib/join-code';
import { PAGE_NAMES } from '../lib/routes';

describe('Join Code Validation', () => {
  it('accepts a valid 6-character code from the allowed character set', () => {
    const result = validateJoinCodeFormat('234XYZ');
    expect(result).toEqual({ ok: true, code: '234XYZ' });
  });

  it('normalizes lowercase characters to uppercase', () => {
    const result = validateJoinCodeFormat('234xyz');
    expect(result).toEqual({ ok: true, code: '234XYZ' });
  });

  it('trims leading and trailing whitespace', () => {
    const result = validateJoinCodeFormat('  AB23CD  ');
    expect(result).toEqual({ ok: true, code: 'AB23CD' });
  });

  it('rejects null, undefined, and non-string inputs with the empty message', () => {
    expect(validateJoinCodeFormat(null)).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.empty,
    });
    expect(validateJoinCodeFormat(undefined)).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.empty,
    });
  });

  it('rejects an empty or whitespace-only code with the empty message', () => {
    expect(validateJoinCodeFormat('')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.empty,
    });
    expect(validateJoinCodeFormat('   ')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.empty,
    });
  });

  it('rejects codes shorter than 6 characters', () => {
    const result = validateJoinCodeFormat('23456');
    expect(result).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
  });

  it('rejects codes longer than 6 characters', () => {
    const result = validateJoinCodeFormat('2345678');
    expect(result).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
  });

  it('rejects ambiguous characters 0, 1, I, and O per organiser-screens.md', () => {
    expect(validateJoinCodeFormat('234560')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
    expect(validateJoinCodeFormat('234561')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
    expect(validateJoinCodeFormat('23456I')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
    expect(validateJoinCodeFormat('23456O')).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
  });

  it('rejects symbols and punctuation', () => {
    const result = validateJoinCodeFormat('AB-123');
    expect(result).toEqual({
      ok: false,
      error: JOIN_CODE_MESSAGES.invalid,
    });
  });

  it('matches length 6 and character set length 32', () => {
    expect(JOIN_CODE_LENGTH).toBe(6);
    expect(JOIN_CODE_CHARSET.length).toBe(32);
    expect(JOIN_CODE_CHARSET).toBe('23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  });

  it('verifies the join page title key in PAGE_NAMES', () => {
    expect(PAGE_NAMES.join).toBe('Join');
  });
});
