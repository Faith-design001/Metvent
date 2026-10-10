---
trigger: always_on
---

# testing-and-done.md

Job: define when a change counts as finished and which tests must always exist.

## Rules

- A change is done only when the type check, lint, build, and tests all pass, using the scripts the project has. If a script is missing, say so and ask before adding a tool. (The type check is the TypeScript compiler's check for mismatched types. Lint is an automatic check for common mistakes.)
  Why: code that has not been run has not been shown to work.
- If a check cannot run (for example no test database), report the change as "not verified", never "done", and ask.
  Why: a blocked check must not look like a passed one.
- If a check was already failing before your change, say so. Do not fix unrelated failures.
  Why: it keeps the change small and the report honest.
- Report what you ran and what each run returned. State plainly what you did not run, and why.
  Why: the owner cannot see your terminal and needs the real state.
- Never call something working because the code looks right. Run it.
  Why: reading finds some bugs, running finds the rest.
- Write a test for each rule or acceptance criterion the change touches. A test that needs a database uses the test database from `database-safety.md`. If none exists, ask.
  Why: the PRD writes its criteria so a tester can pass or fail them, and a test keeps that true.
- Never delete or weaken a test to make it pass. If a test is wrong, say so and ask.
  Why: a weakened test hides the failure it was written to catch.
- Include the slow network check from `device-and-network.md` for any screen you changed.
  Why: a change is not done if it only works on a fast laptop.

## Tests that must always exist

Why: these are the failures the PRD ranks as most severe or most likely to go wrong silently.

- A card never appears to another attendee while its owner is not visible, on the Board and on Opener. (`privacy-boundaries.md`)
- A viewer who is not visible cannot read the Board or another card. (`privacy-boundaries.md`)
- The first Board request after a visibility change reflects the change. (`privacy-boundaries.md`)
- A note cannot be read from any other device session, and a Board response never contains a note field. (`privacy-boundaries.md`)
- Submitting a card twice for one event and device leaves one card. (`data-model.md`)
- A closed event rejects new cards and notes. (`retention-and-deletion.md`)
- After the deletion job runs for an event 30 days past close, its cards and flags are gone and its notes remain. (`retention-and-deletion.md`)
- An opener or second question sentence with a slot and no source fails. (`ai-and-templates.md`)
- A generated question that fails the check is not shown, and a failed model call still shows session facts. (`ai-and-templates.md`)
- An unverified item is not used. (`organiser-screens.md`)
- One organiser cannot read or change another organiser's event. (`identity-and-sessions.md`)