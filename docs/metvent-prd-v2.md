# Metvent — Product Requirements Document (Version One, Revised)

## 1. Product Summary

Metvent is a web page a person opens at one specific event. It shows what is happening in the room right now, and which attendees have said what they want to talk about tonight. It turns those facts into something specific a person can actually say, using only real data from the actual event.

Version one targets a recurring monthly community meetup of 30 to 120 people. The user is the attendee, not the organiser. The product does not match people, does not message on anyone's behalf, and does not guess anything about a person beyond what that person wrote themselves.

## 2. Problem

A talk ends. The room breaks into loose circles. Tolu is standing at the edge of one, holding a plastic cup. The man next to him is also alone, also looking at his phone. Neither speaks, because the only opener either can think of is "so, what do you do," and both have already used it once tonight and watched it die.

Later Tolu does start a conversation, with someone near the snack table. It goes well for ninety seconds. She mentions she works on something in payments. He says "oh nice, that's interesting," and the conversation stalls. He leaves at eight forty. He later learns the person who spoke second was hiring for the exact role he wants.

The primary problem this product solves is continuing a conversation once it has started. Tolu's second conversation did not fail because he lacked an opener. It failed because he had nothing true to say once the opener had done its job. Starting a conversation is the secondary problem, served by the same underlying mechanism: real, specific facts about the other person and the room, available at the moment they are needed.

This is assumed to apply specifically to solo attendees at recurring community meetups, not to every attendee at every kind of event.

## 3. Goals

**Product goals for version one**
- Give an attendee a specific, truthful opener for a specific person, in under a few seconds, built from real event data.
- Give an attendee a way to keep a stalling conversation going, using facts already on the table, without requiring an awkward live phone interaction.
- Give an attendee a reason to open the product through live, changing event content, even when they have no immediate question.
- Let an attendee capture who they met, privately, so a future event is not a cold restart.

**Learning goals for version one**
- Learn whether attendees will write anything real about themselves before an event starts.
- Learn whether a saved note against a named person correlates with a conversation that actually happened.
- Learn whether the same device returns for a second event.
- Learn whether the room card alone, with no stated question, is enough to make someone open the app unprompted, measured by repeat opens within a single event.

## 4. Users and Personas

**Primary persona: Tolu, 27, backend developer, Lagos**
Attends a monthly product and engineering meetup. Has been three times, knows two faces, speaks to neither. Owns a mid range Android phone, is often on a weak connection inside the venue. Opens the product in the queue outside, in the break after the first talk, and near the end when deciding whether to leave.

This persona, and the card format built for it, are representative of the first launch community, which is technical and product focused. Neither has been tested against a non technical community, where attendees may describe themselves and their interests differently. This is a known limitation, not yet resolved.

**Organiser persona: Ada, community organiser, not a product user**
Runs the meetup as a side effort alongside a full time job. Has roughly eight minutes to set up an event before doors open. Will not fill in a long form. She is the sole source of shared event context. Her incentive to keep using a free, unpaid product is personal: she wants her own community's events to produce real connections, since that is what makes people keep coming back to something she runs without pay.

## 5. Scope

**In scope for version one**
- Four customer facing features: board, opener, second question, room right now, who I met. (Five total, listed in Section 6.)
- Five organiser screens: event setup, session entry, join code, flag review, event close.
- Join by code, no account required beyond a lightweight device session tied to the joined event.
- Attendee visibility toggle, off by default.
- Private per user notes, retained for as long as the device session persists.
- Event data retention: board read only for 7 days after close, attendee cards deleted after 30 days.
- Basic completion analytics described in Success Metrics.

