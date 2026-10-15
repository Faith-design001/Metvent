// app/join/actions.ts
// Server actions for the attendee join form.
'use server';

import { redirect } from 'next/navigation';
import { validateJoinCodeFormat } from '@/lib/join-code';

/**
 * Handles form submission from the join code entry screen.
 * Validates the join code format on the server.
 * Preserves the entered text on validation failure.
 */
export async function submitJoinCode(formData: FormData): Promise<void> {
  const rawCode = formData.get('code');
  const result = validateJoinCodeFormat(rawCode);

  if (!result.ok) {
    const codeParam = typeof rawCode === 'string' ? rawCode.trim().slice(0, 10) : '';
    redirect(
      `/join?error=${encodeURIComponent(result.error)}&code=${encodeURIComponent(codeParam)}`
    );
  }

  // A code that passes format validation shows the unavailable status.
  // We do not fake a successful join or pretend the code was valid in the database.
  redirect('/join?status=unavailable');
}
