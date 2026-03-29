---
description: Update docs at end of a work session so the next agent starts informed
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(git diff --stat:*), Bash(git log --oneline:*), Bash(wc -l:*), Bash(npm run build:*)
---

End-of-session docs maintenance. You are the maintainer of documentation that future agents will rely on. Every line you write or keep must earn its place.

## Core Principles

1. **Docs describe current state, not history.** Never add "what was done this session" — update facts in place. Git is the changelog.
2. **One fact, one location.** If something is in CLAUDE.md, it must not also be in mobile_roadmap.md. Find the canonical home and update there.
3. **Code is truth.** Don't document what an agent can derive by reading the code. Document what they CAN'T: architecture decisions, constraints, gotchas, cross-cutting concerns.
4. **Less is more.** Deleting an outdated line is more valuable than adding a new one. Every line costs future agents context tokens.

## Doc Structure (do not create new files)

| File | Purpose | Max Lines |
|------|---------|-----------|
| `CLAUDE.md` | Single source of truth. Stack, patterns, DB schema, API, server modules, routes, rules. | 200 |
| `docs/mobile_roadmap.md` | Mobile-specific: architecture decisions, completed phase summary, upcoming phases, UX requirements, risks. | 150 |
| `docs/ben.md` | Ops checklist: Stripe setup, GSC, env vars. Manual human actions only. | 60 |
| `docs/gpx-import-guide.md` | GPX trail data workflow. Update only if import process changes. | 100 |

## Process

### Step 1: Gather what changed

```
git diff --stat
git log --oneline -15
```

Cross-reference with your conversation context. Categorize changes:
- **Schema changes** (new tables, columns, RLS) → CLAUDE.md Database section
- **New API endpoints** → CLAUDE.md API Endpoints table
- **New server modules or major functions** → CLAUDE.md Server Modules table
- **New routes** → CLAUDE.md Key Routes table
- **Mobile phase progress** → docs/mobile_roadmap.md Completed Phases table + update next phase
- **New web/mobile patterns** → CLAUDE.md Patterns section
- **Known issues resolved** → remove from CLAUDE.md Known Issues
- **New known issues** → add to CLAUDE.md Known Issues
- **Ops tasks discovered** → docs/ben.md
- **Architecture decisions** → docs/mobile_roadmap.md (if mobile) or CLAUDE.md (if cross-cutting)
- **Project structure changes** → CLAUDE.md Project Structure

### Step 2: Update (only stale content)

Read each file that needs updates. Make surgical edits:
- **Update facts in place** — change the existing line, don't append a new one
- **Add to existing tables** — don't create new sections for content that fits in existing tables
- **Remove resolved items** — delete lines about things that are no longer true
- **Compact completed phases** — in mobile_roadmap.md, completed phases get ONE row in the summary table, not a section

For CLAUDE.md specifically, maintain these sections in order:
1. Stack + commands
2. Project Structure
3. Server Modules (table)
4. Web Patterns (bullets)
5. Mobile Patterns (bullets)
6. API Endpoints (table for v1, bullets for web-only)
7. Database (tables + key fields + RLS)
8. Key Routes (table)
9. Dual-Platform Rules
10. Known Issues
11. Remaining Web Roadmap (compact)
12. Reference Docs (links to other docs files)

### Step 3: Trim bloat

Check line counts:
```
wc -l CLAUDE.md docs/mobile_roadmap.md docs/ben.md
```

If any file exceeds its max:
- CLAUDE.md > 200: Identify the least-useful section. Can it be derived from code? Remove it.
- mobile_roadmap.md > 150: Are completed phases verbose? Compact them to table rows.
- Orphan files: `ls docs/` — if any .md file exists that isn't in the table above, it should be deleted (except gpx-import-guide.md).

### Step 4: Consistency check

Verify no contradictions:
- CLAUDE.md "API Endpoints" table matches actual files in `src/routes/api/v1/`
- CLAUDE.md "Known Issues" doesn't list things that were fixed
- mobile_roadmap.md "Completed Phases" matches what's actually built
- CLAUDE.md "Server Modules" table matches actual files in `src/lib/server/`

### Step 5: Build verification

```
npm run build
```

### Step 6: Update auto-memory

Read the memory index at the path in your system context. Update the relevant project memory file if the project's status, phase, or key architecture changed. Keep memory focused on what's NOT in the docs (user preferences, session context, inter-conversation state).

## Output

```
Updated:
- [file]: [1-line description of what changed]

Removed:
- [file]: [what was removed and why]

Skipped (already current):
- [file]

Line counts: CLAUDE.md [N], mobile_roadmap.md [N], ben.md [N]
Build: pass/fail
```

Do NOT commit. The user commits when ready.
