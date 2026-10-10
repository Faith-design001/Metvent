---
trigger: glob
globs: **/prisma/**,**/*.prisma
---

# data-model.md

Job: define the database design and the limits stored in it. This file is the only copy of the schema the agent follows.

## Rules

- Follow the schema at the bottom of this file. It matches PRD section 8 except for one added line: the `cards` side of the card to topic relation, which Prisma requires. Owner action, not an agent task: delete the schema block from PRD section 8 so only one copy remains. The agent never edits the PRD.
  Why: two copies drift apart, and the agent cannot tell which is right.
- Keep the generator and datasource blocks the project already has. This file holds only models and enums.
  Why: those blocks depend on the Prisma version and hosting, which this file does not decide.
- Build or change the schema only when the owner asks for it in the task, and then follow `database-safety.md`.
  Why: schema changes alter real data, and AGENTS.md reserves that choice for the owner.
- Make the pair of event and session token unique on an attendee card. Never make the token alone unique. (A unique rule is one the database enforces by refusing duplicates.)
  Why: the same device attends many events, and a token-only rule would block its second event.
- Create or update a card with one `upsert` on that pair. Do not look first and insert after.
  Why: two quick submits could both pass a look and create two cards.
- Give no shared table a relation that leads to private notes. The Board query selects only from attendee cards.
  Why: notes must be unreachable from any shared read, even by a careless join.
- Copy the other person's name and role into a private note when it is saved, and let its link to the card become empty. (Blocked: see Open items.)
  Why: cards are deleted after an event, and the note must still make sense.
- Enforce every limit in the table below in server code, once, in one module.
  Why: short fields are quick to fill on a phone and quick to scan on a board, and one definition means one place to change.
- Give the usage log no free text column. Its allowed contents are in `privacy-boundaries.md`.
  Why: it measures use. It must not hold what people said.
- Keep three event states: OPEN, CLOSED, ARCHIVED. When each applies is in `retention-and-deletion.md`.
  Why: each state decides what an attendee can still do.
- Compute "unverified" from unresolved flags when reading. Do not store it as a column.
  Why: a stored value goes stale when a flag is resolved.

## Limits

| Field | Limit |
|---|---|
| Role line | 80 characters |
| Tonight line | 120 characters |
| Topic tags on a card | up to 3 |
| Topics on an event that has topics | 3 to 8 (an event may have none) |
| Private note | 300 characters |
| Next time line | 150 characters |

Session summary, event description, and flag reason have no limit in the PRD. See Open items.

## Open items for the owner

- Flagger: the flag rule counts distinct attendees, but Flag stores no flagger. Proposed: add the flagger's session token and make the pair of item and flagger unique. Without it the rule cannot be enforced.
- Name: the PRD says a note stores a copy of the target's name and role, but an attendee card has no name field and PrivateNote has no role copy. Decide where the name comes from, and add a role copy to PrivateNote.
- Session timing: Room Right Now needs "next break", the stated topic, and a way to tell current from completed. Session has only title, speaker, start time, and summary. Decide whether to add an end time, a break time, and a topic field. Until then "session topic" in templates means the title, quoted only.
- Time zone: Event stores no time zone. Session times will display wrongly without one.
- Stored question: if the Room question is generated once per session, it needs a column. See `ai-and-templates.md`.
- Metrics: FeatureType lacks note saved, Room view, and Board view. The PRD metrics need more than the usage log may hold. See `privacy-boundaries.md`.
- Magic link: organiser login needs somewhere to hold a one use link. No table exists. See `identity-and-sessions.md`.
- Topic labels: decide whether "Python" and "python" are one label. The schema treats them as two.
- Length limits for session summary, event description, and flag reason.

## Models and enums

```prisma
model Organiser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  events    Event[]
}

model Event {
  id              String       @id @default(cuid())
  name            String
  date            DateTime
  description     String
  topics          Topic[]
  organiserId     String
  organiser       Organiser    @relation(fields: [organiserId], references: [id])
  joinCode        JoinCode?
  sessions        Session[]
  attendeeCards   AttendeeCard[]
  scheduleChanged Boolean      @default(false)
  status          EventStatus  @default(OPEN)
  closedAt        DateTime?
  createdAt       DateTime     @default(now())
}

enum EventStatus {
  OPEN
  CLOSED
  ARCHIVED
}

model Topic {
  id      String         @id @default(cuid())
  eventId String
  event   Event          @relation(fields: [eventId], references: [id])
  label   String
  cards   AttendeeCard[] @relation("CardTopics")

  @@unique([eventId, label])
}

model Session {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  title       String
  speakerName String
  startTime   DateTime
  summary     String
  flags       Flag[]
  createdAt   DateTime @default(now())
}

model JoinCode {
  id        String   @id @default(cuid())
  eventId   String   @unique
  event     Event    @relation(fields: [eventId], references: [id])
  code      String   @unique
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
}

model AttendeeCard {
  id           String   @id @default(cuid())
  eventId      String
  event        Event    @relation(fields: [eventId], references: [id])
  sessionToken String
  roleLine     String
  tonightLine  String?
  visible      Boolean  @default(false)
  topicTags    Topic[]  @relation("CardTopics")
  flags        Flag[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([eventId, sessionToken])
  @@index([eventId, visible])
}

model PrivateNote {
  id                 String   @id @default(cuid())
  authorSessionToken String
  eventId            String
  targetCardId       String?
  targetNameSnapshot String
  noteText           String
  nextTimeLine       String?
  createdAt          DateTime @default(now())

  @@index([authorSessionToken])
}

model SuggestionLog {
  id          String      @id @default(cuid())
  eventId     String
  featureType FeatureType
  wasUseful   Boolean?
  wasFlagged  Boolean     @default(false)
  createdAt   DateTime    @default(now())
}

enum FeatureType {
  OPENER
  SECOND_QUESTION
  ROOM_QUESTION
}

model Flag {
  id             String        @id @default(cuid())
  attendeeCardId String?
  attendeeCard   AttendeeCard? @relation(fields: [attendeeCardId], references: [id])
  sessionId      String?
  session        Session?      @relation(fields: [sessionId], references: [id])
  reason         String?
  resolved       Boolean       @default(false)
  createdAt      DateTime      @default(now())
}
```