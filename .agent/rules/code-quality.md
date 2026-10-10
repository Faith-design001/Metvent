---
trigger: glob
globs: **/*.ts,**/*.tsx
---

# code-quality.md

Job: keep the code readable and each change small enough to review.

## Rules

- Keep TypeScript strict mode on. If it is off, ask before turning it on.
  Why: it catches whole groups of mistakes, but turning it on can surface many errors across files.
- Never use the `any` type. Use `unknown` and narrow it with a check.
  Why: `any` switches the type checker off for that value and hides real bugs.
- Give every function one job. If you need "and" to describe it, split it.
  Why: small functions are easier to test and review.
- Split a file when you cannot say what it does in one sentence.
  Why: a reader should find one idea per file.
- Keep database and model code in server files. A client component never imports them.
  Why: this is how private fields are kept out of the browser.
- Never leave a catch block empty. Handle the error or pass it up.
  Why: a swallowed error looks like success and becomes a harder bug later.
- Delete code your change made unused. Leave other unused code alone and mention it in your response.
  Why: your own leftovers confuse later work, while unrelated deletions hide the real change.
- Change only what the task needs. Do not tidy or restructure nearby code.
  Why: unrequested edits hide the real change and can break code already reviewed.
- Follow the formatter and lint settings the project has. Ask before changing them.
  Why: one style across all files, and a settings change touches every file.
- Define each fixed value (a character limit, a day count, the flag threshold) once in one module and import it everywhere. The values are in `data-model.md`, `retention-and-deletion.md`, and `organiser-screens.md`.
  Why: a change to a limit then happens in one place.