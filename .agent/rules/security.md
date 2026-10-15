---
trigger: always_on
---

# security.md

Job: keep secrets, inputs, access, and error output safe.

## Rules

- Never write a secret into code, comments, tests, or commit history.
  Why: once committed, anyone with the repository can read it, and removing it later does not remove it from history.
- Keep secrets in environment variables. Keep an example file listing the variable names with no values.
  Why: a new setup can see what it needs without seeing the secrets.
- Never give a secret the `NEXT_PUBLIC` prefix. Next.js sends those variables to the browser.
  Why: the value ends up in page code every visitor downloads.
- Check every input on the server: type, length, and allowed values. Use the limits in `data-model.md`.
  Why: the browser can be bypassed, so checks there protect nothing.
- Query through the Prisma client. Use `$queryRaw` with its template form only after asking. Never use `$queryRawUnsafe` or `$executeRawUnsafe`.
  Why: joined strings let an attacker change the meaning of a query (SQL injection).
- Render everything a person typed as plain text. Never use `dangerouslySetInnerHTML`.
  Why: a card could carry markup that runs in other people's browsers (cross site scripting).
- On every request, check on the server that this requester may act on this thing. Unguessable ids in URLs are not a check. The inputs are defined in `identity-and-sessions.md`.
  Why: a hidden button stops nobody. Only the server check does.
- Make no state change on a GET request. Use POST through server actions.
  Why: links and image tags on other sites can trigger GET requests.
- Show users plain messages when something fails. Never put stack traces, query text, or internal ids in a message.
  Why: those details help an attacker and mean nothing to the user.
- Never write a secret into logs or error reports. Rules for personal data are in `privacy-boundaries.md`.
  Why: logs outlast the data they describe, and more people read them.
- Limit repeated failed attempts on the join code to 60 failed codes per 10 minutes per IP address, using an in-memory sliding window store. Limit magic link requests to 5 per hour per email. Count failed attempts only. After the limit, refuse with a plain message.
  Why: venues put many attendees behind one IP address, so the ceiling must be high, and an in-memory store adds zero extra dependencies.
- Ask before turning off any security check, even briefly.
  Why: a check switched off for testing is often still off when the code ships.