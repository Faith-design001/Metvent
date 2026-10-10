---
trigger: glob
globs: **/app/event/**,**/lib/**,**/server/**
---

# privacy-boundaries.md

Job: set what Metvent may show about people, what it may keep or record, and who can read private notes. Retention is in `retention-and-deletion.md`. What templates may never say is in `ai-and-templates.md`.

## Visibility

- Keep visibility off by default. Only the attendee's explicit choice turns it on.
  Why: nobody should appear on a board they did not choose to join.
- Require the viewer to be visible before they can see the Board. Apply the same check on every route that reads another person's card, including Opener.
  Why: nobody should watch the room without being watchable, and a direct URL must not skip the check.
- Require the target card to be visible at the moment of each request, on every route that reads it.
  Why: a person who turned visibility off must stop being readable everywhere, not only on the Board.
- Apply a visibility change on the next request. Mark Board, card, and Opener routes dynamic, send `Cache-Control: no-store`, and cache nothing that holds the visibility field.
  Why: "no caching delay" cannot be met by default Next.js caching.
- Show visibility as off in the interface only after the server confirms it. If the request fails, say the card is still visible.
  Why: a person who thinks they are hidden but are not is the PRD's most severe risk.

## What other people can see

- Show only what the person wrote on their own card for this event.
  Why: the card is the one thing the person chose to share for this purpose.
- Never carry anything written at one event into another event.
  Why: people agreed to be visible for one evening, not to build a profile.
- Order the Board by most recently updated. Add no ranking, score, badge, or highlight.
  Why: ranking people gives a verdict on them, and the user decides whom to approach.
- Never show, and never record, who viewed whose card.
  Why: it would turn a board into surveillance.

## Private notes

- Let only the author read a note, through any route: pages, APIs, exports, logs. Owner metrics may count note rows but must never read note text.
  Why: a note is the author's own memory of a conversation.
- Keep note text out of every shared index, usage record, analytics tool, and log.
  Why: nobody else has a reason to read it.
- When the author deletes a note, remove the row. Add no deleted flag and no copy.
  Why: the author stays in control of their own words.

## Usage records and logs

- Record only: the event, the feature used, whether a suggestion was marked useful or wrong, the time, and that a note was saved against a person.
  Why: usage records answer "did people use it". They must not answer "what did people say".
- Never write note text, optional second question text, card content, conversation content, or session tokens into the database, server logs, or error reports.
  Why: logs last longer than the data they describe, and more people read them.
- Never log a viewer and a viewed person together.
  Why: that pair is exactly "who viewed whose card".

## Open items for the owner

- Metrics versus privacy: "repeat opens per event" and "Room tab views with no other action" need counts per device. "Second event return" needs proof one device joined two events. "Visible card rate" needs the number of attendees who joined, and nothing stores joins. The rule above forbids tokens in usage records. Options: store a one way hash of the token on usage rows, or drop those metrics. Decide.
- Usage records list "a note was saved" but FeatureType has no value for it. Add one or compute it from PrivateNote rows.