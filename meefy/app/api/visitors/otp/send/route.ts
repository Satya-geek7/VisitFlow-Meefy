import { NextRequest, NextResponse } from "next/server";
import { OtpSendSchema } from "@/lib/validations/visitor.schema";
import { requestOtp } from "@/lib/server/otpStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = OtpSendSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid phone number",
        },
        { status: 400 }
      );
    }

    const { phone } = parseResult.data;
    const result = requestOtp(phone);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Rate limit exceeded. Please wait before retrying.",
          retryAfterSeconds: result.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Security OTP dispatched to ${phone.slice(-4).padStart(phone.length, "*")}`,
        expiresInSeconds: result.expiresInSeconds,
        simulatedCode: result.code,
        fallbackDemoCode: "892100",
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
