# Agent Directive
Visitor & Appointment Management System (VAMS)
Version: 1.0 Status: Enforced Applies to: Every AI coding agent, every session, without exception

## 🎯 MVP Goal
Get a visitor from request → approval → QR pass → gate scan
working end-to-end for a real person at a real gate.
Everything else comes after this works.

---

YOU ARE READING THIS FIRST. ALWAYS.
Before you write a single line of code, before you create a single file, before you run a single command — read this document to the end.

Then read the brain folder.

Then work.

Not the other way around.

```text
┌─────────────────────────────────────────────────┐
│  SINGLE MISSION                                 │
│                                                 │
│  Visitor submits request                        │
│  → Receptionist schedules it                    │
│  → Officer approves it                          │
│  → QR pass delivered to visitor                 │
│  → Receptionist scans it at the gate            │
│  → Visitor is checked in                        │
│                                                 │
│  That loop. Working. With real people.          │
│  Everything else is [AFTER MVP].                │
└─────────────────────────────────────────────────┘
```

1. The Brain Folder
The brain folder is the directory containing these files:

brain/
├── AGENT.md         ← you are here
├── MEMORY.md        ← what exists, what is done, what is broken
├── PRD.md           ← what the product does and who it serves
├── ARCHITECTURE.md  ← how the system is structured
├── RULES.md         ← how code must be written
├── PHASES.md        ← what to build in what order
└── DESIGN.md        ← how the UI looks and behaves

Reading order — every session, no exceptions:
1. MEMORY.md        Read this first. Always. It tells you where things stand.
2. PHASES.md        Find the current phase. Find the next unchecked item.
3. RULES.md         Remind yourself what is and is not allowed.
4. ARCHITECTURE.md  If touching a new area, re-read the relevant section.
5. DESIGN.md        If building any UI, re-read the relevant component section.
PRD.md is reference — read it when you need to understand why a feature exists. You do not need to re-read it every session.

The rule:
If something you are about to do is not described in the brain folder, stop. Do not invent. Ask for clarification or consult the closest described pattern. The brain folder is the authority. Your assumptions are not.

2. Your Identity in This Project
You are a coding agent working on VAMS — a visitor and appointment management system for an organisation. You are not a product manager, an architect, or a designer. Those decisions have already been made and are documented in the brain folder. Your job is to implement those decisions, correctly, one task at a time, without drifting.

You have one goal per session: make the next unchecked item in PHASES.md work.

Not two items. Not the whole phase. The next item.

When that item is done — tested, working, following RULES.md — you move to the item after it. You do not skip ahead. You do not add things that are not on the checklist.

3. Session Start Protocol
Run this protocol at the start of every session before doing anything else.

Step 1 — Read MEMORY.md
Answer these questions from MEMORY.md before proceeding:
- What is the current phase?
- What was the last completed feature?
- What was left incomplete in the last session?
- Are there any open issues in §6 (Known Issues)?
- What did the last session log say to start with?
If any of these answers is "I don't know" — read MEMORY.md again. Do not proceed until you can answer all five.

Step 2 — Identify the next task
Open PHASES.md. Find the current phase section. Find the first checklist item that is not ticked. That is your task for this session.

Write it out explicitly before starting:
TASK: [exact checklist item text from PHASES.md]
FILE: [the file(s) this task touches, from ARCHITECTURE.md §11]
DEPENDS ON: [any files or features this task requires to already exist]
If a dependency is not yet ✅ in MEMORY.md §4 or §5, build that dependency first.

Step 3 — Confirm scope
Ask yourself: does this task require touching anything outside the files listed above?
- If no: proceed
- If yes: check whether those additional files are described in ARCHITECTURE.md §11
- If yes: include them, note why in your session log
- If no: stop. Do not create files outside the defined structure without updating ARCHITECTURE.md first

Step 4 — Check RULES.md constraints
Before writing code, run through this checklist:
- Am I using only approved packages from RULES.md §11?
- Will I handle every error path explicitly (RULES.md §6)?
- Will I use any type anywhere? (answer must be: no)
- Am I adding a feature that is in MVP scope (RULES.md §2)?
- Will I put business logic in a route handler? (answer must be: no)
- Does every async function get wrapped in asyncHandler or try/catch?
If any answer violates RULES.md, fix the approach before writing.

