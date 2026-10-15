// lib/session.ts
// Device session token generation, HMAC-SHA256 cookie signing, and verification.
// Rules from identity-and-sessions.md:
// - At least 128 bits random token
// - 365-day lifetime
// - Signed cookie holds token and list of joined event IDs
// - HttpOnly, Secure, SameSite=Lax

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ATTENDEE_COOKIE_NAME = 'metvent_attendee_session';
export const ATTENDEE_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 365 days

export interface AttendeeSession {
  token: string;
  joinedEventIds: string[];
}

/**
 * Generates a cryptographically secure 256-bit random hex token.
 */
export function generateDeviceToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Creates a signed cookie string for an attendee session.
 * Format: base64url(JSON) + '.' + hex(HMAC-SHA256 signature)
 */
export function signAttendeeSession(session: AttendeeSession, secret: string): string {
  if (!secret) {
    throw new Error('Signing secret is required');
  }

  const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(payload).digest('hex');

  return `${payload}.${signature}`;
}

/**
 * Verifies and parses an attendee session from a signed cookie string.
 * Returns null if the cookie is missing, tampered with, or invalid.
 */
export function verifyAttendeeSession(cookieValue: unknown, secret: string): AttendeeSession | null {
  if (typeof cookieValue !== 'string' || !secret) {
    return null;
  }

  const parts = cookieValue.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [payload, expectedSignature] = parts;
  const actualSignature = createHmac('sha256', secret).update(payload).digest('hex');

  const actualBuffer = Buffer.from(actualSignature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const rawJson = Buffer.from(payload, 'base64url').toString('utf8');
    const parsed = JSON.parse(rawJson) as unknown;

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const { token, joinedEventIds } = parsed as { token?: unknown; joinedEventIds?: unknown };

    if (typeof token !== 'string' || token.length < 32 || !Array.isArray(joinedEventIds)) {
      return null;
    }

    const validEventIds = joinedEventIds.filter((id): id is string => typeof id === 'string');

    return {
      token,
      joinedEventIds: validEventIds,
    };
  } catch {
    return null;
  }
}

/**
 * Adds an event identifier to an attendee session without duplicates.
 */
export function addEventToSession(session: AttendeeSession, eventId: string): AttendeeSession {
  if (!eventId || session.joinedEventIds.includes(eventId)) {
    return session;
  }

  return {
    ...session,
    joinedEventIds: [...session.joinedEventIds, eventId],
  };
}

/**
 * Checks whether the device session has joined the specified event.
 */
export function isEventJoined(session: AttendeeSession | null, eventId: string): boolean {
  if (!session || !eventId) {
    return false;
  }

  return session.joinedEventIds.includes(eventId);
}
