export type VisitStatus =
  | "SUBMITTED"
  | "SCREENED"
  | "HOST_PENDING"
  | "APPROVED"
  | "PASS_ISSUED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "REJECTED"
  | "DECLINED"
  | "EXPIRED"
  | "NO_SHOW"
  | "CANCELLED";

export type RolePerspective =
  | "receptionist"
  | "officer"
  | "admin"
  | "visitor";

export type TabKey =
  | "live"
  | "screening"
  | "approvals"
  | "appointments"
  | "rooms"
  | "analytics"
  | "audit";

export interface VisitorRecord {
  id: string;
  passNumber: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  idType: string;
  idNumberMasked: string;
  hostName: string;
  hostOfficerId?: string;
  department: string;
  purpose: string;
  scheduledTime: string;
  slotStartTime?: string;
  slotEndTime?: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: VisitStatus;
  roomName?: string;
  accompanyingCount: number;
  vehicleNumber?: string;
  photoUrl?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  isOverstay?: boolean;
}

export interface WalkInFormData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  idType: string;
  idNumber: string;
  hostName: string;
  department: string;
  purpose: string;
  accompanyingCount: number;
  vehicleNumber: string;
  roomName?: string;
}

export interface PublicRequestFormData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  preferredOfficer: string;
  department: string;
  purpose: string;
  preferredDate: string;
  preferredTimeSlot: string;
  accompanyingCount: number;
  notes: string;
  otpCode?: string;
}

export interface ScreeningActionData {
  visitorId: string;
  action: "APPROVE_SCHEDULE" | "REJECT";
  assignedOfficer: string;
  assignedSlot: string;
  roomName?: string;
  reason?: string;
}
