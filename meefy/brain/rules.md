Rules & Engineering Standards

                         VisitFlow(meefy)

Visitor & Appointment Management System (VAMS)
Version: 1.0 Status: Enforced from day one Applies to: Every file, every PR, every AI-assisted generation in this project

These are not suggestions. If a piece of code does not follow these rules, it does not get merged. If an AI generates code that violates these rules, it gets rewritten before use — not after.

Table of Contents
The Prime Directive
MVP Scope Lock
AI Usage Rules
Code Style
TypeScript Rules
Error Handling
Frontend Rules
Backend Rules
Database Rules
Security Rules
What to Use
What to Avoid
File & Naming Conventions
Git Rules
Definition of Done
1. The Prime Directive
Ship the MVP. Everything else is a distraction.

One question before writing any line of code:

"Does this make the core visitor request → approval → check-in flow work?"

If the answer is no — stop, park it, come back after MVP is live.

2. MVP Scope Lock
These are the only features that exist until MVP is deployed and tested by real users.

In MVP
 Visitor OTP-verified request form
 Receptionist queue and scheduling screen
 Officer approval / decline
 Signed QR pass issued by email + SMS
 Gate QR scan and check-in
 Check-out (manual scan + auto-close cron)
 Basic notifications (email + SMS only — no push in MVP)
 Live occupancy board
 Admin user management
 Blacklist enforcement
Explicitly NOT in MVP
These topics are banned from development conversations until MVP ships:

Push notifications (Web Push)
Officer-initiated invites
Walk-in express lane
Group visits
Recurring visitor passes
Reports and analytics dashboard
Mobile apps
Room / resource booking
Badge printing
LDAP / HR system integration
Dark mode
Internationalisation (i18n)
Any AI or ML feature
If a requirement is not in the MVP list above, the answer is "after MVP". Not "let me just quickly add it." Not "it'll only take an hour." After. MVP.

3. AI Usage Rules
This section governs how AI assistants (Claude, Copilot, Cursor, etc.) are used in this project. These rules exist because AI has no awareness of MVP scope, project constraints, or what was decided last week. Left unchecked, it will suggest features, abstractions, and dependencies that bloat the project before it works.

What AI is allowed to do
Generate boilerplate: route handlers, Drizzle schema, Zod schemas, form components
Write individual functions when given a clear spec
Suggest fix for a specific bug when given the exact error and surrounding code
Write tests for a function you describe precisely
Draft email/SMS templates
Generate migration SQL from a schema description
What AI is NOT allowed to do
Decide architecture. Architecture decisions are in ARCHITECTURE.md. AI follows them, does not rewrite them.
Add packages. No new npm install from an AI suggestion without a human reviewing whether it's in the approved stack (RULES.md §11). AI will always suggest new libraries. Ignore it unless the package is already approved.
Scope-creep. If AI suggests a feature not in the MVP list, ignore that part of the output. Do not implement it "since it's already there."
Generate entire modules unsupervised. AI output is a draft, not a finished file. Every AI-generated file must be read line by line before use.
Write security-sensitive code without review. Auth middleware, JWT signing, OTP handling, and scan validation must be written or reviewed by a human. AI can draft; human must verify.
Create new files or folders outside the structure in ARCHITECTURE.md §11. If a new file is needed, add it to the architecture doc first.
How to prompt AI correctly in this project
Always give AI:

The specific function or component name
Its inputs and outputs (types)
Which file it lives in
Any constraints (error handling required, which service to call, etc.)
Never give AI:

"Build me the receptionist dashboard"
"Set up auth"
"Create the notification system"
These are too broad. AI will hallucinate structure that conflicts with the architecture. Break every task into one function or one component at a time.

AI output checklist before using any AI-generated code
 TypeScript strict mode — no any, no as, no !
 Every error is handled explicitly (see §6)
 No new packages introduced
 No features outside MVP scope added
 File path matches ARCHITECTURE.md §11
 Follows naming conventions in §13
 No console.log left in
 No hardcoded secrets, URLs, or magic strings
