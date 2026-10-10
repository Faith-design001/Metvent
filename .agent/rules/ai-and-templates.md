---
trigger: glob
globs: **/app/event/*/room/**,**/app/event/*/opener/**,**/lib/ai/**,**/lib/templates/**
---

# ai-and-templates.md

Job: control how Metvent produces text. This covers the one model call, the fixed templates, what the templates may never say, and what happens when context is missing.

## The one model call

- Call a model in one place only: the single question on Room Right Now.
  Why: the PRD removed model calls everywhere else to cut cost, delay, and invented facts.
- Keep the provider and model name in one config module. Provider: Gemini free tier. Model name: owner decision.
  Why: one place to change later.
- Make the call from a server action (code that runs on the server when a form or button sends a request). Never call a model from the browser.
  Why: the browser would expose the access key and let anyone spend the free quota.
- Send only the organiser's one line summary for that session, as quoted text. Tell the model to treat it as text to read, not as instructions, and to add nothing.
  Why: every extra input is a way for an invented fact in, and an organiser line could contain instructions.
- Never send the summary of an unverified session, and make no call while the schedule changed switch is on.
  Why: an unverified item must not be used, and the PRD shows only the event description while the schedule is being corrected.
- Ask for exactly one question per session.
  Why: one line cannot support two specific questions without padding.
- Check the answer against the summary before showing it. If the check fails, or if no match threshold has been set by the owner, show no question.
  Why: the model can add facts the organiser never wrote, and an unchecked question has no guard.
- If the call fails, is slow, or hits the free tier limit, show the session facts with no question and no error message.
  Why: the tab must never block a person standing in a room.
- Time limit for the call: proposed 3 seconds, owner to confirm.
  Why: "slow" cannot be tested without a number.

## Fixed templates

- Build the opener and the second question from fixed templates. Make no model call for them.
  Why: the advantage is the real fact on file, not the wording around it.
- Fill a slot only with text a person typed on their own card, or a session field the organiser entered. Insert it in quotation marks, exactly as typed, with no trimming or rephrasing. Render it as plain text.
  Why: rephrasing is where invented facts enter, and typed text can carry markup.
- Return every sentence with its source: `tonightLine`, `roleLine`, `Session.title`, `userText`, or `fixed text` for a sentence with no slot. A sentence with a slot and no source is a failed test.
  Why: the owner can check that nothing was made up.
- Opener: use the tonight line first. Show two or three variations, each with its source shown under it.
  Why: the tonight line is the one thing the person wrote for this purpose.
- Second question: key the templates to the other person's stated topic, or to the user's optional short text. End with the one fixed exit line.
  Why: it is built for a short pause, one tap and one optional line.
- Treat the optional text as discarded after the response. Send it in a POST body, never in a URL. Never write it to the database, a log, or an error report.
  Why: URLs and logs outlive the response.
- Use only the fixed exit line below. Never write a new one.
  Why: a free-form exit could imply rejection of the other person.
- Quote a session title in a template if needed. Never say or imply what the session covered.
  Why: titles mislead, and a guess is an invented fact.
- Write no template that presumes something about the person, such as that they started something, found it hard, or want to be approached.
  Why: PRD 6.2 bans any claim about a person beyond what is quoted.

## What the product never says or does

The product has no chat box. These limits are met by what templates and screens can contain.

- Say nothing about a person's personality, temperament, approachability, feelings, wants, or intent.
  Why: a card holds no evidence for any of it, and a wrong guess harms a real person.
- Name a shared interest only when the same event topic tag is on both cards. Version one has no shared interest template. Add none.
  Why: free-text overlap needs fuzzy guessing, and false common ground costs trust.
- Reveal nothing beyond a person's own card. Build no search or lookup by description.
  Why: the card is all the person offered.
- Offer no send, share, or contact action. Show suggestions as words to say in person.
  Why: the PRD bans messages written as the user, scripts, impersonation, and contacting anyone for them.
- Build nothing that helps reach a specific third person.
  Why: the user chooses whom to approach.
- Accept no input about romantic or sexual interest, appearance, or suitability, and write no template on those subjects.
  Why: it is invasive and outside the product's purpose.
- Suggest no one as a better person to talk to.
  Why: the product must not pressure anyone or rank people.

## When context is missing

- A thin card falls back to the room context, and the screen says there is not enough written by this person. (Pending the first open item below.)
  Why: the product must say what it does not know.
- An empty card with no room context: say the event has not provided enough information, and stop.
  Why: an opener with nothing behind it would be invented.
- An event with no topics and no sessions: give no topic based suggestions and say so plainly.
  Why: the same reason.
- Treat an unverified item as missing.
  Why: PRD 6.9 says it stops being used until reviewed.
- Never fall back to general advice.
  Why: advice that fits any event is what a free chatbot already gives.

## Proposed template wording

STATUS: PROPOSED. Not approved. Do not build until the owner marks it approved. Braces are filled from the source field.

- Opener, tonight line present (source `tonightLine`):
  - Your card says you want to talk about "{tonight_line}". What made you pick that for tonight?
  - I saw "{tonight_line}" on your card. Where would you like to start with it?
  - Your card mentions "{tonight_line}". What would you like to ask or hear about it?
- Opener, room context only (source `Session.title`):
  - "{session_title}" is the latest session on the schedule. What did you make of it?
  - The latest session on the schedule is "{session_title}". Did you get to see it?
- Second question, from the other person's topic (source `tonightLine`):
  - What would you like to say about "{topic}"?
  - Where does "{topic}" matter most for you tonight?
  - What would you want to hear from someone about "{topic}"?
- Second question, from the user's text (source `userText`):
  - You mentioned "{user_text}". What led you to that?
- Exit line (source `fixed text`):
  - Thank you for the chat. I am going to say hello to a few others. Enjoy the rest of the night.

## Open items for the owner

- Role line: PRD 6.2 step 2 says use the role line when there is no tonight line. PRD 6.2 empty states and 6.11 say fall back to room context. Decide which applies. Until then, build the room context fallback only.
- Model provider: PRD section 7 and Assumption 1 say Claude Haiku. This project says Gemini free tier. Update one of them.
- Once or every view: PRD does not say whether the question is generated once per session or on every view. Every view means one call per attendee and could use up the free tier. Once needs a place to store the question, which is a schema change (see data-model.md). Do not build the call until this is decided.
- "Stated topic": PRD 6.3 says "stated topic" and also "templates keyed to topic categories". Decide whether this means the tonight line or the event topic tags.
- Match threshold: the number that decides a pass or fail on the question check.
- Optional text screening: the PRD refuses requests about romantic or sexual interest, but the optional text is quoted back and cannot be detected without a word list or model. Decide whether to screen it, and how.