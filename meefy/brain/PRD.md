# Product Requirements Document (PRD.md)

**VisitFlow (meefy)** — Visitor & Appointment Management System (VAMS)  
**Version:** 1.0 | **Status:** Enforced | **Stack:** Next.js 14 · TypeScript · React · Express · PostgreSQL  
**Last updated:** September 2026  

## 🎯 MVP Goal
Get a visitor from request → approval → QR pass → gate scan
working end-to-end for a real person at a real gate.
Everything else comes after this works.

---

## 1. Purpose
VAMS is an internal web application that digitises and secures the end-to-end lifecycle of external visitor management for an organisation — from initial visit request through on-campus check-in and check-out — replacing paper registers, ad-hoc email chains, and untracked walk-ins with a structured, auditable, and notification-driven workflow.

---

## 2. ⛔ What We Are NOT Building (MVP) — [AFTER MVP]

**These features are strictly out of scope for MVP and will NOT be developed until the core loop is verified with real users:**
* **[AFTER MVP]** Mobile native apps (iOS / Android)
* **[AFTER MVP]** Room / resource booking
* **[AFTER MVP]** Walk-in express lane (Phase 2 feature)
* **[AFTER MVP]** Video or virtual visit management
* **[AFTER MVP]** Integration with HR systems or LDAP / Active Directory
* **[AFTER MVP]** Biometric identity verification
* **[AFTER MVP]** Visitor badge printing
* **[AFTER MVP]** Multi-site / multi-campus support
* **[AFTER MVP]** Payment or invoicing
* **[AFTER MVP]** Executive analytics and trend reports (Phase 4 feature)
* **[AFTER MVP]** Web Push notifications (browser push — Phase 3 feature)
* **[AFTER MVP]** Recurring contractor passes and group visits

---

## 3. Problem Statement
Organisations managing external visitors with manual or semi-manual processes face four recurring problems:
1. **No central record:** Visit requests arrive by phone, email, and walk-in with no single system of record.
2. **No gate-level verification:** Security has no reliable way to confirm a visitor is expected or that their appointment is still valid.
3. **No real-time occupancy:** During emergencies, there is no accurate list of who is currently inside the building.
4. **No audit trail:** After the fact, there is no way to reconstruct who approved a visit, when, or why.

VAMS solves all four.

---

## 4. Goals

| Goal | Measure | Status |
| :--- | :--- | :--- |
| Eliminate paper visitor registers | 0 paper logs in use 30 days after launch | **MVP Core** |
| All visit requests tracked in one system | 100% of scheduled visits have a VAMS record | **MVP Core** |
| Gate verification under 15 seconds | QR scan-to-confirm P95 ≤ 15s | **MVP Core** |
| Officers approve or decline within SLA | 90% of HOST_PENDING requests actioned within 4 hours | **MVP Core** |
| Accurate live occupancy at all times | Occupancy board reflects reality within 60 seconds | **MVP Core** |

---

## 5. Users & Roles

### 5.1 Visitor (External, unauthenticated) — MVP Core
An individual external to the organisation who wishes to meet an officer. Visitors do not have accounts. They are identified by OTP-verified phone number at request time. Repeat visitors are matched by phone or email and their visit history accumulates automatically.

**Primary needs:**
* Submit a visit request without creating an account (`/request`)
* Know the status of their request at any time (`/status/:token`)
* Receive their entry pass reliably before the visit (via Email / SMS)
* Cancel or reschedule without calling the organisation *([AFTER MVP] self-cancellation)*

### 5.2 Officer (Internal, authenticated) — MVP Core
An employee of the organisation who is the intended host of a visit. Officers have accounts with the `OFFICER` role.

**Primary needs:**
* Review and action incoming visit requests quickly (`/officer/pending`)
* See only their own calendar and appointments — not colleagues' meeting details
* Be alerted the moment their visitor arrives at the gate (Email / SMS in MVP; *[AFTER MVP] Push*)
* Block time or adjust availability without involving a receptionist

### 5.3 Receptionist (Internal, authenticated) — MVP Core
Org staff responsible for screening requests, scheduling slots against officer availability, and verifying visitors at the gate. Assigned the `RECEPTIONIST` role. Multiple receptionists may share the role. Any `RECEPTIONIST` account can scan QR passes.

**Primary needs:**
* A clear queue of unactioned requests with all visitor details (`/receptionist/queue`)
* An officer-availability calendar showing free/busy to pick slots without double-booking (`/receptionist/schedule`)
* A fast, reliable scan interface that gives an unambiguous pass/fail signal (`/receptionist/scan`)
* A live view of everyone currently on premises (`/receptionist/occupancy`)

