---
trigger: always_on
---

# database-safety.md

Job: control how database changes are made, and who applies them.

## Databases

Owner fills these in before the first schema task.

- Local development database: `__________`
- Test database: `__________`

Any database not named above is production. Never connect to production from the coding environment.
Why: an address alone does not show which database it is, so the safe default is production.

## Rules

- If either name above is blank when a task needs it, stop and ask.
  Why: the agent must not guess which database is safe.
- Allowed without asking: `prisma generate`, `prisma validate`, `prisma format`.
  Why: they do not touch a database, and the type check cannot pass without generate.
- To change the schema: edit the schema file, then run `prisma migrate dev --create-only` against the local development database. This writes the migration file and does not apply it. Give the owner the exact command to apply it.
  Why: the owner decides when real data changes.
- Never run these: `prisma migrate dev` without `--create-only`, `prisma migrate deploy`, `prisma migrate reset`, `prisma db push`, `prisma db seed`, or any seed or query against any database, unless the owner asks for that exact action in the current task.
  Why: permission given in an earlier task does not cover this one.
- Run tests only against the test database named above.
  Why: tests write and delete rows, which would damage real data.
- Never edit a migration that has already been applied. Add a new migration.
  Why: edited history makes one database differ from another with no record of why.
- Never write a drop, a truncate, or a delete with no filter, in code or in a migration, without written owner approval that names the table. Two exceptions: test setup and teardown on the test database, and the retention job, whose deletes are always filtered by event (see `retention-and-deletion.md`).
  Why: these cannot be undone, and the two exceptions are the only places they are routine.
- Use invented data in seeds, tests, and fixtures. Never copy real data into them.
  Why: real data in a repository or test leaks people's information.
- Keep each migration to one change and name it for what it does.
  Why: one change is easy to review and to reverse.
- Before writing a change that cannot be reversed (dropping a column or table, narrowing a column type), say so.
  Why: the owner needs that fact to decide.