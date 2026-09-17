export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export interface RoomRecord {
  id: string;
  name: string;
  code: string;
  capacity: number;
  location: string;
  floor: string;
  equipment: string[];
  status: RoomStatus;
  currentMeeting?: string;
  hostName?: string;
  nextAvailable: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  appointmentId?: string;
  title: string;
  hostName: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
}
