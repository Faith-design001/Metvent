---
trigger: always_on
---

# writing-style.md

Job: set how everything the agent writes reads. This covers replies, interface text, code comments, commit messages, and names in code.

## Rules

- Use plain English. Pick the simple word.
  Why: nobody should need to decode what you wrote.
- Write one idea per sentence, in the active voice.
  Why: short sentences are quicker to read and harder to misread.
- Do not use em dashes. Use a comma, colon, full stop, or brackets.
  Why: this is the owner's standing style for every project.
- In a reply to the owner, explain a technical term in plain words the first time it appears in that reply. Do not repeat the explanation in the same reply.
  Why: the reader should not have to look it up, and repeating it adds noise.
- Keep jargon out of interface text. Write it as you would to a friend.
  Why: attendees are standing in a room with a phone, not reading documentation.
- Write interface text in English only.
  Why: the PRD defers other languages to version two.
- Use the PRD's own wording for empty and failure messages where it gives them (for example "No one has joined the board yet. Be the first").
  Why: those strings are part of the acceptance criteria.
- Use the names the PRD gives to features and fields (attendee card, device session, `roleLine`, `tonightLine`) in prose and in code identifiers. Do not invent other terms.
  Why: invented words cannot be searched for and confuse later readers.