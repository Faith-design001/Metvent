import { describe, expect, it } from 'vitest';
import {
  ATTENDEE_COOKIE_MAX_AGE_SECONDS,
  ATTENDEE_COOKIE_NAME,
  addEventToSession,
  generateDeviceToken,
  isEventJoined,
  signAttendeeSession,
  verifyAttendeeSession,
  type AttendeeSession,
} from '../lib/session';

describe('Attendee Device Sessions', () => {
  const secret = 'test-secret-key-that-is-at-least-32-chars-long';

  it('generates a 256-bit (64 hex characters) secure device token', () => {
    const token = generateDeviceToken();
    expect(typeof token).toBe('string');
    expect(token.length).toBe(64);
  });

  it('signs and verifies a valid attendee session', () => {
    const session: AttendeeSession = {
      token: generateDeviceToken(),
      joinedEventIds: ['event-123'],
    };

    const cookie = signAttendeeSession(session, secret);
    expect(typeof cookie).toBe('string');

    const verified = verifyAttendeeSession(cookie, secret);
    expect(verified).toEqual(session);
  });

  it('rejects a cookie with an invalid signature', () => {
    const session: AttendeeSession = {
      token: generateDeviceToken(),
      joinedEventIds: ['event-123'],
    };

    const cookie = signAttendeeSession(session, secret);
    const tampered = cookie.slice(0, -4) + 'abcd';

    expect(verifyAttendeeSession(tampered, secret)).toBeNull();
  });

  it('rejects a cookie with tampered payload', () => {
    const session: AttendeeSession = {
      token: generateDeviceToken(),
      joinedEventIds: ['event-123'],
    };

    const cookie = signAttendeeSession(session, secret);
    const parts = cookie.split('.');
    const fakePayload = Buffer.from(
      JSON.stringify({ ...session, joinedEventIds: ['event-999'] }),
      'utf8'
    ).toString('base64url');

    expect(verifyAttendeeSession(`${fakePayload}.${parts[1]}`, secret)).toBeNull();
  });

  it('adds events without duplicates', () => {
    const session: AttendeeSession = {
      token: generateDeviceToken(),
      joinedEventIds: ['event-1'],
    };

    const updated = addEventToSession(session, 'event-2');
    expect(updated.joinedEventIds).toEqual(['event-1', 'event-2']);

    const duplicate = addEventToSession(updated, 'event-1');
    expect(duplicate.joinedEventIds).toEqual(['event-1', 'event-2']);
  });

  it('checks if an event is joined correctly', () => {
    const session: AttendeeSession = {
      token: generateDeviceToken(),
      joinedEventIds: ['event-1'],
    };

    expect(isEventJoined(session, 'event-1')).toBe(true);
    expect(isEventJoined(session, 'event-2')).toBe(false);
    expect(isEventJoined(null, 'event-1')).toBe(false);
  });

  it('has a 365-day cookie lifetime constant', () => {
    expect(ATTENDEE_COOKIE_MAX_AGE_SECONDS).toBe(365 * 24 * 60 * 60);
    expect(ATTENDEE_COOKIE_NAME).toBe('metvent_attendee_session');
  });
});