4. Code Style
General
Clarity over cleverness. If someone reading the code for the first time needs more than 5 seconds to understand a line, rewrite it.
One thing per function. A function that does two things should be two functions.
No comments that describe what the code does. The code should be readable enough to not need them. Comments explain why, not what.
No dead code. Commented-out code does not get committed. Delete it. Git history is the undo button.
No TODO in committed code. Either do it now or create a ticket. TODO comments are permanent lies.
Max function length: 40 lines. If a function exceeds this, it has more than one responsibility. Split it.
Max file length: 300 lines. If a file exceeds this, it owns too much. Split it.
Formatting
Prettier handles all formatting. There is no manual formatting debate.
ESLint enforces rules. No eslint-disable without a written reason in the same line.
Tabs vs spaces: spaces, 2 wide. Prettier enforces this.
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 90,
  "tabWidth": 2
}
5. TypeScript Rules
Strict mode is non-negotiable
// tsconfig.json (both apps)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
Forbidden patterns
// ❌ Never use any
const data: any = response.json()

// ❌ Never use non-null assertion
const user = getUser()!

// ❌ Never use type casting to escape type errors
const id = (req.params.id as string)

// ❌ Never use @ts-ignore or @ts-expect-error
// @ts-ignore
doSomething(badValue)

// ❌ Never leave implicit any in function params
function process(data) { ... }
Required patterns
// ✅ Derive types from Zod schemas — single source of truth
import { z } from 'zod'
export const CreateAppointmentSchema = z.object({
  visitorId: z.string().uuid(),
  officerId: z.string().uuid(),
  purpose:   z.string().min(10).max(500),
  slotStart: z.string().datetime(),
  slotEnd:   z.string().datetime(),
})
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>

// ✅ Return explicit types from service functions
async function transitionStatus(
  appointmentId: string,
  to: AppointmentStatus,
  actor: Actor | null,
): Promise<Appointment> { ... }

// ✅ Use discriminated unions for results that can fail
type Result<T> =
  | { ok: true;  data: T }
  | { ok: false; error: string; code: number }
Enums
Use const objects, not TypeScript enum. Enums produce surprising JS output.

// ❌ Avoid
enum AppointmentStatus { SUBMITTED = 'SUBMITTED' }

// ✅ Use
export const AppointmentStatus = {
  SUBMITTED:    'SUBMITTED',
  SCREENED:     'SCREENED',
  HOST_PENDING: 'HOST_PENDING',
  APPROVED:     'APPROVED',
  PASS_ISSUED:  'PASS_ISSUED',
  CHECKED_IN:   'CHECKED_IN',
  CHECKED_OUT:  'CHECKED_OUT',
  REJECTED:     'REJECTED',
  DECLINED:     'DECLINED',
  EXPIRED:      'EXPIRED',
  NO_SHOW:      'NO_SHOW',
  CANCELLED:    'CANCELLED',
} as const
export type AppointmentStatus =
  typeof AppointmentStatus[keyof typeof AppointmentStatus]
6. Error Handling
This is the most important section in this document. Every execution path that can fail must handle the failure explicitly. No exceptions. No lazy re-throws. No empty catch blocks.

The rule
// ❌ This is not error handling
try {
  await sendEmail(visitor.email, pass)
} catch (e) {
  console.log(e)
}

// ❌ This is not error handling either
const result = await db.query(...)  // what if this throws?

// ✅ This is error handling
const result = await sendEmail(visitor.email, pass).catch((err) => {
  logger.error({ err, visitorId: visitor.id }, 'Pass email failed')
  return { ok: false as const, error: 'email_send_failed' }
})
if (!result.ok) {
  // decide: retry? surface to user? enqueue for retry?
}
Express route handlers
Every route handler is async. Every async route handler has its errors caught. Use a wrapper so you never forget:

// lib/asyncHandler.ts
import { Request, Response, NextFunction } from 'express'

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next)

