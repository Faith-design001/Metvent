// app/join/actions.ts
// Server actions for the attendee join form.
'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateJoinCodeFormat } from '@/lib/join-code';
import {
  isJoinCodeAttemptAllowed,
  recordFailedJoinCodeAttempt,
  RATE_LIMIT_MESSAGES,
} from '@/lib/rate-limit';

/**
 * Handles form submission from the join code entry screen.
 * Checks IP rate limits for failed attempts.
 * Validates the join code format on the server.
 * Preserves the entered text on validation failure.
 */
export async function submitJoinCode(formData: FormData): Promise<void> {
  const headerStore = await headers();
  const forwarded = headerStore.get('x-forwarded-for');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  if (!isJoinCodeAttemptAllowed(clientIp)) {
    redirect(`/join?error=${encodeURIComponent(RATE_LIMIT_MESSAGES.joinCodeExceeded)}`);
  }

  const rawCode = formData.get('code');
  const result = validateJoinCodeFormat(rawCode);

  if (!result.ok) {
    recordFailedJoinCodeAttempt(clientIp);
    const codeParam = typeof rawCode === 'string' ? rawCode.trim().slice(0, 10) : '';
    redirect(
      `/join?error=${encodeURIComponent(result.error)}&code=${encodeURIComponent(codeParam)}`
    );
  }

  // A code that passes format validation shows the unavailable status.
  // We do not fake a successful join or pretend the code was valid in the database.
  redirect('/join?status=unavailable');
}