### 5.4 Master Admin (Internal, authenticated) — MVP Core
Organisation administrator with full system access. Assigned the `ADMIN` role.

**Primary needs:**
* Manage user accounts (create, deactivate, assign roles via `/admin/users`)
* Manage the visitor blacklist (`/admin/blacklist`)
* View system-wide audit logs
* View system-wide reports and analytics *([AFTER MVP])*
* Configure data retention and notification settings *([AFTER MVP])*

---

## 6. Appointment Lifecycle State Machine
Every appointment moves through a fixed state machine. No direct database updates — all transitions go through the `transitionStatus` service, which writes an immutable audit log row on every change.

```
SUBMITTED → SCREENED → HOST_PENDING → APPROVED → PASS_ISSUED → CHECKED_IN → CHECKED_OUT
```
* **Exit states (terminal):** `REJECTED` · `DECLINED` · `CANCELLED` · `EXPIRED` · `NO_SHOW`

| Transition | Actor | Trigger | Scope |
| :--- | :--- | :--- | :--- |
| `→ SCREENED` | Receptionist | Reviews request, assigns officer + slot | **MVP Core** |
| `→ HOST_PENDING` | System | After receptionist assigns slot | **MVP Core** |
| `→ APPROVED` | Officer | Accepts the request | **MVP Core** |
| `→ DECLINED` | Officer | Declines the request | **MVP Core** |
| `→ REJECTED` | Receptionist | Rejects at screening (blacklisted, incomplete, fraudulent) | **MVP Core** |
| `→ PASS_ISSUED` | System | Automatically on officer approval; generates signed QR token | **MVP Core** |
| `→ CHECKED_IN` | Receptionist | Scans QR pass at gate | **MVP Core** |
| `→ CHECKED_OUT` | Receptionist / System | Scans QR on exit, or auto-close 2h after slot end | **MVP Core** |
| `→ EXPIRED` | System (cron) | Pass not scanned 30 min after slot end | **MVP Core** |
| `→ NO_SHOW` | System (cron) | Visitor not checked in 15 min after slot start | **MVP Core** |
| `→ CANCELLED` | Visitor / Officer / Admin | Any party cancels before check-in | **MVP Core** |

---

## 7. Features

### 7.1 Visitor Request (Public) — MVP Core
* Public form at `/request` — no login required
* Fields: full name, email, phone, organisation, purpose of visit, preferred officer, preferred date and time range, any notes
* Phone OTP verification before submission — blocks anonymous spam
* On submission: visitor receives confirmation email/SMS; receptionist receives notification
* Repeat visitor detection: if phone or email matches an existing record, history is linked silently

### 7.2 Request Screening (Receptionist) — MVP Core
* Queue view at `/receptionist/queue` of all `SUBMITTED` requests, sorted by submission time
* Each card shows: visitor name, contact, purpose, preferred officer, preferred time
* Actions: Screen & Schedule (opens slot picker) or Reject (with reason, notifies visitor)
* Blacklist check runs automatically on submission; flagged requests are surfaced at the top of the queue

### 7.3 Scheduling (Receptionist) — MVP Core
* Officer selector: search by name or department
* Week-grid calendar: shows the selected officer's free (white) / busy (colour) / blocked (striped) slots
* Clicking a free slot pre-fills the scheduling form: officer + slot + visitor details
* Duration selector: 30 / 60 / 90 minutes
* On submit: server re-validates the slot for conflicts (optimistic concurrency guard); if taken, shows an error and returns to the grid
* Blocked slots are visually distinct from busy-with-appointment slots and are not clickable
* Receptionist cannot book outside an officer's working hours unless an override slot exists

### 7.4 Host Decision (Officer) — MVP Core
* Officer sees `HOST_PENDING` requests in their dashboard (`/officer/pending`) with: visitor name, purpose, proposed slot
* Actions: Approve or Decline (with optional message to visitor)
* SLA timer shown on each pending card — escalation email to admin if not actioned within 4 hours *([AFTER MVP] escalation)*
* On approval: system auto-issues the pass and notifies both parties
* On decline: visitor receives email/SMS with officer's message; receptionist is notified

