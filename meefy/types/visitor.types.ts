export type VisitStatus =
  | "CHECKED_IN"
  | "APPROVED"
  | "PENDING_APPROVAL"
  | "CHECKED_OUT"
  | "REJECTED";

export type TabKey = "live" | "appointments" | "approvals" | "rooms";

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
  department: string;
  purpose: string;
  scheduledTime: string;
  checkInTime?: string;
  status: VisitStatus;
  roomName?: string;
  accompanyingCount: number;
}

export interface RoomRecord {
  id: string;
  name: string;
  capacity: number;
  location: string;
  currentMeeting?: string;
  hostName?: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  nextAvailable: string;
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
}
