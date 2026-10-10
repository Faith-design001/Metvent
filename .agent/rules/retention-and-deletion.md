---
trigger: model_decision
description: Use when working on closing an event, the 7 day archive and 30 day delete job, or what happens to cards, flags, or notes after an event ends.
---

# retention-and-deletion.md

Job: define what happens to event data when an event closes and in the weeks after.

## Rules

- When the organiser closes an event, set the status to CLOSED and record `closedAt`. Attendees can no longer create or update cards or create notes. The Board becomes read only.
  Why: the retention clock needs a clear start, and the PRD says no new cards or notes on a closed event.
- Still allow an attendee, after close, to turn their own visibility off and to delete their own notes.
  Why: PRD section 13 makes "one tap to turn off" the main protection, and deleting is not creating. (Assumption, see Open items.)
- Seven days after `closedAt`, set the status to ARCHIVED and stop serving Board reads.
  Why: the board is for one evening plus a short window to find a name.
- Thirty days after `closedAt`, hard delete all attendee cards and flags for that event. Flag has no event column, so find flags through the event's cards and sessions.
  Why: people agreed to be visible for one evening, and the PRD sets 30 days.
- Never delete private notes in this job.
  Why: notes belong to their author and hold their own copy of the details.
- Run the deletion as a daily scheduled job (code the host starts on a timer). Make it safe to run twice, filter every delete by event, and log only counts.
  Why: nobody should have to remember to delete people's data, a missed run must be recoverable, and logs must not hold what was deleted.
- Move nothing from a closed event into a new event.
  Why: cross event profiles are out of scope.

## Tests

The deletion test is listed in `testing-and-done.md`.

## Open items for the owner

- Organiser never closes: the clocks start only at close. An event nobody closes keeps its cards forever. Decide an automatic close, for example N days after `Event.date`.
- Scheduler: the PRD does not settle the hosting provider, so the job's trigger is unset.
- After day 7: the PRD stops Board reads only. Opener reads the same cards. Decide whether Opener and card reads also stop. Until then, stop all routes that return another person's card.
- Joining a closed event: decide whether a new device may join with the code after close.
- After close: confirm that turning visibility off and deleting notes stay allowed.
- Second event return: cards are deleted at 30 days and a monthly event can fall after that. Decide what, if anything, to keep.