// Usage — every route, no exceptions
router.post('/appointments', asyncHandler(async (req, res) => {
  // throwing here goes to the global error handler
  const appointment = await appointmentService.create(req.body)
  res.status(201).json(appointment)
}))
Global error handler (Express)
// middleware/errorHandler.ts
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code:  err.code,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error:  'Validation failed',
      fields: err.flatten().fieldErrors,
    })
  }

  // unknown errors — log full detail, never expose internals
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error')
  return res.status(500).json({ error: 'Something went wrong' })
}
Service layer errors
// lib/errors.ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const Errors = {
  notFound:        (msg = 'Not found')        => new AppError(msg, 'NOT_FOUND', 404),
  forbidden:       (msg = 'Forbidden')        => new AppError(msg, 'FORBIDDEN', 403),
  conflict:        (msg = 'Conflict')         => new AppError(msg, 'CONFLICT', 409),
  badRequest:      (msg = 'Bad request')      => new AppError(msg, 'BAD_REQUEST', 400),
  invalidTransition: (from: string, to: string) =>
    new AppError(`Cannot transition from ${from} to ${to}`, 'INVALID_TRANSITION', 422),
}
Database errors
// ✅ Always handle no-rows case explicitly
const [appointment] = await db
  .select()
  .from(appointments)
  .where(eq(appointments.id, id))

if (!appointment) throw Errors.notFound('Appointment not found')
Background jobs and workers
Jobs fail silently if not handled. Every BullMQ worker job must:

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err }, 'Notification job failed')
  // do not rethrow — worker must stay alive
})
Frontend error handling
// ✅ TanStack Query handles loading/error states — always render them
const { data, isLoading, isError, error } = useAppointments()

if (isLoading) return <LoadingSpinner />
if (isError)   return <ErrorMessage message={error.message} />
Never assume a fetch succeeded. Never render data.xyz without checking data exists.

