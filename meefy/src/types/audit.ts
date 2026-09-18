export type AuditAction =
  | "REQUEST_SUBMITTED"
  | "REQUEST_SCREENED"
  | "HOST_APPROVED"
  | "HOST_DECLINED"
  | "PASS_ISSUED"
  | "GATE_CHECKED_IN"
  | "GATE_CHECKED_OUT"
  | "REQUEST_REJECTED"
  | "ROOM_RESERVED"
  | "BLACKLIST_ADDED"
  | "EMERGENCY_ROLLCALL_EXPORTED";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: "RECEPTIONIST" | "OFFICER" | "ADMIN" | "VISITOR" | "SYSTEM";
  action: AuditAction;
  entityType: "APPOINTMENT" | "VISITOR" | "ROOM" | "SYSTEM";
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface BlacklistEntry {
  id: string;
  name: string;
  phone: string;
  email: string;
  reason: string;
  addedBy: string;
  addedAt: string;
}