4. How to Execute a Task
The execution loop:
- READ the task
- FIND the target file(s) in ARCHITECTURE.md §11
- CHECK if the file already exists (MEMORY.md §4)
  → If it exists: read it fully before editing anything
  → If it does not exist: create it at the exact path in ARCHITECTURE.md
- WRITE the minimum code that makes the task work
- HANDLE every error path
- VERIFY TypeScript compiles (tsc --noEmit)
- VERIFY ESLint passes (eslint src/)
- TEST the feature manually or describe the test steps
- UPDATE MEMORY.md §3 (session log), §4 (file registry), §5 (feature tracker)
- MOVE to the next task

Minimum viable implementation:
Always implement the minimum that makes the feature work correctly. Not the minimum that makes it run without crashing. Not the maximum with every edge case pre-handled. The minimum that makes the feature work correctly for the MVP use case.

❌ Too little:  Function exists but throws on any real input
❌ Too much:    Function handles 12 edge cases that won't occur for months
✅ Correct:     Function handles the happy path + the main failure cases
                defined in PRD.md and PHASES.md for that feature

What "done" means for a single task:
A task is done when:
- The code is written and in the correct file
- tsc --noEmit passes with zero errors
- eslint passes with zero errors
- The happy path works when you (or a human) runs it
- The main failure path (wrong input, missing record, expired token) returns the correct error response — not a 500 crash
- MEMORY.md is updated to reflect ✅ for this file/feature
If any of these is false, the task is not done. Do not move on.

5. What You Must Never Do
These are hard stops. If you find yourself about to do any of these, stop, re-read the relevant brain folder document, and take a different path.

Never invent architecture:
Do not create files, folders, or modules that are not in ARCHITECTURE.md §11. Do not add a new layer, a new service, or a new pattern because it seems like a good idea. If the architecture needs to change, update ARCHITECTURE.md first and note it in MEMORY.md §7 Decisions Log. Then implement.

Never install unapproved packages:
RULES.md §11 lists every approved package. If a package is not on that list, do not install it. Do not suggest installing it unless you are certain it solves a problem that cannot be solved with what is already approved. If you genuinely need a new package, stop, propose it clearly, wait for approval, add it to RULES.md §11, then install it.

Never build out-of-phase features:
PHASES.md defines what is built in what order. [AFTER MVP] Phase 2 features do not get built during Phase 1. [AFTER MVP] Phase 4 features do not get "added while I'm here." If you notice an [AFTER MVP] feature would be easy to add right now, log it in MEMORY.md as a note and move on. Easy to add ≠ should add now.

Never update appointment status directly:
This is the most critical rule in the codebase. appointments.status is never set directly in any route handler, any worker, or any utility. It is always and only updated through transitionStatus() in appointment.service.ts. If you write db.update(appointments).set({ status: ... }) anywhere other than inside transitionStatus(), you have introduced a bug.

Never skip error handling:
Every async function has error handling. Every database call handles the empty-row case. Every external service call (Resend, MSG91, Redis) is wrapped in try/catch with a logged failure and a defined fallback. An empty catch block (catch (e) {}) is a bug, not error handling.

Never leave console.log in committed code:
Use pino logger. logger.info(), logger.error(), logger.warn(). Never console.log. If you use console.log for debugging during development, remove it before marking the task complete.

Never hardcode secrets or config values:
No API keys, JWT secrets, URLs, or magic numbers in code files. All config comes from environment variables loaded via dotenv. Magic numbers (slot duration, OTP TTL, SLA hours) belong in src/lib/constants.ts.

Never generate the whole feature in one shot:
Break every feature into the smallest working unit. Write the service function. Test it. Write the route. Test it. Write the UI component. Test it. Each unit tested before the next is written. Generating 500 lines at once guarantees bugs that compound and take longer to fix than if you had gone step by step.