### 7.5 Pass Issuance (System) — MVP Core
* Triggered automatically when officer approves
* Generates a signed JWT token: `{ aid, vid, oid, nonce, iat, nbf, exp }`
* `nbf` = 30 minutes before slot start
* `exp` = 30 minutes after slot end
* `nonce` = 32-byte random hex, stored in DB, rotated on reschedule or cancel
* QR code rendered as PNG, embedded base64 in email (not linked — works offline)
* Pass email to visitor includes: officer name, date, time, floor/location, QR image, what to bring, cancellation link
* Calendar confirmation email to officer with visitor details
* SMS to visitor with slot details and a link to the status page (`/status/:token`)
* **[AFTER MVP]** Reminder jobs: email + SMS to visitor at T−24h and T−1h; push to officer at T−30min

### 7.6 Gate Verification (Receptionist) — MVP Core
* Full-screen scan interface at `/receptionist/scan`
* Scans QR with device camera via browser (no app required)
* Every scan hits the server — no local-only validation
* Server checks in order: JWT signature → expiry window → nonce match → status == `PASS_ISSUED`
* On valid scan: appointment card shown with visitor photo + officer name + slot time; receptionist visually confirms photo matches person; taps Confirm Check-In
* On invalid scan: clear error state — `EXPIRED` / `ALREADY USED` / `CANCELLED` / `INVALID` — with no ambiguity
* On check-in confirmed: status → `CHECKED_IN`; alert sent to officer: *"Your visitor [Name] has arrived"*
* Check-out scan: same interface; second scan of same QR transitions → `CHECKED_OUT`
* The `gate_verify` permission is a role capability, not tied to a single person — any `RECEPTIONIST` account can scan

### 7.7 Officer Calendar & Availability — MVP Core / [AFTER MVP]
* Personal calendar view: officer's own appointments only (not colleagues' details)
* Availability settings:
  * Default working hours (start time / end time, applies every weekday)
  * Block dates or date-time ranges (holidays, out-of-office, internal meetings)
  * Override slots (availability outside default hours for a specific date)
* **[AFTER MVP]** Colleagues' calendars visible as free/busy overlay — no meeting details, no visitor names
* **[AFTER MVP]** Calendar two-way external sync (Google / Outlook)

### 7.8 Live Occupancy Board (Receptionist + Admin) — MVP Core
* List of all visitors currently in `CHECKED_IN` status at `/receptionist/occupancy`
* Columns: visitor name, host officer, check-in time, expected slot end, time on premises
* Auto-highlights overstays (time on premises > slot end + 30 min)
* Auto-checkout job fires 2 hours after slot end; flags as system-closed so receptionist can see it was automatic
* Occupancy count shown in the sidebar nav badge at all times

### 7.9 Notifications — MVP Core (Email/SMS) | [AFTER MVP] (Push)
| Event | Visitor | Officer | Receptionist | Channel |
| :--- | :--- | :--- | :--- | :--- |
| Request submitted | Confirmation | — | New request alert | Email · SMS · *[AFTER MVP] Push* |
| Forwarded to officer | Forwarded notice | Approval request | — | Email · *[AFTER MVP] Push* |
| Officer approved | Approved notice | — | Pass queued | Email · *[AFTER MVP] Push* |
| Officer declined | Declined + reason| — | Closed notice | Email · *[AFTER MVP] Push* |
| Pass issued | QR pass + details| Calendar confirm | — | Email · SMS |
| **[AFTER MVP]** Reminder T−24h | Reminder + QR | — | — | Email · SMS |
| **[AFTER MVP]** Reminder T−1h | Reminder + QR | — | — | Email · SMS |
| **[AFTER MVP]** Reminder T−30min | — | Visitor arriving soon | — | Web Push |
| Checked in | Confirmed | Visitor arrived | — | SMS · *[AFTER MVP] Push* |
| Declined at gate | Invalid pass notice| — | — | *[AFTER MVP] Push* |
| No-show | Notice | Notice | — | Email · *[AFTER MVP] Push* |
| Auto check-out | — | — | System close notice| *[AFTER MVP] Push* |

All notifications are queued jobs — never inline in the API request. Failed sends retry up to 3 times with exponential backoff.

### 7.10 Admin Panel — MVP Core / [AFTER MVP]
* **User management (MVP Core):** create / deactivate officer and receptionist accounts, reset passwords, assign roles (`/admin/users`)
* **Blacklist (MVP Core):** add visitor by phone or email with reason; blacklisted visitors are flagged at submission and blocked at screening (`/admin/blacklist`)
* **Audit log (MVP Core):** full immutable history of every status transition — actor, timestamp, IP, note
* **[AFTER MVP] Reports & Analytics:**
  * Visit volume by week / month
  * Average time from submission to approval
  * No-show and cancellation rates
  * Occupancy peaks by hour and day
  * Officer response time distribution
