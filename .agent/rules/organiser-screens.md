---
trigger: glob
globs: **/app/organiser/**
---

# organiser-screens.md

Job: define the five organiser screens (event setup, session entry, join code, flag review, event close) and what each does when left incomplete. Organisers supply event data here. They are not users of the attendee experience.

## Rules

- Event setup holds the name, date, one paragraph description, and an optional topic list. Saving creates the join code. Use fewer than eight inputs, and count the topic list as one input.
  Why: PRD 6.6 says under 8 fields, for an organiser with about eight minutes who will not fill in a long form.
- Treat topics as optional. With no topics, the Board shows every visible card and no filter. Topic limits are in `data-model.md`.
  Why: skipping topics must not break the Board.
- Session entry holds the title, start time, speaker name, and a one line summary. The summary is a single line input with no line breaks. Allow edits at any time, including during the event.
  Why: schedules slip, attendees see whatever is stored, and the summary is the only model input.
- Add a schedule changed switch. While it is on, the attendee Room view shows no session timing and no generated question, only the event name and description with a note that the schedule is being updated. It takes effect on the next request. The organiser turns it off after correcting the schedule.
  Why: wrong times shown with confidence do more harm than no times.
- Make the join code when the event is created. Use letters and numbers from this set only (proposed): `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`, six characters. Show it as text and as a QR code. Regenerating the code makes the old one stop working.
  Why: the code is read aloud or projected, look-alike characters cause typing errors, and a leaked code needs a way to be shut off.
- Show the code at least 48 pixels tall and the QR code at least 256 pixels wide (proposed).
  Why: "large enough to read across a room" cannot be tested without a number.
- Flag review lists each flagged item with its flag count and content. An item flagged by three or more distinct attendees is unverified and is not used until the organiser has reviewed it. Reviewed means its flags are marked resolved.
  Why: it gives a correction path without anyone watching every event. Three is a version one default and may need to change with event size.
- Event close is one button with a confirmation step. What closing does is in `retention-and-deletion.md`.
  Why: an accidental tap must not start the deletion clock.
- Build no charts, counts, or analytics on these screens. The only count is the flag count in flag review.
  Why: the PRD defers organiser analytics to version two, and they would make organisers users of the attendee experience.

## Open items for the owner

- Flag raising: the PRD gives no place where an attendee raises a flag.
- Review actions: the PRD says "until reviewed" and defines no actions. Proposed: for a session, the organiser may edit it or dismiss the flags. For an attendee card, the organiser may only dismiss, because the words are the attendee's. Confirm.
- Flag threshold: confirm three or set another number.
- Unverified session: decide what Room shows when the current session is unverified.
- Routes: all five screens sit on `/organiser/[eventId]`, but a new event has no id yet, and no login route exists.
- Time zone: where the organiser sets it. See `data-model.md`.
- Field lengths: session title, summary, and event description.
- After close: decide whether the organiser may still edit sessions.