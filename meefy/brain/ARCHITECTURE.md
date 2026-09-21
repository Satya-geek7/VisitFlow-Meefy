Architecture Document

                    VisitFlow(meefy)
 
Visitor & Appointment Management System (VAMS)
Version: 1.0
Status: Draft
Last updated: September 2026
Companion docs: PRD.md · SCHEMA.md · API.md · USERFLOW.md

## 🎯 MVP Goal
Get a visitor from request → approval → QR pass → gate scan
working end-to-end for a real person at a real gate.
Everything else comes after this works.

---

Table of Contents
System Overview
Architecture Style
Project Flow
System Architecture Diagram
Service Boundaries
Data Flow
Authentication Architecture
Notification Pipeline
QR Token Architecture
Tech Stack — Full Reference
Folder & File Structure
Environment Variables
Infrastructure & Deployment
Local Development Setup

1. System Overview
VAMS is a two-app monorepo:

apps/web — Next.js 14 frontend. Serves the public visitor request form, the token-gated visitor status page, and the role-protected dashboards for officers, receptionists, and admins.
apps/api — Express 5 REST API. Handles all business logic, database access, job queuing, QR token issuance, and scheduled background jobs.
packages/shared — Framework-agnostic TypeScript types and Zod schemas shared between both apps. A schema change here propagates at compile time to both sides.
Both apps are deployed independently. The frontend talks to the API over HTTPS. There is no direct database access from the frontend.

Browser / Device
      │
      ├── Next.js (Vercel)          ← web app
      │       │
      │       └── REST over HTTPS
      │               │
      │           Express API (Railway)
      │               │
      │         ┌─────┴──────┐
      │       Postgres      Redis
      │      (Neon/Supabase) (Upstash)
      │
      └── Notification providers
              Resend · MSG91 · Web Push

2. Architecture Style
REST + background jobs. Not microservices, not GraphQL. Chosen deliberately for a small org (< 50 officers) because:

A single Express app is easier to deploy, debug, and reason about than a service mesh
REST with typed Zod schemas gives the same contract safety as GraphQL without the tooling overhead
Background jobs via BullMQ handle all async work (notifications, cron) without needing a separate service
The architecture can be split into microservices later if the org grows, but that complexity is not warranted at v1 scale.

3. Project Flow
This section traces the full path of a visit — from a visitor landing on the site to leaving the building — showing which service handles each step.

Step 1 — Visitor submits request
Visitor opens /request (Next.js, public route)
  → fills form: name, email, phone, officer, purpose, preferred time
  → clicks "Send OTP"
      → POST /api/visitors/otp/send
          → MSG91 sends 6-digit OTP to phone
          → OTP stored in Redis with 10-min TTL
  → enters OTP, clicks "Verify & Submit"
      → POST /api/visitors/otp/verify  →  returns short-lived visitor session token
      → POST /api/appointments          →  creates appointment at status: SUBMITTED
          → upserts visitor record (matches by phone)
          → writes NOTIFICATIONS row for receptionist (push) and visitor (email+SMS)
          → BullMQ worker delivers notifications asynchronously
  → visitor redirected to /status/:token (token-gated status page, no login)
Step 2 — Receptionist screens and schedules
Receptionist sees push notification → opens /receptionist/queue
  → reviews request card (visitor details, purpose, preferred time)
  → clicks "Schedule"
      → /receptionist/schedule?appointmentId=xxx opens
      → officer selector → fetches GET /api/officers/:id/availability?week=YYYY-WW
          → API computes free/busy from:
              officer default hours
              blocked_slots (JSONB)
              existing appointments (overlap query)
          → returns array of { start, end, status: 'FREE' | 'BUSY' | 'BLOCKED' }
      → receptionist clicks a FREE slot
      → clicks "Forward to Officer"
          → PATCH /api/appointments/:id/screen
              → transitionStatus(SUBMITTED → SCREENED)
              → transitionStatus(SCREENED → HOST_PENDING)
              → writes slot_start, slot_end, officer_id, receptionist_id
              → enqueues: notify officer (push + email), notify visitor (email)