* **[AFTER MVP] Retention settings:** configure auto-purge schedule
* **[AFTER MVP] Notification config:** toggle channels, edit SMS / email templates

### 7.11 [AFTER MVP] Walk-in Express Lane (Receptionist)
* Fast-track form for unscheduled visitors: name, phone, purpose, officer
* Creates appointment at `SCREENED` status, immediately pings officer
* Officer has 5 minutes to respond; after timeout, receptionist decides
* *(Deferred to Phase 2 hardening).*

---

## 8. Non-Functional Requirements

### 8.1 Security — MVP Core
* All API routes authenticated except `/api/visitors/otp/*` and the public request form
* Role-based access control enforced in Express middleware on every route
* JWT tokens for QR passes signed with HMAC-SHA256; secret rotated quarterly
* QR nonce rotated on every reschedule and cancellation — old passes immediately invalid
* OTP codes expire in 10 minutes; maximum 5 attempts before lockout
* HTTPS everywhere; HSTS headers on all responses
* Visitor photos stored in object storage (not DB); signed URLs with 1-hour expiry
* Passwords hashed with bcrypt (cost factor 12)

### 8.2 Performance — MVP Core
* Appointment queue page load ≤ 1 second (P95)
* QR scan server round-trip ≤ 800ms (P95)
* Officer calendar grid renders within 500ms on slot change
* Notification delivery within 30 seconds of trigger event

### 8.3 Reliability — MVP Core
* Notification failures do not fail the API response — fire and forget via queue
* Cron jobs are idempotent — safe to re-run if a job fires twice
* All status transitions wrapped in Postgres transactions with row-level locks — no race conditions on slot booking

### 8.4 Compliance (India) — MVP Core
* DPDP Act 2023: explicit purpose statement at data collection; retention limits enforced by auto-purge cron
* TRAI DLT registration required for transactional SMS — use MSG91 with registered sender ID and templates
* Visitor data not shared with third parties beyond notification providers (Resend, MSG91)

### 8.5 Accessibility — MVP Core
* WCAG 2.1 AA compliance on all public-facing pages
* Scan interface keyboard-accessible (for desk scanner hardware)
* All form errors announced to screen readers

---

## 9. Data Retention
| Data type | Retention period | Action on expiry | Scope |
| :--- | :--- | :--- | :--- |
| Routine visit records | 90 days from check-out | Soft delete, then hard purge | **MVP Core** |
| Security incident records | 1 year | Hard purge | **MVP Core** |
| Audit log | 2 years | Archive to cold storage | **MVP Core** |
| Visitor photos | 90 days from last visit | Delete from object storage | **MVP Core** |
| OTP codes | 10 minutes | Auto-expire in Redis | **MVP Core** |
| Notification logs | 90 days | Hard purge | **MVP Core** |

---

## 10. Tech Stack Summary
* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
* **State management:** TanStack Query (server state), Zustand (client state)
* **Forms & validation:** React Hook Form + Zod (shared schemas)
* **API:** Express 5, TypeScript, Zod
* **ORM & DB:** Drizzle ORM, PostgreSQL 16
* **Cache / Queue broker:** Redis (Upstash) + BullMQ
* **Auth:** NextAuth v5 (internal users), custom OTP (visitors)
* **QR token:** JWT via Jose, signed HMAC-SHA256
* **Email:** Resend with React Email templates
* **SMS:** MSG91 (DLT-registered)
* **[AFTER MVP] Push:** Web Push API (browser notifications — Phase 3)
* **File storage:** S3-compatible object storage (visitor photos)
* **QR generation:** `qrcode` npm package, rendered server-side to PNG

---

## 11. Open Questions
1. Should officers be able to invite visitors directly (bypassing receptionist screening)? → **Resolved: [AFTER MVP] Phase 4.**
2. Is a physical badge / label print required at check-in in v1? → **Resolved: [AFTER MVP] Phase 4.**
3. What is the official SLA for officer approval response? → **4h SLA configured in Phase 2.**
4. Is group visit support needed in v1? → **Resolved: [AFTER MVP] Phase 4.**
5. Will there be a second gate / secondary scan point? → Facilities / Ops before sprint 3.
6. Who owns MSG91 DLT registration and sender ID setup? → IT / Compliance.

---

> *This document covers v1 MVP scope as the supreme priority. Features deferred to later versions are explicitly marked `[AFTER MVP]`.*