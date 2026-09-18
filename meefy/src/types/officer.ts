export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  headName: string;
  floor: string;
}

export interface OfficerRecord {
  id: string;
  name: string;
  designation: string;
  departmentId: string;
  departmentName: string;
  email: string;
  phone: string;
  roomOffice: string;
  avatarUrl?: string;
  isAvailableToday: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}

export interface AvailabilitySlot {
  time: string;
  status: "FREE" | "BUSY" | "BLOCKED";
  title?: string;
}
