---
description: Update docs at end of a work session so the next agent starts informed
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(git diff --stat:*), Bash(git log --oneline:*), Bash(wc -l:*), Bash(ls:*)
---

End-of-session docs update. Efficiently sync all project docs to reflect work done this session.

## Instructions

Do this quickly and surgically. Only touch files that have stale content. Do NOT rewrite files that are already accurate.

### Step 1: Understand what changed this session

- Run `git diff --stat` and `git log --oneline -10` to see what was modified
- Review your own conversation context for what was built, fixed, or decided

### Step 2: Update docs (only what's stale)

Check each file below. Skip any that are already accurate.

**`docs/ROADMAP.md`** -- Mark completed items `[x]`, update phase status `[DONE]`, add new items if scope changed.

**`CLAUDE.md`** (project root) -- Update if any of these changed:
- New routes added
- Known issues resolved or new ones discovered
- New key patterns or architecture decisions
- Project structure changes (new directories, major new files)
- Build notes changed

**`docs/CAIRN58.md`** -- Update if features were added, removed, or significantly changed. Keep the Timeline section current with a one-line entry for this session.

**`docs/session-start/database.md`** -- Update if tables, columns, RLS policies, or storage buckets changed.

**`docs/session-start/patterns.md`** -- Update if new components, routes, or design patterns were added.

**`docs/session-start/stack.md`** -- Update if dependencies, scripts, or infrastructure changed.

**`MEMORY.md`** (auto-memory at `~/.claude/projects/-Users-bentyson-summit58/memory/MEMORY.md`) -- Update Current Status, Known Gaps, and Roadmap progress. Keep under 50 lines.

### Step 3: Archive bloat

If any doc file has grown beyond usefulness (e.g., verbose session logs, outdated planning docs, superseded specs), either:
- Trim it to just the still-relevant content
- Move it to `docs/archive/` with a one-line note in the original location pointing to it
- Delete it if truly dead (confirm with user first)

Check `docs/` for any `.md` files not linked from `CLAUDE.md` or `docs/session-start/README.md` -- these are candidates for archival.

### Step 4: Verify coherence

Quickly scan for contradictions across docs:
- CLAUDE.md "Known Issues" vs ROADMAP.md completed items (remove resolved issues)
- MEMORY.md status vs ROADMAP.md status (should agree)
- CAIRN58.md feature descriptions vs actual code state

### Output

Print a short summary:
```
Docs updated:
- [file]: [what changed]
- [file]: skipped (already current)

Archived:
- [file] -> docs/archive/[file] (reason)
  or "nothing to archive"

Next phase: [phase name + first 2-3 items]
```