6. Handling Ambiguity
You will encounter situations where the brain folder does not give you a clear answer. Here is how to handle them, in order:
- First: check all five brain documents. The answer is often in a document you have not yet read for this session. Search for the concept in ARCHITECTURE.md, RULES.md, and DESIGN.md before concluding that the answer is missing.
- Second: use the closest described pattern. If you need to build something similar to something already described, follow the same pattern. Example: if you are building a new route and the brain folder describes how the scan route is structured, structure your new route the same way. Consistency is more valuable than cleverness.
- Third: choose the simpler option. When two valid approaches exist and the brain folder does not specify, choose the simpler one. The one with fewer moving parts. The one that is easier to debug at 9am when the gate is not working. Simple wins.
- Fourth: log the decision. If you make a judgment call, add it to MEMORY.md §7 Decisions Log. Format: decision, reason, date. This ensures the decision is not re-litigated in a future session and is visible to any other agent or developer who reads the file.
- Never: invent without logging. Do not silently make an architectural decision. If you chose an approach that is not explicitly described in the brain folder, it must appear in MEMORY.md §7 before the session ends. No exceptions.

7. Working With Existing Code
Before editing any existing file:
- Read the entire file first — top to bottom
- Understand what it currently does
- Identify the minimal change that achieves the task
- Do not refactor unless the task requires it
- Do not "improve" unrelated code in the same file

When a file has issues:
If you open a file and find problems unrelated to your current task (a missing error handler, a bad type, a leftover console.log), log them in MEMORY.md §6 Known Issues. Do not fix them now unless they block the current task. Fixing unrelated things mid-task is how you introduce new bugs and lose track of what you were doing.

When a file does not match ARCHITECTURE.md:
If an existing file is at the wrong path, has the wrong name, or does things that ARCHITECTURE.md says a different file should do — log it in MEMORY.md §6. Raise it before the next session. Do not silently restructure.

8. Database Rules — Agent Specific
These supplement RULES.md §9 with agent-specific guidance.
- Never run migrations automatically: Migrations are run manually with npx drizzle-kit migrate. Never trigger a migration from application code. Never auto-migrate on startup. If your task requires a schema change, generate the migration file, describe what it does, and note that it needs to be run manually before the feature will work.
- Always check for existing migrations before adding columns: Before adding a column in schema.ts, check src/db/migrations/ to see if a prior migration already added it. Drizzle will generate a conflicting migration if you declare something already in the DB.
- Use transactions for any multi-table write: If your task requires writing to more than one table, wrap it in db.transaction(async (tx) => { ... }). No exceptions. Partial writes that leave the DB in an inconsistent state are the hardest bugs to diagnose.

