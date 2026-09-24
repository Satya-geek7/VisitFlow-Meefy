import { NextRequest, NextResponse } from "next/server";
import { VisitorRequestSchema } from "@/lib/validations/visitor.schema";
import {
  createAppointmentRecord,
  getAllAppointmentRecords,
} from "@/lib/server/appointmentStore";
import { validateVisitorSession } from "@/lib/server/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = VisitorRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Validation failed",
          fieldErrors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check optional sessionToken if provided
    const authHeader = req.headers.get("authorization");
    const sessionToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : body.sessionToken;

    if (sessionToken) {
      const sessionValid = validateVisitorSession(sessionToken);
      if (!sessionValid.valid) {
        return NextResponse.json(
          {
            success: false,
            error: "Visitor session has expired. Please verify your phone number again.",
          },
          { status: 401 }
        );
      }
    }

    const appointment = createAppointmentRecord(parseResult.data);

    return NextResponse.json(
      {
        success: true,
        message: "Appointment request submitted successfully",
        appointment,
        token: appointment.passNumber,
        statusUrl: `/status/${appointment.passNumber}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const appointments = getAllAppointmentRecords();
  return NextResponse.json({ success: true, appointments });
}