**Explicitly out of scope, and why**
- Messaging between attendees. This would let the product substitute for the in-person conversation it exists to cause, which conflicts directly with its founding purpose. It would also carry a moderation burden the team cannot support.
- Any ranking or matching of people. The most likely feature to cause harm, and not necessary for the core loop.
- Post event follow up drafting. By the time the event ends, the event specific advantage has faded, and a chatbot already answers this adequately.
- Personality or communication style profiling. Adds friction and produces an illusion of personalization the product cannot back up.
- Photos and physical check in. Costs data and battery on the target device without adding to the core loop.
- Cross event profiles. Attendee cards stay scoped to a single event.
- Public event directory. Joining requires a code from the organiser.
- Any paid tier. No pricing model until there is evidence anyone wants the free one.
- Native mobile app. A responsive web page reaches the target device without an install step.

**Deferred to version two**
- Model based generation for the Opener and Second Question, once template performance in version one is measured.
- Cross event note continuity for recurring attendees, beyond the private notes already kept.
- Organiser facing analytics on event context completeness.
- Validation and adaptation of the card format for non technical communities.
- Multi language support beyond English.

## 6. Functional Requirements

### 6.1 The Board

**User story.** As an attendee, I want to see who else is here and has something in common with what I care about, so I can choose who to approach.

**Trigger.** Attendee opens the Board tab after joining an event and setting their own card to visible.

**Steps.**
1. Attendee joins event with code.
2. Attendee is prompted to fill in their card: what they do (one line, max 80 characters), what they want to talk about tonight (one line, max 120 characters), and up to three topic tags drawn from the event's topic list, if any exist.
3. Before creating a card, the system checks for an existing card tied to this device session and this event. If one exists, it updates that card instead of creating a new one.
4. Attendee sets visibility on. Only then does the Board become viewable to them.
5. Board loads all visible attendee cards for this event, most recently updated first.
6. Attendee filters by one or more topic tags, if any are defined for this event.

**Data read.** Attendee cards where `visible = true` for the current event, event topic tags.

**Data written.** The attendee's own card fields, the visibility flag.

**Empty and failure states.**
- No attendees visible yet: "No one has joined the board yet. Be the first," with a link to fill in a card.
- Attendee has not set their own card visible: Board is locked behind a one step prompt to fill in a card, stating that visibility is required to see others.
- Filter returns nothing: "No one matches this filter right now," with an option to clear it.
- Event has no topics defined: Board shows all visible cards, unfiltered, with no filter control shown at all.

**Acceptance criteria.**
- A card is never shown to a user whose own visibility is off.
- A card never appears until its owner explicitly sets visibility on.
- Turning visibility off removes the card from every other attendee's Board on the very next request. No caching delay on this field.
- No sort, badge, or highlight implies one card is better than another.
- A device session can hold at most one card per event; repeated card submissions update the same row.

### 6.2 The Opener

**User story.** As an attendee, I want a specific way to start talking to a chosen person, so I do not open with something generic that has already failed once tonight.

**Trigger.** Attendee taps a card on the Board and selects "Get an opener."

**Steps.**
1. Product reads the selected person's card and the current room context (active or most recent session).
2. Product fills a fixed sentence template with the target's `tonightLine` if present, or their `roleLine` if not, or the current session's topic if the card is empty.
3. Two to three template variations are shown, each with the exact source field it draws from shown directly underneath it.

**Data read.** The selected attendee's card, the current room context.

**Data written.** A log entry recording that an opener was viewed, for this feature and event.

**Empty and failure states.**
- Selected card is thin (only the "what they do" line): opener falls back to a room context based template, and states plainly there is not enough written by this person for a more specific one.
- No room context available and card is empty: opener screen states the event has not provided enough information to help, and stops there.

**Acceptance criteria.**
- Every opener sentence has a visible source line from either the target's card or the room context. No source line, no opener.
- No opener includes any claim about the target's personality, interests, availability, or intent beyond what is quoted.
- This feature does not call a language model in version one. It runs entirely on fixed templates populated with real card and session fields. A model based version may be tested in version two once template quality is measured against real use.

### 6.3 The Second Question

**User story.** As an attendee, in a brief pause in the conversation, I want a next question that goes deeper, so the conversation does not die after the opener.

