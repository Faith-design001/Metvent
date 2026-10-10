Metvent

Metvent is a web page opened at one specific event that shows what is happening in the room and what attendees have said they want to talk about. It turns real event data into something specific an attendee can say, without guessing anything about another person. Version one serves solo attendees at recurring monthly community meetups of 30 to 120 people, where the main problem is continuing a conversation after it starts.

Who uses it
Attendee: the primary user. Joins with a code, no account.
Organiser: sets up the event and is the only source of shared event context. Not a user of the attendee experience.
The first launch community is technical and product focused. The card format is untested elsewhere.
The one thing the agent must do well

Never invent a fact about an attendee, event, session, or conversation. Every sentence the product shows must name the exact field it came from. When data is missing, the product says so or stops.

Why: the product's only advantage over a generic chatbot is that it uses what is really on file. One invented fact removes that advantage and can embarrass or harm a real person.

Which source wins
metvent-prd-v2.md decides product behavior. The rules files below decide how to build it. Why: one authority for "what", one for "how".
If two sources disagree, stop and ask. Do not pick one. Why: a silent pick hides the conflict from the owner.
Every "Open items" section in a rules file is unresolved. Do not build the part it covers until the owner decides. Why: those items are places where the PRD is silent or contradicts itself.
Rules files
File	Job
ai-and-templates.md	The one model call, fixed templates, what the product never says
privacy-boundaries.md	Visibility, private notes, usage records, logs
retention-and-deletion.md	Event close, the 7 and 30 day rules, the deletion job
data-model.md	The Prisma schema and stored limits
database-safety.md	Who may change or touch which database
identity-and-sessions.md	Device sessions and organiser login
organiser-screens.md	The five organiser screens
security.md	Secrets, input, access, error output
device-and-network.md	Behavior on a mid range phone and weak network
code-quality.md	Code style and change size
testing-and-done.md	When a change counts as finished, tests that must exist
writing-style.md	How replies, interface text, comments, and names read
Stack
Next.js (App Router), TypeScript, Prisma, PostgreSQL.
Gemini free tier for the single Room Right Now model call. PRD section 7 still says Claude Haiku. See ai-and-templates.md, Open items.
Flutterwave is in the fixed stack. Build no payment flow. Why: version one is free (PRD section 11).
PGVector is reserved. Build no vector search. Why: PRD section 9 says version one does not need it.
Routes
/ landing page
/join enter a join code
/event/[eventId]/card own card and visibility
/event/[eventId]/board Board
/event/[eventId]/room Room Right Now
/event/[eventId]/opener/[attendeeId] Opener (attendeeId is the AttendeeCard id)
/event/[eventId]/people private Who I Met
/organiser/[eventId] organiser dashboard

The PRD gives no route for organiser login or for creating an event (no eventId exists yet). Ask before adding either. Use the existing repository structure for file paths.

Not in scope for version one

Attendee messaging or anything sent as the user. Matching, ranking, or highlighting people. Post-event follow-up drafting. Personality, feeling, intent, or approachability profiling. Photos, check-in, or sensors. Cross-event profiles or notes. Public event directory. Payment or paid tier. Native app. Model generation for Opener or Second Question. Attendee accounts or passwords. Organiser analytics. Non-technical community adaptation. Languages other than English. Vector search.

Why: PRD sections 5 and 14. These are the features an agent is most likely to add by habit.

How to work
Make one change at a time. Commit after each verified change, one change per commit, with a plain message saying what changed and why. Why: small commits can be undone one at a time.
Never force push. Never rewrite history that was already pushed. Why: it destroys other people's work with no warning.
Ask before adding any dependency. Known asks to expect: QR code generation, magic link email sending, the Gemini client, a test runner, rate limit storage. Why: each one adds weight for the phone and a new thing to maintain.
Do not change the schema, run migrations, or touch any database except as database-safety.md allows.
Stop and ask when the PRD and rules are silent on a required decision. A required decision changes what a user sees, what is stored, or who may read it. Decide small implementation choices yourself (variable names, how to split a file). Why: asking on everything stalls the work; guessing on these invents product facts.
Read the project's scripts (for example in package.json) before running anything. Do not guess commands.
End every response with two lists. Confirmed: each item cites a PRD section or rules file. Unresolved: anything else you assumed, and every open item you hit. Why: the owner can then see exactly what was decided and what was guessed.
Terms
Attendee card: one card per device session per event, with a role line, an optional tonight line, a visibility setting, and up to three event topic tags.
Thin card: a card with a role line and no tonight line (PRD 6.2).
Device session: the lightweight attendee identity made by joining with a code. No account, no recovery.
Room context: the current or most recently completed session, as entered by the organiser.
Private note: a note about a person met, readable only by its author.
Visible attendee: an attendee who turned their own card visibility on.
Unverified item: an item flagged by three or more distinct attendees (PRD 6.9). Do not use it until the organiser reviews it.