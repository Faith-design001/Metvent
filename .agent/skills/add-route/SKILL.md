---
name: add-route
description: Use when building or changing one Metvent screen end to end, such as the Board, Room, Opener, People, Card, Join, or an organiser screen. Gives the build order and the checks for each route.
---

# Add a route

Build one route at a time. Follow the steps in order. Do not start a step until the one before it is done.

## Steps

1. Name the route. Find its exact path in the Routes list in `AGENTS.md`.
   - Check: you can quote the path from that list.
   - If the path is not there, stop and ask the owner. Organiser login and new event creation are not there.

2. Pick the rules files for this route from the table below. Read the Open items section of each one.

   | Route | Read |
   |---|---|
   | `/join` | `identity-and-sessions.md`, `security.md` |
   | `/event/[eventId]/card` | `privacy-boundaries.md`, `identity-and-sessions.md`, `data-model.md` |
   | `/event/[eventId]/board` | `privacy-boundaries.md`, `identity-and-sessions.md`, `retention-and-deletion.md` |
   | `/event/[eventId]/room` | `ai-and-templates.md`, `data-model.md`, `organiser-screens.md` |
   | `/event/[eventId]/opener/[attendeeId]` | `ai-and-templates.md`, `privacy-boundaries.md`, `identity-and-sessions.md` |
   | `/event/[eventId]/people` | `privacy-boundaries.md`, `identity-and-sessions.md`, `data-model.md` |
   | `/organiser/[eventId]` | `organiser-screens.md`, `identity-and-sessions.md`, `retention-and-deletion.md` |

   - Check: your reply lists each file you read.

3. Decide whether an open item blocks the route.
   - Check: your reply names each open item that touches this route, or says there are none.
   - If one blocks the route, stop and ask the owner. Do not write code.

4. Find the PRD section for this route. Copy its acceptance criteria into your reply as a numbered list.
   - Check: the list has one line per criterion in the PRD section.
   - For `/join` and the organiser screens, use the screen description in PRD sections 6.6 to 6.10.

5. Write the server data function first. Make the requester identity a required parameter.
   - Check: the function cannot be called without the device session or organiser session.

6. Write the page as a server component. Use a client component only for a tap, typed input, or a timer.
   - Check: each client file has a one line comment naming which of those three it needs.

7. Write the tests.
   - Check: every criterion from step 4 maps to a named test.
   - Check: every test in the "Tests that must always exist" list in `testing-and-done.md` that touches this route exists.

8. Run the type check, lint, build, and tests with the project's own scripts.
   - Check: your reply shows each command and its result.

9. Run the slow network and slow processor test from `device-and-network.md` on this route.
   - Check: your reply shows the measured numbers.

10. Report the route as done only if steps 8 and 9 passed. Use the meaning of done and "not verified" in `testing-and-done.md`.
    - Check: your reply uses the word "done" or "not verified" for this route.