**Trigger.** Attendee taps "What now" from a person's card, intended for a short step-away moment such as walking to get a drink, not for use during active conversation.

**Steps.**
1. Attendee taps the other person's already visible stated topic (no re-selection of information already on screen), and may optionally add one short free text line about anything new that came up.
2. Product returns a small set of deepening question templates keyed to that topic, plus one polite line for ending the conversation gracefully if needed.

**Data read.** The other person's card, the optional free text entered by the user.

**Data written.** A log entry of feature use, per Section 9. The optional free text is not stored beyond generating the immediate response.

**Empty and failure states.**
- The other person's card has no stated topic: the feature falls back to a general deepening question tied to the current session topic instead.

**Acceptance criteria.**
- Every returned question ties to the stated topic or the optional free text; none introduce an unrelated subject.
- The graceful exit line never implies rejection of the other person.
- This feature does not call a language model in version one. It runs on a fixed set of templates keyed to topic categories.
- The interaction requires no more than one tap and one optional short text entry, since it is designed to be used quickly during a real social pause.

### 6.4 Room Right Now

**User story.** As an attendee, I want to know what is happening right now and have something worth asking about it, without needing a reason to be stuck.

**Trigger.** Attendee opens the Room tab at any time during the event.

**Steps.**
1. Product shows the current or most recently completed session, its speaker, its stated topic, and the time of the next break, drawn from the organiser's schedule.
2. Product shows one question about the session content, generated from the organiser's one line summary for that session.
3. A visible timestamp shows when this data was last updated.

**Data read.** Event schedule, current session data, organiser's schedule change flag.

**Data written.** A view log entry.

**Empty and failure states.**
- No sessions entered: Room tab shows the event name and description only, with a note that no schedule has been provided.
- Schedule flagged as changed and not yet corrected: Room tab stops showing session timing, showing only the event level description with a note that the schedule is being updated.
- Model call for the generated question fails: session facts are still shown, without the generated question, rather than blocking the tab.

**Acceptance criteria.**
- The displayed session always matches the organiser's entered schedule; the tab never guesses based on elapsed time alone once the organiser has flagged a change.
- The last updated timestamp is always visible, in relative human readable form.
- Exactly one question is generated per session, not two, since a single one line summary does not reliably support two distinct, specific outputs.

### 6.5 Who I Met

**User story.** As an attendee, I want to remember who I spoke to and what to bring up next time, privately.

**Trigger.** Attendee taps "Save a note" from a person's card.

**Steps.**
1. Attendee writes a free text note (max 300 characters) and an optional "next time" line (max 150 characters).
2. Note is saved against that attendee's card reference and the current event.
3. Note appears in the user's private "People I met" list, visible only to them.

**Data read.** The user's own saved notes only.

**Data written.** Note text, optional next time line, timestamp, reference to the target attendee's card and event.

**Empty and failure states.**
- No notes saved yet: empty state inviting the user to save their first note from the Board.

**Acceptance criteria.**
- A note is never visible to any user other than its author, under any query path.
- Deleting a note removes it immediately and permanently.
- Notes are private to the user for as long as their device session persists. If the device session is lost, for example by clearing browser data or switching devices, there is no recovery path. This is a known and accepted limitation of the no-account design in version one.
- A note stores a copy of the target's name and role at save time, so it remains readable even after the source card is deleted at the 30 day mark.

### 6.6 Organiser Screen: Event Setup

Enter event name, date, one paragraph description, and an optional topic list (3 to 8 tags). Save generates a join code. Full form completable in under 8 fields.

### 6.7 Organiser Screen: Session Entry

Add one or more sessions: title, start time, speaker name, one line summary. Editable any time. A single toggle marks "schedule has changed" to suspend Room tab timing claims until corrected, with immediate effect on the attendee facing view.

### 6.8 Organiser Screen: Join Code

System generates a short alphanumeric code and QR code on event creation. Regenerating invalidates the old code. Code avoids ambiguous characters (0 and O together) for readability when projected.

