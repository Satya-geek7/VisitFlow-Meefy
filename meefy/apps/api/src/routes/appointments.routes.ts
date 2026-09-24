/**
 * Appointments Routes
 * Follows ARCHITECTURE.md §3, §5, and §11
 */

import { Router, Request, Response } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { OtpService } from "../services/otp.service";
import { asyncHandler } from "../lib/asyncHandler";

const router = Router();

const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

const CreateAppointmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().regex(phoneRegex, "Valid 10-digit mobile required"),
  email: z.string().trim().email().or(z.literal("")),
  organization: z.string().trim().optional().default(""),
  preferredOfficer: z.string().trim().min(1, "Preferred officer is required"),
  department: z.string().trim().min(1, "Department is required"),
  purpose: z.string().trim().min(10, "Purpose must be at least 10 characters"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTimeSlot: z.string().min(1, "Preferred time slot is required"),
  accompanyingCount: z.coerce.number().min(0).max(5).default(0),
  notes: z.string().trim().optional().default(""),
  sessionToken: z.string().optional(),
});

interface AppointmentRecord {
  id: string;
  passNumber: string;
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
  status: "SUBMITTED" | "SCREENED" | "HOST_PENDING" | "APPROVED" | "PASS_ISSUED";
  createdAt: string;
}

// In-memory store for backend
const appointmentsDb: AppointmentRecord[] = [];

// POST /api/appointments
router.post(
  "/",
  validateBody(CreateAppointmentSchema),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const sessionToken = headerToken || req.body.sessionToken;

    // Verify visitor session token
    if (sessionToken) {
      const sessionCheck = await OtpService.validateSession(sessionToken);
      if (!sessionCheck.valid) {
        res.status(401).json({
          success: false,
          error: "Visitor session has expired. Please verify your phone number again.",
        });
        return;
      }
    }

    const passNumber = `VF-${Math.floor(100000 + Math.random() * 900000)}`;
    const appointment: AppointmentRecord = {
      id: `apt_${Date.now()}`,
      passNumber,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || "",
      organization: req.body.organization || "",
      preferredOfficer: req.body.preferredOfficer,
      department: req.body.department,
      purpose: req.body.purpose,
      preferredDate: req.body.preferredDate,
      preferredTimeSlot: req.body.preferredTimeSlot,
      accompanyingCount: req.body.accompanyingCount,
      notes: req.body.notes || "",
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
    };

    appointmentsDb.unshift(appointment);

    res.status(201).json({
      success: true,
      message: "Appointment request submitted successfully",
      appointment,
      token: passNumber,
      statusUrl: `/status/${passNumber}`,
    });
  })
);

// GET /api/appointments
router.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    appointments: appointmentsDb,
  });
});

export const appointmentRoutes = router;
