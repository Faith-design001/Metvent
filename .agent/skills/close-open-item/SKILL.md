---
name: close-open-item
description: Use when the owner gives a decision on an open item in a Metvent rules file. Turns the decision into a rule and removes every stale copy of the old open item.
---

# Close an open item

Close one open item at a time. Follow the steps in order.

## Steps

1. Quote the open item word for word. Name the file it is in.
   - Check: your reply shows the quote and the file name.

2. Search `AGENTS.md`, every file in `.agent/rules`, and every file in `.agent/skills` for the key words of the item. List every file that mentions it.
   - Check: your reply shows the list, even if it has one file.

3. Write the owner's decision as one plain sentence. Ask the owner to confirm it.
   - Check: the owner has answered yes. If not, stop here.

4. Compare the decision with the PRD section it touches.
   - Check: your reply says "matches the PRD" or "conflicts with the PRD section X".
   - If it conflicts, write an owner action to edit the PRD. Do not edit the PRD.

5. Decide whether the decision needs a schema change.
   - Check: your reply says "schema change needed" or "no schema change".
   - If a change is needed, write the proposed change in your reply. Do not edit the schema or any migration. Tell the owner the next step is a schema task under `database-safety.md`.

6. In the file that holds the open item, delete the open item. Write a rule in its place.
   - Check: the open item text no longer appears in that file.
   - Check: the new rule has a line starting with "Why:".

7. Open every other file from step 2. Remove or rewrite each mention of the old open item.
   - Check: repeat the search from step 2. It returns no mention of the open item as unresolved.

8. List the files you changed. Show the lines you removed and the lines you added.
   - Check: the changed files in your list are only rules files, skill files, or `AGENTS.md`. No source code, schema, or PRD file is in it.