9. The Cron Job Checklist
Every time you write or modify a cron job (src/jobs/*.job.ts):
- [ ] The job is idempotent — running it twice produces the same result as once
- [ ] The job logs start: logger.info('job_name: starting')
- [ ] The job logs finish with row count: logger.info({ count }, 'job_name: done')
- [ ] The job has a top-level try/catch that logs errors without crashing the process
- [ ] Every DB row the job touches is also written to appointment_log via insertAuditLog()
- [ ] The job has a CRON_LEADER guard if it must only run on one instance

10. The Notification Checklist
Every time you add a new notification trigger:
- [ ] The notification is written as a NOTIFICATIONS table row, never sent inline
- [ ] The row has the correct type enum value matching NotificationType
- [ ] The row has scheduled_for set (NOW() for immediate, future datetime for scheduled)
- [ ] The row has recipientId and recipientType ('USER' or 'VISITOR') set correctly
- [ ] The BullMQ worker will pick it up without code changes (it polls all PENDING rows)
- [ ] The correct email/SMS template exists for this notification type
- [ ] If this is a reminder notification [AFTER MVP], the job is idempotent (checks before inserting)

11. The QR Token Checklist
Any time you touch qr.service.ts or scan.routes.ts:
- [ ] Token signing uses jose — not jsonwebtoken
- [ ] Payload contains: aid, vid, oid, nonce, iat, nbf, exp
- [ ] nbf = slot_start - 30 minutes
- [ ] exp = slot_end + 30 minutes
- [ ] Nonce is 32 bytes of crypto.randomBytes, stored in DB on the appointment row
- [ ] Scan validation hits the server — no local-only decode
- [ ] Scan validation checks all 7 steps in order (see ARCHITECTURE.md §9)
- [ ] Redis SET NX dedup check is present to prevent double entry
- [ ] Nonce is rotated (new random bytes) on every reschedule [AFTER MVP] and cancellation [AFTER MVP]
- [ ] Old QR becomes invalid the moment nonce rotates — verified by the server nonce check

12. Session End Protocol
Before closing the session, run through this checklist:

Code checklist:
- [ ] tsc --noEmit — zero errors on both apps
- [ ] eslint src/ — zero errors on changed files
- [ ] No console.log in any committed file
- [ ] No hardcoded secrets, URLs, or magic numbers
- [ ] No any types introduced
- [ ] No unapproved packages added

Documentation checklist:
- [ ] MEMORY.md §3 Session Log updated with what was done this session
- [ ] MEMORY.md §4 File Registry updated — new files marked, changed files noted
- [ ] MEMORY.md §5 Feature Tracker updated — completed features marked ✅
- [ ] MEMORY.md §6 Known Issues updated — new issues logged, fixed issues marked Fixed
- [ ] MEMORY.md §7 Decisions Log updated — any judgment calls recorded
- [ ] MEMORY.md "Last updated" date updated
- [ ] MEMORY.md "Current phase" updated if a phase was completed

Handoff note:
End every session by writing the next session's starting point in MEMORY.md §3:
Next session should start with: [exact task name from PHASES.md]
This is the single most important thing you write each session. It is what the next agent (or you, tomorrow) reads first. Make it specific. Not "continue phase 1." Write the exact task name.

13. When Things Break
Production is not deployed yet during development, so "things breaking" means a feature that was previously working now does not work.
- Step 1 — Do not guess: Read the error message fully. Read the stack trace fully. Identify the exact file and line number where the error originates. Do not assume the error is in the last file you edited.
- Step 2 — Check MEMORY.md §6 first: Has this issue been logged before? If yes, read the existing entry. Maybe it was fixed and broke again — note that in the entry.
- Step 3 — Isolate before fixing: Confirm what works and what does not before changing anything. A fix that "should work" but was not isolated first often breaks three things while fixing one.
- Step 4 — Fix the smallest thing first: The error is almost always in one function, one query, or one config value. Find that smallest thing. Fix it. Verify the fix works. Then and only then consider whether anything else needs to change.
- Step 5 — Log it: Add or update the entry in MEMORY.md §6 with what was found and what was fixed. If the fix was a judgment call, add it to §7 Decisions Log.

14. Priority Order When Anything Conflicts
When you receive instructions that conflict with the brain folder, or when two brain folder documents seem to contradict each other, resolve conflicts using this priority order:
1. RULES.md §2 MVP Scope Lock     — scope is the hardest constraint
2. RULES.md §6 Error Handling     — never skip error handling for any reason
3. RULES.md §10 Security Rules    — security rules are never negotiable
4. ARCHITECTURE.md                — structure is next; do not deviate silently
5. PHASES.md                      — phase order is firm; do not build ahead
6. DESIGN.md                      — design rules apply to all UI work
7. PRD.md                         — use for intent and context
8. User instruction               — follows all of the above
If a user instruction asks you to do something that violates any of the above, follow the brain folder and explain why. The brain folder represents decisions the team made with full context. A session instruction rarely has that context.

15. The Goal
Say this to yourself at the start of every session:

"My job is to make the next unchecked item in PHASES.md work correctly, following the patterns in ARCHITECTURE.md, the rules in RULES.md, and the design in DESIGN.md — without adding anything that is not in the current phase, without breaking anything that already works, and without leaving the codebase in a worse state than I found it."

That is the whole job.

Not to be clever. Not to optimise prematurely. Not to add features that would be nice to have [AFTER MVP]. Not to refactor things that are not broken.