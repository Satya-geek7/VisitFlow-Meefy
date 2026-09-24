import { z } from "zod";

/**
 * Validates Indian 10-digit mobile phone numbers with optional +91 prefix.
 */
export const phoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;

export const VisitorRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name cannot exceed 60 characters"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit mobile number (e.g. 9853311223)"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .or(z.literal("")),
  organization: z
    .string()
    .trim()
    .max(100, "Organization name cannot exceed 100 characters")
    .optional()
    .default(""),
  preferredOfficer: z
    .string()
    .trim()
    .min(1, "Please select an officer to meet"),
  department: z
    .string()
    .trim()
    .min(1, "Department is required"),
  purpose: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing the purpose of your visit")
    .max(500, "Purpose cannot exceed 500 characters"),
  preferredDate: z
    .string()
    .refine((dateStr) => {
      if (!dateStr) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dateStr);
      return !isNaN(selected.getTime()) && selected >= today;
    }, "Appointment date cannot be in the past"),
  preferredTimeSlot: z
    .string()
    .trim()
    .min(1, "Please select a preferred time slot"),
  accompanyingCount: z
    .coerce
    .number()
    .int("Accompanying count must be an integer")
    .min(0, "Count cannot be negative")
    .max(5, "Maximum 5 accompanying persons allowed per pass")
    .default(0),
  notes: z
    .string()
    .trim()
    .max(300, "Notes cannot exceed 300 characters")
    .optional()
    .default(""),
});

export type VisitorRequestInput = z.infer<typeof VisitorRequestSchema>;

export const OtpSendSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit mobile number"),
});

export type OtpSendInput = z.infer<typeof OtpSendSchema>;

export const OtpVerifySchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid 10-digit mobile number"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Security OTP must be a 6-digit code"),
});

export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;

