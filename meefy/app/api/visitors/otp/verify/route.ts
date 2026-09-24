import { NextRequest, NextResponse } from "next/server";
import { OtpVerifySchema } from "@/lib/validations/visitor.schema";
import { verifyOtp } from "@/lib/server/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = OtpVerifySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid verification code",
        },
        { status: 400 }
      );
    }

    const { phone, code } = parseResult.data;
    const result = verifyOtp(phone, code);

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Incorrect verification code",
          remainingAttempts: result.remainingAttempts,
          isLocked: result.isLocked,
        },
        { status: result.isLocked ? 423 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        verified: true,
        sessionToken: result.sessionToken,
        message: "Phone number verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
