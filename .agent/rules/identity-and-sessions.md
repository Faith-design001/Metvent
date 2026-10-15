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
- Set attendee session cookie lifetime to 365 days (1 year).
  Why: version one serves recurring monthly community meetups, so notes and device identity must survive between meetings.
- Keep one device session token across events on the same device. Store the list of joined event ids inside the signed device session cookie.
  Why: notes from different events stay together on the device without an account, and the cookie proves which events the attendee joined.
- Require every read and write that touches attendee data to take the device session as an input, checked on the server.
  Why: no code path should reach another attendee's data because a parameter was left out.

## Organisers

- Sign organisers in with a magic link sent by email. (A magic link is a one use link that logs the person in, and it expires.)
  Why: organisers manage data for many attendees, and there is no password to leak.
- Set magic link validity to 15 minutes. Store active tokens in an in-memory map. Log links to the server console in development.
  Why: 15 minutes prevents leaked links from remaining valid indefinitely, and an in-memory map adds zero extra dependencies.
- Use a different cookie name and a different signing secret for organisers. An attendee cookie must never open an organiser route, and the reverse.
  Why: the PRD treats a lost organiser session as the more costly one.
- Let an organiser read and change only events they created.
  Why: one organiser must never touch another's event.
- Organiser login route sits at `/organiser/login`. Event creation route sits at `/organiser/new`.
  Why: organisers need an entry point to sign in and set up events, separated from attendee join.

## Open items for the owner

None. All items resolved by owner decisions.