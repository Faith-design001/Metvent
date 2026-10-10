---
trigger: glob
globs: **/middleware.ts,**/app/join/**,**/app/event/**,**/app/organiser/**
---

## identity-and-sessions.md

Job: define how Metvent knows who a request belongs to, for attendees and for organisers.

## Attendees

- Create a device session when a person joins with a valid code. A valid code is an active join code. A device session is a cookie signed by the server that ties one device to one attendee. (Signing means the server adds a stamp it can check, so nobody can forge a session.)
  Why: the PRD has no accounts, and joining must be quick.
- Generate the token from a secure random source, at least 128 bits. Hold the signing secret in an environment variable.
  Why: a guessable token would let someone read another person's notes.
- Set the cookie HttpOnly, Secure, and SameSite=Lax. (HttpOnly stops page scripts reading it. Secure sends it only over HTTPS. SameSite=Lax stops other sites triggering requests with it.)
  Why: a stolen or abused session exposes private notes.
- Add no attendee accounts, passwords, email sign in, or social sign in. Install no authentication library that assumes attendee accounts.
  Why: signing up at the door on a weak connection would stop people joining. The PRD accepts losing sessions in exchange.
- Keep the same token on one device across events. Give each event its own card.
  Why: PRD section 8 keys cards on event plus token, and notes from many events stay together on the device.
- Never show the token to anyone. Never use it to show one person's other events or cards to another attendee. In routes, `attendeeId` is the AttendeeCard id, never the token.
  Why: cross event profiles are out of scope, and the token could link a person across events.
- Allow a device to read an event only if it joined that event with a code.
  Why: an event id in a URL must not be enough.
- Treat a device with no cookie as a new attendee with no notes. Build no recovery.
  Why: recovery needs accounts. The PRD accepts this limit.
- Tell the user on the notes screen that notes live on this device and are lost if browser data is cleared.
  Why: the product should not promise more than it can keep.
- Require every read and write that touches attendee data to take the device session as an input, checked on the server.
  Why: no code path should reach another attendee's data because a parameter was left out.

## Organisers

- Sign organisers in with a magic link sent by email. (A magic link is a one use link that logs the person in, and it expires.)
  Why: organisers manage data for many attendees, and there is no password to leak.
- Use a different cookie name and a different signing secret for organisers. An attendee cookie must never open an organiser route, and the reverse.
  Why: the PRD treats a lost organiser session as the more costly one.
- Let an organiser read and change only events they created.
  Why: one organiser must never touch another's event.

## Open items for the owner

- Cookie lifetime. The PRD sets none, and it decides how long notes survive.
- Email service for magic links, and how long a link stays valid. Neither is named.
- Magic link storage: a one use link needs a stored record or a library. No table exists, and a library needs approval.
- Joined events: the server must tell which events a device joined, and cards are deleted at 30 days. Proposed: list the joined event ids inside the signed cookie.
- Token scope: PRD section 8 text says a session is "within a specific event", but its schema reuses one token across events. This file follows the schema. Confirm.
- Routes: no organiser login route and no new event route exist.