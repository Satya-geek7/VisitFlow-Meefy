/**
 * Visitor Routes: OTP Send & Verify
 * Follows ARCHITECTURE.md §5 and §11
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { OtpService } from "../services/otp.service";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

const SendOtpSchema = z.object({
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid 10-digit mobile number"),
});

const VerifyOtpSchema = z.object({
  phone: z.string().trim().regex(phoneRegex, "Please enter a valid 10-digit mobile number"),
  code: z.string().trim().regex(/^\d{6}$/, "Security OTP must be a 6-digit code"),
});

// POST /api/visitors/otp/send
router.post(
  "/otp/send",
  validateBody(SendOtpSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { phone } = req.body;
    const result = await OtpService.sendOtp(phone);

    if (!result.ok) {
      res.status(429).json({
        success: false,
        error: result.error || "Rate limit reached. Please wait before retrying.",
        retryAfterSeconds: result.retryAfterSeconds,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `A 6-digit OTP code has been dispatched to ${phone.slice(-4).padStart(phone.length, "*")}`,
      expiresInSeconds: result.expiresInSeconds,
      simulatedCode: result.simulatedCode,
      fallbackDemoCode: "892100",
    });
  })
);

// POST /api/visitors/otp/verify
router.post(
  "/otp/verify",
  validateBody(VerifyOtpSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { phone, code } = req.body;
    const result = await OtpService.verifyOtp(phone, code);

    if (!result.ok) {
      res.status(result.isLocked ? 423 : 400).json({
        success: false,
        error: result.error || "Invalid verification code",
        remainingAttempts: result.remainingAttempts,
        isLocked: result.isLocked,
      });
      return;
    }

    res.status(200).json({
      success: true,
      verified: true,
      sessionToken: result.sessionToken,
      message: "Phone number verified successfully",
    });
  })
);

export const visitorRoutes = router;
