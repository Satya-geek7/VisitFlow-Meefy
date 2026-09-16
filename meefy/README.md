Visitor & Meeting Management System (`VisitFlow`)

A modern, secure, and paperless visitor and meeting management platform to replace manual paper registers and streamline the complete visitor lifecycle.

> 📌 **Detailed Architecture Document**: For the complete system architecture, sequence diagrams, and database schemas, refer to [ARCHITECTURE.md](file:///d:/VisitFlow-Meefy/meefy/ARCHITECTURE.md).

---

## 1. Project Overview & The Problem

Traditional paper visitor registers at the reception desk introduce serious bottlenecks:
- **Difficult to search records**: Finding past visit histories is slow and cumbersome.
- **No advance appointments**: Visitors arrive without scheduled coordination.
- **Manual host notification**: Receptionists must make manual phone calls or walk over to officers.
- **No real-time occupancy view**: In an emergency or audit, it is impossible to quickly answer *"who is currently inside the building?"*
- **No proper approval workflow**: Lacks a formalized digital approval, rescheduling, or delegation trail.
- **Meeting room conflicts**: Seminar halls and conference rooms suffer from uncoordinated scheduling and double-booking.

---

## 2. The Solution

**VisitFlow** provides a secure, digital, paperless solution:
1. **Advance Appointments**: Visitors pre-book meetings; hosts receive instant notifications to approve, reject, or reschedule with a single click.
2. **Walk-In Management**: Fast check-in at reception with instant host alert and host re-routing/delegation options.
3. **QR Code Passes**: Approved visitors receive a time-bounded digital QR pass for rapid gate check-in and check-out scanning.
4. **Meeting & Room Booking**: Prevents room double-booking for Conference Rooms and Seminar Halls.
5. **Real-time Occupancy & Safety**: Live dashboard of all visitors currently on premises for security audits and emergency evacuation roll-calls.
6. **Analytics & Reports**: Searchable visit logs, peak visiting hour insights, and department-wise reports.

---

## 3. Core System Modules

- **A. Visitor Registration Module**: Captures name, contact, organization, ID verification, photo, host/department, and vehicle details.
- **B. Appointment & Schedule Management**: Calendar-aware meeting invitations and scheduling.
- **C. Real-Time Host Notifications**: Instant alerts via web dashboard, email, and SMS with 1-click actions (*Accept*, *Reschedule*, *Please Wait*).
- **D. QR-Based Pass & Check-In System**: Dynamic QR pass generation, entry/exit timestamp logging, and automatic pass expiry.
- **E. Meeting & Room Management**: Conference and seminar room reservation with conflict detection and post-meeting outcome logs.
- **F. Executive Dashboard & Analytics**: Live on-premises headcount, visitor trends, and searchable historical archives.
- **G. Role-Based Access Control (RBAC)**: Strict permission tiers for *Receptionist*, *Host / Employee*, *Administrator*, and *Executive Management*.

---

## 4. Technology Stack

- **Frontend**: Next.js (React 19, TypeScript, Tailwind CSS)
- **Backend**: Python FastAPI (Async RESTful API)
- **Database**: PostgreSQL
- **Authentication**: JWT-based Role-Based Access Control (RBAC)
- **QR Generation & Scanning**: Python `qrcode` + `html5-qrcode` / `pyzbar`
- **Notifications & Background Tasks**: Redis + Celery / RQ

---

## 5. Getting Started (Development)

### Prerequisites
- Node.js 20+ & pnpm
- Python 3.12+
- PostgreSQL

### Running Frontend
```bash
pnpm install
pnpm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

---

## 6. Architecture & Design Specification
For comprehensive architectural specifications, data flows, and database schemas:
👉 Read [ARCHITECTURE.md](file:///d:/VisitFlow-Meefy/meefy/ARCHITECTURE.md)