### 6.9 Organiser Screen: Flag Review

List of flagged context items with flag count and content. An item flagged by 3 or more distinct attendees is automatically marked unverified and stops being used until reviewed. This threshold is a version one default and may need adjustment based on typical event size, since 3 flags represents a much larger share of a 30 person event than a 120 person one.

### 6.10 Organiser Screen: Event Close

One button, "Close event." Confirms, sets the event to read only for attendees, starts the 7 day and 30 day retention timers. No new cards or notes can be created against a closed event.

### 6.11 Refusals

**When context is missing or insufficient, the product:**
- Refuses to generate an opener for a card with no "tonight" line, falling back to room context and stating the limitation.
- Refuses to reference schedule timing when flagged as changed.
- Refuses to produce topic based suggestions for an event with no topic list or session data, stating this plainly.
- Refuses to infer a session's content from its title alone.
- Refuses to carry anything written at a previous event into a new one.

**When a request is sensitive, risky, invasive, or inappropriate, the product:**
- Refuses to describe another person's personality, temperament, or approachability.
- Refuses to state or imply what another person thinks, feels, or wants.
- Refuses to invent a shared interest not written on both cards.
- Refuses to reveal information about a person beyond what they put on their own card, including in response to a description rather than a name.
- Refuses to help engineer access to or an introduction to a specific third person.
- Refuses to write a full message or script a conversation on the user's behalf.
- Refuses to generate any message or reply that would be sent to another attendee as if written by the user, including if asked directly to impersonate them.
- Refuses to contact anyone on the user's behalf, in any form.
- Refuses any request framed around romantic or sexual interest, appearance, or suitability.

## 7. AI and AI Related Tools and Solutions

Version one uses a language model in exactly one place: generating a single question from a session's one line summary, for the Room Right Now feature. If the call fails or is slow, the session facts are still shown, without the generated question.

**Feature 6.2, The Opener, and Feature 6.3, The Second Question,** use no model call in version one. Both run on fixed sentence templates populated with real card and session fields. This choice removes cost, latency, and hallucination risk from two of the three places they were previously present, without weakening the product's advantage over a generic chatbot, since the advantage comes from having the real fact on file, not from the phrasing of the sentence around it. Model based generation for these two features may be tested in version two once template quality is assessed against real use.

**Feature 6.1, The Board,** and **Feature 6.5, Who I Met,** use no model. Both are pure data retrieval and storage.

**Model choice for the single remaining use.** Anthropic Claude Haiku, called through the standard API, chosen for low per call cost. Free or low cost tier availability should be confirmed against current pricing before build, since this is an assumption, not a guarantee.

**Guardrail.** The prompt lists only the organiser's one line summary as usable input and instructs the model not to add anything beyond it. Output is checked in code for a fuzzy match back to that summary before being shown; if the check fails, the question is dropped and only the session facts are shown.

## 8. Technical Architecture, with Prisma Data Model

**Route structure (Next.js App Router).**
- `/` — public landing page, no data behind it.
- `/join` — enter a join code.
- `/event/[eventId]/card` — attendee's own card setup and visibility toggle.
- `/event/[eventId]/board` — the board.
- `/event/[eventId]/room` — room right now.
- `/event/[eventId]/opener/[attendeeId]` — opener screen for a chosen person.
- `/event/[eventId]/people` — who I met, private to the current user.
- `/organiser/[eventId]` — organiser dashboard.

**Where code runs.** Server components handle all data reads that touch shared or private data, so filtering happens on the server and the client never receives another user's private fields. The single model call in Room Right Now happens in a server action, never client side.

**Auth approach.** No account system in version one. Joining an event with a code creates a lightweight device session (a signed cookie identifying a device as a specific attendee within a specific event). This is an accepted version one limitation: a user who clears cookies or switches devices loses access to their own notes with no recovery path. Organisers use a magic link login by email, separate from attendee sessions, since a lost organiser session is more costly.