Step 3 — Officer decides
Officer sees push notification → opens /officer/pending
  → reviews card: visitor name, purpose, proposed slot, visitor photo
  → clicks "Approve" or "Decline"

  APPROVE path:
      → PATCH /api/appointments/:id/approve
          → transitionStatus(HOST_PENDING → APPROVED)
          → transitionStatus(APPROVED → PASS_ISSUED)  ← system-triggered, same request
              → crypto.randomBytes(32) generates nonce
              → JWT signed: { aid, vid, oid, nonce, nbf, exp }
              → qrcode.toBuffer(jwt) → PNG buffer
              → appointment updated: nonce, pass_expires_at, status
              → enqueues: pass email to visitor (QR embedded), calendar email to officer
              → enqueues: reminder jobs at T-24h, T-1h (visitor), T-30min (officer)

  DECLINE path:
      → PATCH /api/appointments/:id/decline  { reason: "..." }
          → transitionStatus(HOST_PENDING → DECLINED)
          → enqueues: decline email+SMS to visitor, notification to receptionist
Step 4 — Visitor arrives at gate
Visitor shows QR on phone screen
Receptionist opens /receptionist/scan (full-screen camera)
  → camera reads QR → extracts JWT string
  → POST /api/scan/verify  { token: "<jwt>" }
      → Server validates:
          1. JWT signature (HMAC-SHA256, server secret)
          2. nbf ≤ now ≤ exp  (time window)
          3. SELECT appointment WHERE id = aid AND nonce = token.nonce
          4. appointment.status == 'PASS_ISSUED'
          5. No duplicate scan (Redis SET NX on nonce, TTL = slot duration + 1h)
      → Returns: { valid: true, appointment: { ... }, visitor: { name, photoUrl } }
  → Receptionist sees visitor photo + appointment card on screen
  → Visually confirms photo matches person at desk
  → Taps "Confirm Check-In"
      → PATCH /api/appointments/:id/checkin
          → transitionStatus(PASS_ISSUED → CHECKED_IN)
          → enqueues: push to officer "Your visitor has arrived"
                      SMS to visitor "Check-in confirmed"
Step 5 — Check-out
Visitor leaves → receptionist scans QR again (or visitor self-reports)
  → POST /api/scan/verify detects status == CHECKED_IN
  → Returns check-out prompt
  → PATCH /api/appointments/:id/checkout
      → transitionStatus(CHECKED_IN → CHECKED_OUT)

Auto-checkout (safety net):
  → node-cron job runs every 5 minutes
  → UPDATE appointments SET status='CHECKED_OUT'
    WHERE status='CHECKED_IN' AND slot_end + INTERVAL '2 hours' < NOW()
  → Logs as system actor, enqueues notification to receptionist

