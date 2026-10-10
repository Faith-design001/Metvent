---
trigger: glob
globs: **/*.tsx,**/*.css
---

# device-and-network.md

Job: keep Metvent usable on a mid range Android phone on a weak connection. This covers load cost and behavior when the network drops. It does not cover how screens look.

## Test setup and budgets (proposed, owner to confirm)

- Test with Chrome DevTools network set to Slow 4G and CPU set to 4x slowdown.
- Send no more than 150 KB of compressed JavaScript on first load of any route.
- Show first content within 4 seconds on that setup.

Why: "mid range phone" and "weak connection" cannot be checked without numbers. Until the owner confirms, report the measured numbers in each response.

## Rules

- Render on the server by default. Use client code only where a screen needs a tap, typed input, or a timer.
  Why: less code to download and run.
- Load no font, script, or tracker from another site.
  Why: each is an extra connection that can stall on a weak network.
- When asking to add a package (AGENTS.md requires the ask), state how much it adds to the page.
  Why: the owner can only judge a package by what it costs the phone.
- Do not poll or hold a live connection to refresh Room Right Now. Refresh when the person opens the tab or taps refresh. The owner may approve live updates. (Polling means asking the server again and again on a timer.)
  Why: constant requests spend data and battery.
- On a failed or slow read of Room Right Now, keep the last data on screen with its timestamp and a plain message. Never show a blank page.
  Why: signal drops indoors, and Room data is organiser content.
- On a failed read of the Board, show a plain message and no cards. Store no other attendee's card data on the device (no localStorage, no service worker cache).
  Why: a stale Board could show a card whose owner has since turned visibility off.
- On a failed save, keep what the person typed and let them retry. Never clear a form on failure.
  Why: typing on a phone takes effort, and losing a note ends trust.
- Run the slow network and slow processor test on each screen you changed before calling it done.
  Why: a fast laptop hides the problem.