**Data access layer.** All reads go through Prisma queries that take the requesting session's attendee identity as a mandatory parameter. Private note queries filter by the author's session token at the query level, not just in application logic.

**Keeping private data out of shared reads.** The Board query only ever selects from `AttendeeCard` where `visible = true`; it never joins to the `PrivateNote` table. `PrivateNote` has no foreign key that any other table's read path traverses into.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Organiser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  events    Event[]
}

model Event {
  id              String    @id @default(cuid())
  name            String
  date            DateTime
  description     String
  topics          Topic[]
  organiserId     String
  organiser       Organiser @relation(fields: [organiserId], references: [id])
  joinCode        JoinCode?
  sessions        Session[]
  attendeeCards   AttendeeCard[]
  scheduleChanged Boolean   @default(false)
  status          EventStatus @default(OPEN)
  closedAt        DateTime?
  createdAt       DateTime  @default(now())
}

enum EventStatus {
  OPEN
  CLOSED
  ARCHIVED
}

model Topic {
  id      String @id @default(cuid())
  eventId String
  event   Event  @relation(fields: [eventId], references: [id])
  label   String

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
  sessionToken String   // device session identity, not globally unique
  roleLine     String
  tonightLine  String?
  visible      Boolean  @default(false)
  topicTags    Topic[]  @relation("CardTopics")
  flags        Flag[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([eventId, sessionToken]) // one card per device session per event; allows the same device to hold cards across many different events
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

**Application layer rule.** Before inserting a new `AttendeeCard`, the application checks for an existing row matching this event and session token, and updates it if found, rather than inserting a duplicate.

**Migrations.** Standard Prisma migrate workflow. No prior data to migrate.

**Deletion jobs.** A daily scheduled job checks `Event.closedAt`. At 7 days past close, set `status = ARCHIVED` and stop serving Board reads. At 30 days past close, hard delete all `AttendeeCard` and `Flag` rows for that event. `PrivateNote` rows are untouched, since they store their own snapshot. Exact hosting and scheduling mechanism is unconfirmed and should be settled before build.

## 9. Vector Database Architecture and Design

Version one does not need a vector database. A single event has, at most, a few hundred attendee cards, each one or two short sentences, and a handful of sessions. Postgres full text search, or simple tag based filtering, handles matching at this volume within the required latency.

**What version one uses instead.** Structured topic tag filtering for the Board, and Postgres full text search if free text search beyond tags is ever needed.

**When vectors would become justified.** If Metvent expands to search across many events at once, or a single event routinely exceeds a few thousand cards, keyword and tag matching stops finding semantically close but differently worded cards, and a vector layer becomes worth the added complexity.

**Design for that future point.** Use pgvector as a Postgres extension rather than a separate vector database product, to avoid introducing a new external service and to preserve the existing data scoping rules through the same query layer. Embed only `tonightLine` and `roleLine`, scoped per event, and never embed anything from `PrivateNote`.

## 10. Vector Database Model

Not implemented in version one. Specified for the point at which it becomes justified.

| Element | Design |
|---|---|
| Store | pgvector extension on the existing Postgres database |
| Table | `attendee_card_embeddings` |
| Vector dimensions | Matches the embedding model chosen at that time; exact model not yet selected |
| Fields stored with each vector | `attendeeCardId`, `eventId`, `text_hash` |
| Filter keys | `eventId`, always required; `communityId` only for an explicit future cross event feature, never a global unscoped query |
| Scoping keys | `eventId` for standard search, `communityId` for the future recurring community feature |
| Retention | Embeddings deleted at the same 30 day mark as the source `AttendeeCard` row |
| Hard boundary | `PrivateNote` content is never embedded or indexed, under any circumstance |

## 11. Business Model

Version one is free for attendees and organisers. No payment flow to build.

**Cost drivers.** Database hosting, one language model call per session viewed on Room Right Now (a small number per event), and web hosting. All have workable free or near free tiers for weeks of testing across a handful of events.

**Plausible revenue path, not for version one.** If organisers see value in fewer silent rooms and better attendee retention, a future paid tier could sit on the organiser side: richer event setup, multiple sessions, or analytics on event connection outcomes.

## 12. Success Metrics

**Primary metric one: notes saved against a named person.** Defined as a `PrivateNote` row created with non empty `noteText`, tied to a specific `AttendeeCard`. A saved note is a proxy for contact, not proof of it. A user can save a note about someone they observed but never spoke to. This metric should be read as an upper bound on real conversations, not a confirmed count.

**Primary metric two: second event return.** Defined as the same device session joining a second event from the same organiser within a reasonable window. This undercounts true returners who switch devices, an accepted limitation of the no-account design.

**Supporting metrics.**
- Percentage of joined attendees who set their card to visible.
- Percentage of visible attendees who viewed at least one opener.
- Repeat opens per event, as a signal that live room content draws people back without a stated question.
- Room tab views with no other action taken.

**What would justify continuing.** A meaningful share of visible attendees save at least one note in a given event, and a meaningful share return for the next one. Exact thresholds are illustrative starting points and should be set by the founder before the first test event.

**What would say stop or rethink.** Attendees set cards visible but rarely generate an opener or save a note. Attendees use it once and do not return for a second event even when one is available within a reasonable window.

## 13. Risks

**Risk one, most severe: an attendee is approached by someone they did not want to meet, because they were visible in a way they did not expect.** Mitigation: visibility off by default, one tap to turn off with immediate effect on the next request, no ranking or suggestion of who to approach, no signal to anyone about who viewed their card.

**Risk two: a generated sentence states or implies something false about a person.** Mitigation: the source line requirement on every generated or templated sentence, and the model output validation check on the one remaining AI use.

**Risk three: low usage, or usage indistinguishable from a generic chatbot.** Mitigation: an organiser who actively announces the product before doors open, the room card as the hook for people with no current question, and metrics that measure saved notes and return rather than raw opens.

## 14. What Version One Does Not Do

- No messaging between attendees.
- No matching or ranking of people.
- No post event follow up drafting.
- No personality or communication style profiling.
- No photos or physical check in.
- No cross event attendee profiles.
- No public event directory.
- No paid tier.
- No native mobile app.
- No presence detection through sensors.
- No inference about any person beyond words they typed themselves.
- No model based generation for the Opener or Second Question features.
- No account system or password based login for attendees.

## 15. Open Questions

- Which specific community and organiser will run the first test event, and has that organiser agreed to announce the product from the front of the room?
- What is the actual acceptable threshold for "enough attendees saved a note" and "enough attendees returned," referenced as illustrative in Section 12?
- Should the flag threshold that marks content unverified, set at 3 in Section 6.9, be adjusted based on typical event size?
- Is there a specific hosting provider already preferred for the Next.js app and Postgres database, which affects the scheduled deletion job design in Section 8?

## Assumptions Summary

1. The model call for Room Right Now uses Anthropic Claude Haiku; pricing and free tier availability should be confirmed before build.
2. A fuzzy match threshold validates that the generated question traces back to the organiser's summary; the exact threshold is an implementation detail to tune during build.
3. Attendee identity is device session based, with no account, accepted as a real limitation on returning attendee tracking and note durability, in exchange for frictionless joining at the door.
4. The scheduled deletion job is assumed to run as a simple scheduled serverless function; exact hosting choice is unconfirmed.
5. Postgres full text search is assumed sufficient for version one's data volumes, avoiding any vector database dependency.
6. If a vector layer is ever built, pgvector on the existing Postgres database is recommended over a separate vector database product.
7. Total run cost per event is assumed to stay under a few dollars based on one model call use case; this should be checked against current pricing before committing to a provider.
8. The "meaningful share" thresholds used in Success Metrics to judge whether to continue are illustrative placeholders, not founder supplied targets.