4. System Architecture Diagram
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Visitor    │  │   Officer    │  │  Receptionist /    │   │
│  │  (public)    │  │  Dashboard   │  │  Admin Dashboard   │   │
│  │  /request    │  │  /officer/*  │  │  /receptionist/*   │   │
│  │  /status/:t  │  │              │  │  /admin/*          │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘   │
│         │                 │                    │               │
│         └─────────────────┴────────────────────┘               │
│                           │ HTTPS REST                         │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                        API LAYER (Express)                      │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Routes    │  │  Middleware  │  │      Services        │  │
│  │             │  │              │  │                      │  │
│  │ /visitors   │  │ authenticate │  │ appointment.service  │  │
│  │ /appts      │  │ rbac         │  │   transitionStatus   │  │
│  │ /scan       │  │ validate     │  │ qr.service           │  │
│  │ /officers   │  │   (Zod)      │  │ otp.service          │  │
│  │ /users      │  │ rateLimit    │  │ availability.service │  │
│  │ /reports    │  │ errorHandler │  │ email.service        │  │
│  └─────────────┘  └──────────────┘  │ sms.service          │  │
│                                     └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Background Layer                      │  │
│  │                                                          │  │
│  │  BullMQ Workers          node-cron Jobs                  │  │
│  │  notification.worker     expire.job    (every 5 min)     │  │
│  │  email.worker            no_show.job   (every 5 min)     │  │
│  │  sms.worker              auto_checkout (every 5 min)     │  │
│  │  push.worker             reminder.job  (every 1 min)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                        DATA LAYER                               │
│                                                                 │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   │
│  │      PostgreSQL 16      │   │          Redis            │   │
│  │                         │   │                           │   │
│  │  users                  │   │  OTP codes (TTL 10min)    │   │
│  │  visitors               │   │  BullMQ job queues        │   │
│  │  appointments           │   │  Scan dedup (nonce SET)   │   │
│  │  officer_availability   │   │  Rate limit counters      │   │
│  │  appointment_log        │   │                           │   │
│  │  notifications          │   └───────────────────────────┘   │
│  └─────────────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
│                                                                 │
│   Resend (email)    MSG91 (SMS)    Web Push API    S3 (photos)  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

5. Service Boundaries
What lives in Next.js (web)
All UI rendering — public pages and dashboards
Route-level auth guards using NextAuth session
Data fetching via TanStack Query → calls Express API
Client-side form validation (Zod, shared schemas)
QR camera scanning (jsQR / zxing-wasm in the browser)
Web Push subscription registration
Next.js route handlers (/api/*) are used only for:

NextAuth session callbacks
Proxying file uploads to S3 with signed URLs
Everything else goes to the Express API directly.

What lives in Express (api)
All business logic
All database reads and writes (via Drizzle ORM)
All status transitions (enforced through transitionStatus)
JWT signing and verification
OTP generation and validation
QR PNG generation
Job enqueueing (BullMQ)
Cron scheduling (node-cron)
Sending emails, SMS, push notifications
What lives in packages/shared
Zod schemas for all request/response shapes
TypeScript types derived from those schemas
Appointment status enum and transition map
User role enum

6. Data Flow
Request submission flow
Browser form submit
  → Zod validate (client, shared schema)
  → POST /api/appointments
      → Zod validate (server, same schema)
      → rbac middleware: visitor session token
      → upsert visitor (match by phone)
      → INSERT appointment (status: SUBMITTED)
      → INSERT notification rows (PENDING)
      → return 201 { appointmentId, statusToken }
  ← BullMQ worker picks up notification rows → sends async
Availability query flow
Receptionist selects officer + week
  → GET /api/officers/:id/availability?week=2026-W38
      → load officer_availability row
      → query appointments WHERE officer_id = :id
          AND slot_start BETWEEN week_start AND week_end
          AND status IN (HOST_PENDING, APPROVED, PASS_ISSUED, CHECKED_IN)
      → compute 30-min slots from default_start to default_end
      → mark each slot: FREE / BUSY (has appointment) / BLOCKED (in blocked_slots)
      → return array of SlotResult[]
  ← Frontend renders colour-coded week grid
QR scan flow
Browser camera → jsQR decodes frame → extracts JWT string
  → POST /api/scan/verify { token }
      → jose.jwtVerify(token, secret)         // throws if invalid sig or expired
      → db: SELECT appointment WHERE id=aid    // throws if not found
      → compare token.nonce === db.nonce       // throws if superseded
      → check status === 'PASS_ISSUED'         // throws if wrong state
      → Redis SET NX scan:nonce TTL=3600       // throws if already scanned
      → return { valid: true, appointment, visitor }
  ← Frontend shows appointment card + visitor photo
  → Receptionist taps Confirm
      → PATCH /api/appointments/:id/checkin
          → transitionStatus(PASS_ISSUED → CHECKED_IN)
          → enqueue push to officer

7. Authentication Architecture
Internal users (officers, receptionists, admins)
NextAuth v5 with Credentials provider
On login: NextAuth calls POST /api/auth/login → Express validates email + bcrypt password → returns user payload
NextAuth stores session in a signed JWT cookie (httpOnly, secure, sameSite=strict)
Every protected Next.js page checks session in middleware using auth() from NextAuth
Every Express route receives the session JWT in Authorization: Bearer <token> header
Express authenticate middleware verifies the JWT, attaches req.user = { id, role }
Express rbac middleware checks req.user.role against the route's required role
Browser → NextAuth session cookie
       → Next.js middleware: auth() → redirect if no session
       → API call: Authorization: Bearer <session_jwt>
       → Express authenticate middleware → verify → req.user
       → Express rbac middleware → check role → 403 if insufficient
       → Route handler
Visitors (external, no account)
OTP to phone via MSG91
On verify: Express returns a short-lived signed JWT ({ vid, phone, exp: +10min })
Frontend stores in memory (not localStorage) — only needed for the submission request
Status page access via opaque token in URL (/status/:token) — token is a separate signed JWT with the appointment ID, long-lived (expires when appointment reaches a terminal state)
Role hierarchy
ADMIN > RECEPTIONIST > OFFICER

ADMIN       — all routes
RECEPTIONIST — /scan, /queue, /schedule, /occupancy, /reports (read-only)
OFFICER     — /officer/* (own data only), /availability

8. Notification Pipeline
API handler
  └── enqueueNotifications(appointmentId, newStatus, tx)
          │
          ├── determines which NOTIFICATIONS rows to insert (based on status)
          ├── inserts rows with status: PENDING, scheduled_for: NOW() or future
          └── exits (does not wait for send)

BullMQ Worker (notification.worker.ts)
  └── polls NOTIFICATIONS WHERE status=PENDING AND scheduled_for <= NOW()
          │
          ├── EMAIL jobs  → email.worker  → Resend SDK
          ├── SMS jobs    → sms.worker    → MSG91 SDK
          └── PUSH jobs   → push.worker   → Web Push API
                  │
                  ├── SUCCESS → UPDATE status=SENT, sent_at=NOW()
                  └── FAILURE → UPDATE retry_count++
                                IF retry_count < 3: reschedule (exponential backoff)
                                ELSE: UPDATE status=FAILED, error_message

node-cron scheduler (reminder.job.ts)
  └── runs every minute
      SELECT appointments WHERE status=PASS_ISSUED
        AND slot_start - INTERVAL '24 hours' BETWEEN last_run AND NOW()
      → INSERT NOTIFICATIONS rows for T-24h reminders
      (same pattern for T-1h and T-30min)
    
9. QR Token Architecture
Token structure
JWT Header:  { alg: "HS256", typ: "JWT" }

JWT Payload: {
  aid:   "uuid",              // appointment id
  vid:   "uuid",              // visitor id
  oid:   "uuid",              // officer id
  nonce: "32-byte-hex",       // random, stored in DB, rotated on any change
  iat:   1726480000,          // issued at
  nbf:   1726480200,          // valid from: slot_start - 30 min
  exp:   1726483800,          // valid until: slot_end + 30 min
}

Signature: HMAC-SHA256(base64url(header) + "." + base64url(payload), VAMS_JWT_SECRET)
Why nonce?
The JWT alone proves the token was signed by us and is within its time window. The nonce proves the token has not been superseded. When an appointment is rescheduled or cancelled:

// qr.service.ts
async function rotateNonce(appointmentId: string, tx: DrizzleTransaction) {
  const nonce = crypto.randomBytes(32).toString('hex')
  await tx.update(appointments)
    .set({ nonce, passExpiresAt: null })
    .where(eq(appointments.id, appointmentId))
  return nonce
}
The old QR still has a valid JWT signature and a valid time window — but its nonce no longer matches the DB record. The server rejects it at step 4 of validation.

Duplicate scan prevention
Redis SET scan:{nonce} 1 NX EX {slotDurationSeconds + 3600} — atomic, expires automatically. If the SET fails (key already exists), the scan is a duplicate. This prevents a single QR being used twice for entry.

10. Tech Stack — Full Reference
Frontend (apps/web)
Package	Version	Purpose
next	14.x	App Router, RSC, SSR, image optimisation
react	18.x	UI rendering
typescript	5.x	Type safety
tailwindcss	3.x	Utility-first styling
@shadcn/ui	latest	Radix-based component library (copied into repo)
@radix-ui/*	latest	Headless primitives under shadcn
next-auth	5.x (beta)	Session management for internal users
@tanstack/react-query	5.x	Server state, caching, background refetch
zustand	4.x	Lightweight client state (scan UI, modal state)
react-hook-form	7.x	Form state management
zod	3.x	Shared validation schemas
@hookform/resolvers	3.x	Zod integration for react-hook-form
jsQR	1.x	QR decoding from camera frames in browser
lucide-react	latest	Icon set
date-fns	3.x	Date manipulation for calendar grid
clsx + tailwind-merge	latest	Conditional class utility
API (apps/api)
Package	Version	Purpose
express	5.x	HTTP server and routing
typescript	5.x	Type safety
tsx	latest	TypeScript execution (dev)
zod	3.x	Request body and param validation
drizzle-orm	latest	Type-safe query builder
drizzle-kit	latest	Migrations and schema introspection
pg	8.x	PostgreSQL driver
@upstash/redis	latest	Redis client (Upstash serverless)
bullmq	5.x	Job queue for notifications
node-cron	3.x	Cron scheduler for background jobs
jose	5.x	JWT sign and verify (QR tokens + auth)
bcryptjs	2.x	Password hashing
qrcode	1.x	QR PNG generation server-side
sharp	0.x	Image processing (visitor photo resize)
resend	latest	Transactional email
@react-email/components	latest	Email template components
msg91-sdk	latest	India SMS (DLT-compliant)
web-push	3.x	Browser push notifications
multer	1.x	Multipart file upload (visitor photos)
helmet	7.x	HTTP security headers
cors	2.x	CORS policy
express-rate-limit	7.x	Rate limiting on OTP and scan routes
morgan	1.x	HTTP request logging
dotenv	16.x	Environment variable loading
Shared (packages/shared)
Package	Version	Purpose
zod	3.x	Schema definitions shared between web and api
typescript	5.x	Types derived from Zod schemas
Database
Tool	Purpose
PostgreSQL 16	Primary data store
Neon (or Supabase)	Managed Postgres, connection pooling via pgBouncer
Drizzle ORM	Schema as code, type-safe queries, migration runner
Redis (Upstash)	OTP store, BullMQ broker, scan dedup cache, rate limit
Infrastructure
Service	Purpose
Vercel	Next.js frontend deployment, edge CDN
Railway (or Render)	Express API + BullMQ worker process
Neon / Supabase	Managed PostgreSQL
Upstash	Managed Redis (serverless, pay-per-request)
AWS S3 / Cloudflare R2	Visitor photo storage (object storage)
Resend	Transactional email
MSG91	Transactional SMS (India, DLT-registered)

11. Folder & File Structure
meefy/
│
├── package.json                        # root — workspace config
├── turbo.json                          # Turborepo pipeline
├── tsconfig.base.json                  # shared TS config extended by both apps
├── .env.example                        # all required env vars documented
│
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       ├── schemas/
│       │   ├── appointment.schema.ts   # Zod: CreateAppointmentSchema, etc.
│       │   ├── visitor.schema.ts       # Zod: VisitorSchema, OtpSchema
│       │   ├── availability.schema.ts  # Zod: SlotResult, AvailabilitySchema
│       │   └── user.schema.ts          # Zod: UserSchema, LoginSchema
│       └── types/
│           ├── appointment.types.ts    # AppointmentStatus enum, transition map
│           ├── user.types.ts           # UserRole enum
│           └── notification.types.ts  # NotificationChannel, NotificationType
│
├── apps/
│   │
│   ├── web/                            # Next.js 14
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   │
│   │   ├── app/
│   │   │   │
│   │   │   ├── layout.tsx              # root layout, font, ThemeProvider
│   │   │   ├── globals.css             # Tailwind base + CSS variables
│   │   │   │
│   │   │   ├── (public)/               # no auth required
│   │   │   │   ├── layout.tsx          # minimal public layout
│   │   │   │   ├── request/
│   │   │   │   │   └── page.tsx        # visitor request form + OTP
│   │   │   │   └── status/
│   │   │   │       └── [token]/
│   │   │   │           └── page.tsx    # visitor status + QR display
│   │   │   │
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx        # org user login
│   │   │   │
│   │   │   └── (dashboard)/            # NextAuth session required
│   │   │       ├── layout.tsx          # sidebar, nav, session guard
│   │   │       │
│   │   │       ├── officer/
│   │   │       │   ├── page.tsx              # today's visits + stats
│   │   │       │   ├── pending/
│   │   │       │   │   └── page.tsx          # HOST_PENDING request cards
│   │   │       │   ├── calendar/
│   │   │       │   │   └── page.tsx          # personal calendar view
│   │   │       │   └── settings/
│   │   │       │       └── page.tsx          # availability config
│   │   │       │
│   │   │       ├── receptionist/
│   │   │       │   ├── page.tsx              # overview: queue count, occupancy
│   │   │       │   ├── queue/
│   │   │       │   │   └── page.tsx          # SUBMITTED request queue
│   │   │       │   ├── schedule/
│   │   │       │   │   └── page.tsx          # officer calendar + slot picker
│   │   │       │   ├── scan/
│   │   │       │   │   └── page.tsx          # full-screen QR scanner
│   │   │       │   └── occupancy/
│   │   │       │       └── page.tsx          # live on-premises board
│   │   │       │
│   │   │       └── admin/
│   │   │           ├── page.tsx              # admin overview
│   │   │           ├── users/
│   │   │           │   └── page.tsx          # user management table
│   │   │           ├── blacklist/
│   │   │           │   └── page.tsx          # blacklist management
│   │   │           ├── audit/
│   │   │           │   └── page.tsx          # appointment_log viewer
│   │   │           └── reports/
│   │   │               └── page.tsx          # analytics + charts
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                     # shadcn components (copied, owned)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── TopBar.tsx
│   │   │   │   └── OccupancyBadge.tsx  # live count in nav
│   │   │   │
│   │   │   ├── appointment/
│   │   │   │   ├── AppointmentCard.tsx
│   │   │   │   ├── AppointmentStatusBadge.tsx
│   │   │   │   └── AppointmentTimeline.tsx
│   │   │   │
│   │   │   ├── calendar/
│   │   │   │   ├── WeekGrid.tsx        # free/busy officer week view
│   │   │   │   ├── SlotCell.tsx        # individual 30-min slot
│   │   │   │   └── OfficerSelector.tsx
│   │   │   │
│   │   │   ├── scan/
│   │   │   │   ├── ScanView.tsx        # camera + QR decode loop
│   │   │   │   ├── ScanResult.tsx      # valid / invalid result card
│   │   │   │   └── VisitorConfirm.tsx  # photo + appointment details
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── VisitorRequestForm.tsx
│   │   │   │   ├── OtpForm.tsx
│   │   │   │   ├── ScheduleForm.tsx
│   │   │   │   └── AvailabilityForm.tsx
│   │   │   │
│   │   │   └── notifications/
│   │   │       └── PushSubscriber.tsx  # Web Push registration
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                  # typed fetch wrapper (base URL, auth header)
│   │   │   ├── auth.ts                 # NextAuth config
│   │   │   ├── query-client.ts         # TanStack Query client singleton
│   │   │   └── utils.ts                # cn(), formatDate(), etc.
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAppointments.ts      # TanStack Query hooks
│   │   │   ├── useAvailability.ts
│   │   │   ├── useOccupancy.ts
│   │   │   └── useScan.ts              # camera + QR decode loop
│   │   │
│   │   └── middleware.ts               # NextAuth session guard on /dashboard/*
│   │
│   └── api/                            # Express 5
│       ├── package.json
│       ├── tsconfig.json
│       │
│       └── src/
│           ├── index.ts                # app entry: express(), listen()
│           ├── app.ts                  # middleware stack, route mounting
│           │
│           ├── routes/
│           │   ├── auth.routes.ts      # POST /auth/login, /auth/logout
│           │   ├── visitors.routes.ts  # OTP send/verify, visitor CRUD
│           │   ├── appointments.routes.ts
│           │   ├── availability.routes.ts
│           │   ├── scan.routes.ts      # POST /scan/verify, /scan/checkin, /scan/checkout
│           │   ├── officers.routes.ts  # officer calendar, settings
│           │   ├── users.routes.ts     # admin user management
│           │   └── reports.routes.ts   # admin analytics
│           │
│           ├── middleware/
│           │   ├── authenticate.ts     # JWT verify → req.user
│           │   ├── rbac.ts             # requireRole(...roles)
│           │   ├── validate.ts         # Zod body/param/query validation
│           │   ├── rateLimiter.ts      # express-rate-limit configs
│           │   └── errorHandler.ts     # global error handler
│           │
│           ├── services/
│           │   ├── appointment.service.ts   # transitionStatus(), conflict check
│           │   ├── availability.service.ts  # computeSlots(), isSlotFree()
│           │   ├── qr.service.ts            # signToken(), generateQrPng()
│           │   ├── otp.service.ts           # sendOtp(), verifyOtp()
│           │   ├── email.service.ts         # sendPassEmail(), sendDeclineEmail(), etc.
│           │   ├── sms.service.ts           # sendSlotSms(), sendReminderSms()
│           │   └── push.service.ts          # sendPushNotification()
│           │
│           ├── workers/
│           │   ├── notification.worker.ts   # BullMQ worker — picks PENDING rows
│           │   ├── email.worker.ts
│           │   ├── sms.worker.ts
│           │   └── push.worker.ts
│           │
│           ├── jobs/
│           │   ├── expire.job.ts            # PASS_ISSUED → EXPIRED
│           │   ├── no_show.job.ts           # PASS_ISSUED → NO_SHOW
│           │   ├── auto_checkout.job.ts     # CHECKED_IN → CHECKED_OUT
│           │   └── reminder.job.ts          # enqueue T-24h, T-1h, T-30min rows
│           │
│           ├── db/
│           │   ├── index.ts                 # Drizzle client singleton
│           │   ├── schema.ts                # all table definitions
│           │   └── migrations/              # drizzle-kit generated SQL
│           │       ├── 0001_init.sql
│           │       └── meta/
│           │
│           ├── emails/                      # React Email templates
│           │   ├── PassEmail.tsx
│           │   ├── ReminderEmail.tsx
│           │   ├── DeclineEmail.tsx
│           │   ├── ApprovalEmail.tsx
│           │   └── ConfirmationEmail.tsx
│           │
│           └── lib/
│               ├── redis.ts                 # Upstash Redis client
│               ├── queue.ts                 # BullMQ queue definitions
│               ├── cron.ts                  # node-cron scheduler bootstrap
│               └── constants.ts             # slot duration, SLA timers, etc.

12. Environment Variables
# apps/web/.env.local
NEXTAUTH_SECRET=                    # random 32-byte hex
NEXTAUTH_URL=https://vams.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.vams.yourdomain.com

# apps/api/.env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/vams

# Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Auth
JWT_SECRET=                         # QR token signing secret — rotate quarterly
NEXTAUTH_SECRET=                    # must match web app value

# Email
RESEND_API_KEY=

# SMS
MSG91_AUTH_KEY=
MSG91_SENDER_ID=                    # DLT-registered sender ID
MSG91_TEMPLATE_ID_OTP=              # DLT template IDs
MSG91_TEMPLATE_ID_PASS=
MSG91_TEMPLATE_ID_REMINDER=

# Web Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@yourdomain.com

# File storage
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_ENDPOINT=                        # for Cloudflare R2 or compatible

# App
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://vams.yourdomain.com

13. Infrastructure & Deployment
Environments
Environment	Frontend URL	API URL	DB
Development	localhost:3000	localhost:4000	local Postgres
Staging	staging.vams.domain	api-staging.vams.domain	Neon branch
Production	vams.domain	api.vams.domain	Neon main
Deployment topology
GitHub push to main
  ├── Vercel: builds and deploys apps/web automatically
  └── Railway: builds and deploys apps/api
              runs two processes from the same build:
              ├── web server:  node dist/index.js
              └── worker:      node dist/workers/notification.worker.js
Database migrations
# Generate migration from schema changes
cd apps/api && npx drizzle-kit generate

# Apply to target DB
npx drizzle-kit migrate
Migrations run manually before each deployment, not automatically on startup.

Scaling considerations (v1 is single-instance)
Redis is shared between web server and worker processes — BullMQ handles concurrency safely
Postgres connection pooling via pgBouncer (built into Neon/Supabase) — set max: 10 in Drizzle client
BullMQ worker can be scaled horizontally as a separate Railway service if notification volume grows
Cron jobs must run on exactly one instance — use a CRON_LEADER=true env var to gate job registration

14. Local Development Setup
# Prerequisites: Node 20+, pnpm 9+, Docker (for local Postgres + Redis)

# 1. Clone and install
git clone https://github.com/your-org/vams.git
cd vams
pnpm install

# 2. Start local Postgres and Redis
docker compose up -d

# 3. Copy and fill env files
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env
# fill in DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vams
# fill in UPSTASH_REDIS_REST_URL and TOKEN (or use ioredis with localhost)

# 4. Run migrations
cd apps/api && npx drizzle-kit migrate

# 5. Seed development data (optional)
npx tsx src/db/seed.ts

# 6. Start both apps
cd ../..
pnpm dev          # Turborepo runs web (port 3000) and api (port 4000) in parallel
docker-compose.yml (place at repo root):

version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vams
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  pgdata:
Architecture decisions that change must be reflected here before the code changes — not after.



there is 3 branch :-

Test - to write new code and test everything their & write daily code init.

Work - the best code which is working and ready to merge with main

main - the stable code which is deployed to production.