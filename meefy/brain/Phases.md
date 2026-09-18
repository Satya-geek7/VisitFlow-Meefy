Development Phases :- 

                  VisitFlow(meefy)

Visitor & Appointment Management System (VAMS)
Version: 1.0 Status: Active Companion docs: PRD.md · ARCHITECTURE.md · RULES.md

Build it. Ship it. Learn from it. Improve it. In that order. Always in that order.

The Mindset
Most software projects fail not because the code was bad but because the team tried to build everything before anyone used anything.

VAMS follows a different approach:

Phase 0 — Foundation. The repo, the DB, the skeleton. Nothing visible yet.
Phase 1 — MVP. The core loop works end-to-end. Real people can use it.
Phase 2 — Hardening. What breaks when real people use it gets fixed.
Phase 3 — Experience. The friction gets removed. The product feels good.
Phase 4 — Scale. New capabilities added only after the core is proven.
No phase begins until the previous one is complete and verified with real usage. Not 80% complete. Not "good enough." Done — per the Definition of Done in RULES.md.

Phase Overview
Phase 0 — Foundation          1–2 weeks    Repo, DB, auth skeleton
Phase 1 — MVP Core            3–4 weeks    Full visitor loop working
Phase 2 — Hardening           2–3 weeks    Stable, tested, error-proof
Phase 3 — Experience          2–3 weeks    Fast, smooth, professional
Phase 4 — Growth              ongoing      New capabilities as needed
Total to working MVP used by real people: 4–6 weeks. Total to a polished, production-grade product: 10–13 weeks.

Phase 0 — Foundation
Goal: A developer can clone the repo, run one command, and have the full stack running locally with the database seeded. Nothing visible to end users yet.

Duration: 1–2 weeks

0.1 Monorepo setup
 Initialise pnpm workspace with Turborepo
 Create apps/web, apps/api, packages/shared
 tsconfig.base.json with strict mode extended by both apps
 Root package.json with dev, build, lint, typecheck scripts
 Prettier + ESLint configured and enforced
 .env.example with every required variable documented
 docker-compose.yml — Postgres 16 + Redis on localhost
 README.md — clone to running in under 10 commands
0.2 Database
 Drizzle ORM installed and configured in apps/api
 Full schema written in apps/api/src/db/schema.ts — all 6 tables
 0001_init.sql migration generated and tested
 All required indexes added (see RULES.md §9)
 seed.ts script: 1 admin, 3 officers, 2 receptionists, 5 sample visitors
0.3 Shared package
 All Zod schemas in packages/shared/schemas/
 All TypeScript types derived from schemas
 AppointmentStatus const object with all 12 states
 VALID_TRANSITIONS map — the state machine definition
 Both apps import from @vams/shared — zero duplication
0.4 Express skeleton
 Express 5 app with middleware stack: helmet, cors, morgan, json parser
 Global error handler middleware
 asyncHandler wrapper
 AppError class and Errors factory
 pino logger configured — no console.log anywhere
 Health check route: GET /health returns { status: 'ok', uptime }
 RBAC middleware: authenticate + requireRole
 Rate limiter configured for OTP and scan routes
