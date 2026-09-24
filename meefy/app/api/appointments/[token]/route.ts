import { NextRequest, NextResponse } from "next/server";
import { getAppointmentRecord } from "@/lib/server/appointmentStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const appointment = getAppointmentRecord(token);

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: `Appointment not found for token: ${token}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