7. Frontend Rules
Component rules
One component per file.
Component files are PascalCase: AppointmentCard.tsx
Utility/hook files are camelCase: useAvailability.ts
No component does data fetching AND renders UI. Split into a container hook (useX) and a presentational component.
No inline styles. Tailwind classes only. If a style cannot be expressed in Tailwind, add a CSS variable to globals.css.
No hardcoded colour values (text-[#3b4a6b]). Use the Tailwind theme.
State rules
Server state (anything from the API) → TanStack Query. Never useState + useEffect + fetch.
Client-only UI state (modal open, active tab, form step) → useState or Zustand if shared across components.
Never store API response data in Zustand. Zustand is for UI state only. TanStack Query owns server state.
// ❌ Wrong — fighting TanStack Query
const [appointments, setAppointments] = useState([])
useEffect(() => {
  fetch('/api/appointments').then(r => r.json()).then(setAppointments)
}, [])

// ✅ Right
const { data: appointments } = useAppointments()
Form rules
React Hook Form for all forms. No uncontrolled inputs with raw onChange.
Zod schema from packages/shared for validation. Never write validation logic in a component.
Show field-level errors, not just a toast. Users need to know exactly what to fix.
Disable submit button while submitting. Show a loading state. Prevent double-submit.
API call rules
All API calls go through lib/api.ts — a typed fetch wrapper that attaches the auth header and handles 401/403 globally.
Never call fetch() directly in a component.
Never construct API URLs manually in components. Define them in lib/api.ts.
// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_URL

export const api = {
  get:    <T>(path: string)              => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',  path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string)              => request<T>('DELETE', path),
}
8. Backend Rules
Route handler rules
Routes only: parse input, call a service, return response. No business logic in routes.
Every route validates its input with Zod before touching a service.
Every route is wrapped in asyncHandler.
Every route specifies its required role via rbac middleware.
// ✅ Clean route
router.patch(
  '/appointments/:id/approve',
  authenticate,
  rbac('OFFICER'),
  validate({ params: AppointmentIdSchema }),
  asyncHandler(async (req, res) => {
    const appointment = await appointmentService.approve(
      req.params.id,
      req.user,
      req.ip,
    )
    res.json(appointment)
  }),
)
Service rules
Services own all business logic.
Services do not import from routes or middleware.
Services return typed data or throw AppError.
All DB mutations inside a service go through db.transaction() if more than one table is touched.
transitionStatus() is the only function allowed to update appointments.status. No exceptions.
Cron job rules
Every cron job is idempotent. Running it twice must produce the same result as running it once.
Every cron job logs start, finish, and row count affected.
Every cron job catches its own errors and logs them — a failed job must not crash the process.
// ✅ Idempotent cron pattern
cron.schedule('*/5 * * * *', async () => {
  logger.info('expire.job: starting')
  try {
    const result = await db
      .update(appointments)
      .set({ status: 'EXPIRED', updatedAt: new Date() })
      .where(and(
        eq(appointments.status, 'PASS_ISSUED'),
        lt(appointments.passExpiresAt, new Date()),
      ))
      .returning({ id: appointments.id })

    logger.info({ count: result.length }, 'expire.job: done')
    // log each transition for audit
    for (const { id } of result) {
      await insertAuditLog(id, 'PASS_ISSUED', 'EXPIRED', null)
    }
  } catch (err) {
    logger.error({ err }, 'expire.job: failed')
  }
})
9. Database Rules
Query rules
Drizzle ORM only. No raw SQL except in migrations.
Never use SELECT *. Select only the columns you need.
Never delete rows from appointment_log. It is append-only.
Every query that returns a single row must handle the empty case.
Wrap multi-table mutations in db.transaction().
Use .for('update') (row lock) before any status transition to prevent race conditions.
Migration rules
Schema changes go in a new migration file. Never edit a committed migration.
Migration file names are sequential: 0001_init.sql, 0002_add_nonce.sql.
Every migration is reviewed before running on staging.
Migrations run manually before deployment. Never auto-migrate on startup.
Every new column has a NOT NULL constraint or a sensible DEFAULT. No nullable columns without a documented reason.
Index rules
Add an index for every column that appears in a WHERE clause in a hot query path.

-- Required indexes at minimum
CREATE INDEX ON appointments (officer_id);
CREATE INDEX ON appointments (visitor_id);
CREATE INDEX ON appointments (status);
CREATE INDEX ON appointments (slot_start);
CREATE INDEX ON notifications (status, scheduled_for);
CREATE UNIQUE INDEX ON visitors (phone);
CREATE UNIQUE INDEX ON users (email);
10. Security Rules
These are enforced, not optional.

No secret in code. No API keys, JWT secrets, or DB credentials anywhere in the codebase. Environment variables only. .env files are gitignored.
JWT secret minimum 256 bits. Generated with openssl rand -hex 32. Rotated quarterly.
OTP codes expire in 10 minutes. Maximum 5 attempts before lockout. Lockout stored in Redis.
Rate limit all public routes. OTP send: 3 per phone per 10 minutes. Scan endpoint: 30 per minute per IP.
QR scan must hit the server. Local JWT decode is not sufficient. Server validates signature, nonce, status, and dedup.
Visitor photos served via signed URLs. Direct S3 URLs are never exposed. Signed URL TTL: 1 hour.
Passwords hashed with bcrypt, cost factor 12. Never log passwords. Never store plain text.
CORS locked to known origins. CORS_ORIGIN env var. Never origin: '*' in production.
Helmet on all Express responses. Adds CSP, HSTS, X-Frame-Options, etc.
No PII in logs. Visitor names, emails, and phone numbers must not appear in log output. Log IDs only.
Audit log is append-only. No UPDATE or DELETE on appointment_log. Ever.
11. What to Use
These packages are approved. Use these and only these unless a new package is discussed and added to this list.

Frontend
Need	Package
Framework	next 14
Language	typescript 5
Styling	tailwindcss 3
Components	shadcn/ui (Radix primitives)
Server state	@tanstack/react-query 5
Client state	zustand 4
Forms	react-hook-form 7
Validation	zod 3
QR decode	jsQR
Date utils	date-fns 3
Icons	lucide-react
Auth	next-auth 5
Class utility	clsx + tailwind-merge
Backend
Need	Package
Server	express 5
Language	typescript 5
Dev runner	tsx
Validation	zod 3
ORM	drizzle-orm
Migrations	drizzle-kit
DB driver	pg
Redis	@upstash/redis
Job queue	bullmq
Cron	node-cron
JWT	jose
Password hash	bcryptjs
QR generate	qrcode
Image resize	sharp
Email	resend
Email templates	@react-email/components
SMS	msg91 SDK
Security headers	helmet
CORS	cors
Rate limit	express-rate-limit
Logging	pino
File upload	multer
12. What to Avoid
Packages — never use these
Package	Why
moment	Bloated, deprecated — use date-fns
axios	fetch is built-in, typed wrapper in lib/api.ts is sufficient
lodash	Tree-shaking is poor — write the utility function yourself
mongoose / sequelize	Drizzle is the ORM — no exceptions
passport	NextAuth handles auth — no mixing
socket.io	Not needed in MVP — polling is fine for occupancy board
redux / redux-toolkit	Zustand + TanStack Query covers all state needs
styled-components / emotion	Tailwind only
ant-design / material-ui	shadcn/ui only
jsonwebtoken	Use jose — it supports edge runtimes and is actively maintained
nodemailer	Use Resend
twilio	Use MSG91 for India SMS
Any AI/ML library	Out of MVP scope entirely
Patterns — never do these
Pattern	Why
Business logic in route handlers	Routes delegate to services
any type	Defeats TypeScript entirely
Empty catch blocks	Swallows errors silently
console.log in committed code	Use pino logger
Direct appointments.status update	Must go through transitionStatus()
Raw SQL in application code	Use Drizzle
Secrets in environment defaults	No JWT_SECRET=dev-secret in code
SELECT * queries	Select only what you need
Nested ternaries	Unreadable — use if/else or early return
Mutation in a GET request	GET is read-only
Local QR validation only	Always validate on server
useEffect for data fetching	Use TanStack Query
13. File & Naming Conventions
Components:       PascalCase    AppointmentCard.tsx
Hooks:            camelCase     useAvailability.ts
Services:         camelCase     appointment.service.ts
Routes:           camelCase     appointments.routes.ts
Schemas:          camelCase     appointment.schema.ts
Types:            camelCase     appointment.types.ts
Utils:            camelCase     formatDate.ts
Constants:        camelCase     constants.ts
DB schema:        camelCase     schema.ts
Migrations:       sequential    0001_init.sql
Env variables:    SCREAMING_SNAKE  NEXTAUTH_SECRET
DB columns:       snake_case    slot_start, officer_id
DB tables:        snake_case    appointment_log
TS types:         PascalCase    AppointmentStatus, CreateAppointmentInput
Zod schemas:      PascalCase + Schema suffix   CreateAppointmentSchema
Export rules
Named exports only. No default exports except Next.js pages and layouts (required by the framework).
One export per file for services and schemas. Components may have sub-components exported from the same file.
14. Git Rules
Branch naming
feature/visitor-request-form
fix/otp-lockout-not-clearing
chore/add-drizzle-indexes
docs/update-architecture
Commit messages — Conventional Commits
feat: add OTP verification to visitor request form
fix: prevent double scan on QR check-in
chore: add pg indexes for appointment status queries
docs: update ARCHITECTURE.md with scan flow
refactor: extract slot computation to availability.service
test: add unit tests for transitionStatus guard
PR rules
No PR merges without passing TypeScript compilation (tsc --noEmit)
No PR merges without passing ESLint with zero errors
No PR merges with console.log, hardcoded secrets, or any types
PR description must state: what changed, why, and how to test it
One feature or fix per PR. Not "lots of small things."
What never gets committed
.env
.env.local
*.env
node_modules/
dist/
.next/
*.log
15. Definition of Done
A feature is done when all of the following are true. Not most. All.

 TypeScript compiles with zero errors (tsc --noEmit)
 ESLint passes with zero errors
 Every error path is handled explicitly — no unhandled promise rejections
 The happy path works end-to-end
 The failure path (bad input, missing record, wrong role, expired token) returns a clear, correct error
 No console.log in the committed code
 No hardcoded strings that should be constants or env vars
 The file is in the correct location per ARCHITECTURE.md §11
 Naming follows RULES.md §13
 The feature does not introduce any dependency not in RULES.md §11
 The feature is within MVP scope per RULES.md §2
One last thing.

The goal of these rules is not bureaucracy. It is to make sure that when something breaks at 9am on a Monday with a visitor standing at the gate, the code is readable enough to fix in five minutes — not five hours.

Write code for that situation. Everything else follows.