0.5 Next.js skeleton
 Next.js 14 App Router with TypeScript
 Tailwind + shadcn/ui installed
 Route groups: (public), (auth), (dashboard)
 NextAuth v5 configured with Credentials provider
 middleware.ts — session guard on /dashboard/*
 Typed api fetch wrapper in lib/api.ts
 TanStack Query provider in root layout
 Sidebar + TopBar layout components (shell only, no data yet)
0.6 CI
 GitHub Actions: typecheck, lint, build on every PR
 PR cannot merge if any check fails
Phase 0 exit criteria: pnpm dev starts both apps with zero errors. tsc --noEmit passes on both apps. Database migration runs clean. Seed script populates test data.

Phase 1 — MVP Core
Goal: A visitor can submit a request, a receptionist can schedule it, an officer can approve it, a QR pass is delivered, and the receptionist can scan it at the gate. The full loop works end-to-end with real emails and SMS.

Duration: 3–4 weeks

This is the only phase that matters. Everything before enables it. Everything after improves it. Do not move to Phase 2 until a real person has walked through the full loop without help.

1.1 Visitor OTP + request form
 POST /api/visitors/otp/send — MSG91 sends OTP, stores in Redis TTL 10min
 POST /api/visitors/otp/verify — validates OTP, returns visitor session JWT
 POST /api/appointments — creates appointment at SUBMITTED, upserts visitor
 Public page /request — multi-step form: details → OTP → submit
 Zod validation on all fields, field-level errors shown inline
 On submit: visitor redirected to /status/:token
 Confirmation email to visitor via Resend (plain and functional — not pretty yet)
 Email notification to receptionist on new submission
1.2 Receptionist queue
 GET /api/appointments?status=SUBMITTED — paginated, sorted by created_at
 /receptionist/queue page — list of request cards
 Each card: visitor name, contact, purpose, preferred officer, preferred time, actions
 "Reject" action: PATCH /api/appointments/:id/reject with mandatory reason
 Status transitions to REJECTED, rejection email sent to visitor
 Empty state when queue is clear
1.3 Scheduling
 GET /api/officers — list all active officers for officer selector
 GET /api/officers/:id/availability?week=YYYY-WW
 Computes free/busy from default hours + blocked slots + existing appointments
 Overlap query uses correct interval check: slot_start < end AND slot_end > start
 Returns array of SlotResult[]
 /receptionist/schedule page
 Officer selector with name search
 Week grid: FREE (white) / BUSY (coloured) / BLOCKED (striped)
 Click FREE slot pre-fills scheduling form below grid
 Duration picker: 30 / 60 / 90 min
 Submit: PATCH /api/appointments/:id/screen — transitions SUBMITTED → SCREENED → HOST_PENDING
 Server re-validates slot on submit — conflict guard, not just UI check
 Clear error returned and displayed if slot was taken since grid loaded
1.4 Officer decision
 GET /api/appointments?officerId=me&status=HOST_PENDING — own pending requests only
 /officer/pending page — request cards with visitor name, purpose, proposed slot
 "Approve" action: PATCH /api/appointments/:id/approve
 Transitions HOST_PENDING → APPROVED → PASS_ISSUED in one transaction
 Generates nonce, signs JWT, generates QR PNG
 Stores nonce + pass_expires_at in DB
 Enqueues pass email to visitor and calendar confirmation to officer
 "Decline" action: PATCH /api/appointments/:id/decline with optional reason
 Transitions HOST_PENDING → DECLINED
 Enqueues decline email to visitor
1.5 Pass issuance
 qr.service.ts:
 signToken() — signs JWT with aid, vid, oid, nonce, nbf, exp
 generateQrPng() — returns PNG Buffer via qrcode package
 Pass email template: officer name, date, time, floor/location, QR embedded as base64 img
 What to bring section: government ID required at gate
 Cancellation link embedded in email (token-gated URL, no login needed)
 /status/:token page shows QR image when status is PASS_ISSUED
 Calendar confirmation email sent to officer
1.6 Notification queue
 All sends go through NOTIFICATIONS table rows — never inline in API handlers
 BullMQ worker: polls PENDING rows, sends via Resend or MSG91, marks SENT or FAILED
 On failure: retry up to 3 times with exponential backoff (1min → 5min → 15min)
 Failed notifications logged with error_message field populated
1.7 Gate scan
 POST /api/scan/verify — full 7-step server-side validation:
JWT signature valid
nbf <= now <= exp
Appointment found by aid
token.nonce === db.nonce
appointment.status === PASS_ISSUED
Redis SET NX dedup check (no double entry)
Return visitor photo URL for visual confirmation
 Returns { valid: true, appointment, visitor } or { valid: false, reason }
 PATCH /api/appointments/:id/checkin — PASS_ISSUED → CHECKED_IN
 PATCH /api/appointments/:id/checkout — CHECKED_IN → CHECKED_OUT
 /receptionist/scan page:
 Full-screen camera via jsQR, continuous decode loop, debounced
 Valid scan: shows visitor photo + appointment card + Confirm button
 Invalid scan: clear error state with specific reason code shown
 Confirmed check-in: shows success, resets scanner for next visitor
 Second scan of same QR after CHECKED_IN: triggers check-out flow
1.8 Check-out and occupancy
 /receptionist/occupancy — all CHECKED_IN appointments
 Columns: visitor name, officer, check-in time, slot end, time on premises
 Overstay highlight: time on premises > slot_end + 30 minutes
 Auto-checkout cron (every 5 min): CHECKED_IN → CHECKED_OUT where slot_end + 2h < NOW()
 Auto-expire cron (every 5 min): PASS_ISSUED → EXPIRED where pass_expires_at < NOW()
 No-show cron (every 5 min): PASS_ISSUED → NO_SHOW where slot_start + 15min < NOW()
 Every cron transition writes to appointment_log with actor_id = null (system)
1.9 Admin basics
 GET /api/users — list all org users
 POST /api/users — create officer or receptionist account
 PATCH /api/users/:id/deactivate — soft deactivate, revokes login
 /admin/users page — user table with create and deactivate actions
 POST /api/visitors/blacklist — add by phone or email with reason
 Blacklist check on POST /api/appointments — rejected at submission with clear message
 /admin/blacklist page — blacklist table with add and remove actions
Phase 1 exit criteria: A real person who is not the developer submits a request, receives OTP, gets a QR pass by email, and is scanned in and out at a real gate. Every step works without manual DB intervention. The occupancy board reflects who is inside in real time.

Phase 2 — Hardening
Goal: Fix everything that breaks when real people use it at volume. Add the safety nets. Add reminders. Enforce SLAs. Make it trustworthy.

Duration: 2–3 weeks Trigger: Phase 1 exit criteria met + at least 10 real visits completed.

2.1 Reminder jobs
 T−24h reminder: email + SMS to visitor with QR pass resent
 T−1h reminder: email + SMS to visitor with slot details
 T−30min: email to officer, visitor arriving soon
 Reminder jobs are idempotent — check NOTIFICATIONS before inserting duplicates
 Reminders auto-cancelled when appointment hits a terminal state
2.2 SLA enforcement
 HOST_PENDING cards show SLA timer countdown on officer's pending screen
 SLA breach at 4 hours (configurable): escalation email to admin
 Admin view flags all SLA-breached requests
 SCREENED requests with no officer response for 24h: alert to receptionist
2.3 Visitor cancellation
 /cancel/:token page — visitor cancels from the link in their pass email
 POST /api/appointments/:id/cancel — visitor-initiated cancel via token
 Nonce rotated on cancel — old QR immediately dead
 Cancellation email to officer and receptionist
 Cancellations blocked within 1 hour of slot start
2.4 Rescheduling
 Receptionist can reschedule an approved appointment to a new slot
 Nonce rotated on reschedule — old QR dead
 New pass email sent to visitor with updated QR
 Both visitor and officer notified of new slot
 Rescheduling blocked after CHECKED_IN
2.5 Audit log viewer
 /admin/audit — full appointment_log table, filtered by appointment, actor, date range
 Each row: timestamp, actor name + role, from status, to status, IP, note
 Export to CSV
2.6 Edge case handling
 Officer deactivated after appointment is HOST_PENDING: receptionist alerted, returned to SCREENED
 Slot taken between grid load and submit: server returns conflict error, UI shows it cleanly
 Duplicate OTP send within 60 seconds: rate limited with a clear message
 QR scanned outside time window: NOT_YET_VALID vs EXPIRED shown distinctly
 Network failure during scan: scan UI shows retry button, no false success state
2.7 Walk-in express lane
 /receptionist/walkin — fast form: visitor name, phone, purpose, officer
 Creates appointment at SCREENED, skips OTP (receptionist vouches)
 Immediately emails officer with approve/decline link
 5-minute response window shown as countdown on receptionist screen
 After timeout: receptionist manually approves or declines
2.8 Notification failure visibility
 /admin/notifications — FAILED rows with error message and manual retry button
 Admin can see full delivery status for any appointment's notifications
Phase 2 exit criteria: Zero unhandled errors in production logs for 7 consecutive days. All SLA timers firing correctly. Reminders delivered reliably. Cancellation and reschedule tested end-to-end by a real user.

Phase 3 — Experience
Goal: Stop feeling like internal tooling. Start feeling like a product. Performance, UI polish, and the features that make daily use genuinely smooth.

Duration: 2–3 weeks Trigger: Phase 2 exit criteria met.

3.1 Web Push notifications
 VAPID keys generated and stored in env
 PushSubscriber.tsx requests push permission from officer and receptionist on login
 Push subscriptions stored per user in DB
 BullMQ push worker sends via Web Push API
 Officer: push on new HOST_PENDING request and on visitor check-in
 Receptionist: push on new SUBMITTED request and on auto-checkout firing
3.2 Real-time occupancy
 Occupancy board polls every 30 seconds via TanStack Query refetchInterval
 Occupancy count badge in sidebar nav updates live
 Successful scan triggers immediate query invalidation so board updates instantly
3.3 Officer calendar polish
 /officer/calendar — personal week and month view
 Appointments rendered as time blocks with visitor name and purpose
 Click block → appointment detail drawer (visitor info, slot, status, actions)
 Colleagues' calendars shown as free/busy overlay — no meeting details visible
 Availability settings: default hours picker, block date range selector, override slots
3.4 UI polish pass
 Loading skeletons on all data-fetching pages — no raw spinners
 Empty states for every list: queue, pending, occupancy, calendar
 Toast notifications on every user action: scheduled, approved, declined, scanned
 Consistent spacing across all pages: 24px card padding, 48px page gutters
 Mobile-responsive layout for /request, /status/:token, and /officer/*
 Visitor status page /status/:token designed properly — it is the only thing visitors ever see
3.5 Scan interface hardening
 Haptic feedback on valid and invalid scan (on supported devices)
 Distinct audio cue for valid vs invalid (user-configurable, default on)
 Last 5 scans shown below camera for shift handover context
 Torch toggle button for low-light gate environments
 Works correctly on tablet in landscape mode at a fixed gate desk
3.6 Performance pass
 Queue page load P95 ≤ 1 second: run EXPLAIN ANALYZE on slow queries, add indexes
 QR scan round-trip P95 ≤ 800ms: Redis lookup is the critical path
 Availability grid render ≤ 500ms on officer change
 LCP ≤ 2.5s on /request on a mobile connection
 All pages pass next build with zero warnings
3.7 Email template polish
 Pass email: designed, on-brand, tested in Gmail, Outlook, and Apple Mail
 All transactional emails have consistent header, footer, and purpose note
 All templates previewed in React Email dev server before production deploy
Phase 3 exit criteria: Lighthouse performance score ≥ 85 on all key pages. Receptionist and officer describe the product as easy to use without being asked. No layout shift or visual glitch on the scan page.

Phase 4 — Growth
Goal: Extend the product based on what real usage reveals. Nothing in this phase is built before Phase 3 is stable. Priority order reflects user demand, not developer preference.

Duration: Ongoing, sprint-by-sprint Trigger: Phase 3 exit criteria met + 30 days of stable production usage.

4.1 Officer-initiated invites
Officers invite known visitors directly without receptionist screening. Officer sends invite link, visitor fills their details, pass issues on completion. Designed for pre-screened vendors, consultants, and recurring visitors.

4.2 Recurring passes
Multi-entry passes for contractors with a defined access window such as Mon–Fri for 2 weeks. A single QR that resets daily within the window. Requires explicit expiry date and daily entry limits.

4.3 Reports and analytics
Visit volume by week, month, officer
Average time from submission to pass issuance
No-show and cancellation rates
Occupancy peaks by hour and day of week
Officer response time distribution
Export to CSV and PDF
4.4 Visitor self-service portal
Visitors create a lightweight account verified by phone OTP. Can view past and upcoming visits, cancel or reschedule without calling in, and have details pre-filled on return visits.

4.5 Group visits
One appointment record for a party of multiple visitors. One officer approval covers the group. Each member receives their own individual QR. Requires party size at request time and per-member check-in tracking.

4.6 Admin compliance export
DPDP-compliant data export: all visitor data associated with a phone or email on request. Data purge request flow with confirmation and audit log. Retention policy enforcement dashboard showing upcoming purge schedule.

4.7 Badge printing
On check-in confirmation, print a visitor badge via Brother or DYMO SDK. Badge content: visitor name, officer name, date, time, VISITOR label, optional photo. Requires printer connected to receptionist workstation via USB or local network.

4.8 Calendar integrations
Officer availability auto-synced from Google Calendar or Outlook. Blocked slots imported automatically — no manual management needed. Two-way sync: VAMS appointments appear in the officer's external calendar.

4.9 Multi-site support
Multiple campuses or buildings under one org account. Appointments, officers, and receptionists scoped to a site. Admin has cross-site visibility and reporting. Gate scanners scoped to their site — cannot check in visitors for another site.

4.10 Native mobile app
iOS and Android apps for officers (approve or decline from anywhere) and receptionists (scan from a phone without a fixed tablet). Web app stays the primary interface — mobile is additive, not a replacement.

Phase Completion Checklist
Before marking any phase complete, every item must be true. Not most. Every one.

 Every checklist item in the phase is done — not "almost done"
 tsc --noEmit passes with zero errors on both apps
 eslint passes with zero errors on both apps
 Every error path tested manually: wrong OTP, expired QR, taken slot, declined request
 At least one person who is not the developer has used the feature
 No new packages introduced outside RULES.md §11
 No features from a later phase implemented early
 ARCHITECTURE.md updated if any structural decision changed
The Scoreboard
Update this after every phase completes. Keep it honest.

Phase	Status	Started	Completed	Real visits logged
0 — Foundation	Not started	—	—	—
1 — MVP Core	Not started	—	—	—
2 — Hardening	Not started	—	—	—
3 — Experience	Not started	—	—	—
4 — Growth	Not started	—	—	—
The visitors standing at your gate do not care about your roadmap. They care that the QR works, the officer knows they are there, and they are not kept waiting.

Build that first. Build everything else second.