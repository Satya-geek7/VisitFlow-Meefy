import { VisitorRecord } from "@/types/visitor";
import { INITIAL_VISITORS } from "@/data/visitors";
import { VisitorRequestInput } from "@/lib/validations/visitor.schema";

// Global cache for development/MVP demonstration
const globalAppointments: Map<string, VisitorRecord> =
  (globalThis as unknown as { _vams_appointments?: Map<string, VisitorRecord> })._vams_appointments ||
  new Map(INITIAL_VISITORS.map((v) => [v.passNumber, v]));

(globalThis as unknown as { _vams_appointments: Map<string, VisitorRecord> })._vams_appointments = globalAppointments;

export function generateTrackingToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `VF-${rand}`;
}

export function createAppointmentRecord(data: VisitorRequestInput): VisitorRecord {
  const passNumber = generateTrackingToken();
  const id = `v-${Date.now()}`;

  const newRecord: VisitorRecord = {
    id,
    passNumber,
    name: data.name,
    phone: data.phone,
    email: data.email || "guest@visitor.in",
    organization: data.organization || "Public Visitor",
    idType: "Aadhaar / National ID",
    idNumberMasked: "PHONE-OTP-VERIFIED",
    hostName: data.preferredOfficer,
    department: data.department,
    purpose: data.purpose,
    scheduledTime: `${data.preferredDate} (${data.preferredTimeSlot})`,
    slotStartTime: data.preferredTimeSlot.split("–")[0]?.trim() || "10:30 AM",
    slotEndTime: data.preferredTimeSlot.split("–")[1]?.trim() || "11:30 AM",
    status: "SUBMITTED",
    accompanyingCount: data.accompanyingCount || 0,
    createdAt: new Date().toISOString(),
    notes: data.notes || undefined,
  };

  // Index by both passNumber and id for fast lookups
  globalAppointments.set(passNumber, newRecord);
  globalAppointments.set(id, newRecord);

  return newRecord;
}

export function getAppointmentRecord(token: string): VisitorRecord | undefined {
  if (!token) return undefined;
  return globalAppointments.get(token) || globalAppointments.get(token.toUpperCase());
}

export function getAllAppointmentRecords(): VisitorRecord[] {
  // Deduplicate entries since we store under both id and passNumber
  const unique = new Map<string, VisitorRecord>();
  for (const v of globalAppointments.values()) {
    unique.set(v.id, v);
  }
  return Array.from(unique.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
