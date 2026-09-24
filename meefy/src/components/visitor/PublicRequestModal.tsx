import React, { useState } from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  ClockIcon,
  ChatTextIcon,
  XIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import { PublicRequestFormData } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_DEPARTMENTS } from "@/data/departments";
import { VisitorRequestSchema } from "@/lib/validations/visitor.schema";

interface PublicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicRequestFormData) => void;
}

const TIME_SLOTS = [
  "10:00 AM – 10:30 AM",
  "10:30 AM – 11:30 AM",
  "11:30 AM – 12:30 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
];

export function PublicRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: PublicRequestModalProps) {
  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [otpValue, setOtpValue] = useState("892100");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PublicRequestFormData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    preferredOfficer: INITIAL_OFFICERS[0].name,
    department: INITIAL_DEPARTMENTS[0].name,
    purpose: "",
    preferredDate: new Date().toISOString().split("T")[0],
    preferredTimeSlot: TIME_SLOTS[1],
    accompanyingCount: 0,
    notes: "",
  });

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const validation = VisitorRequestSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !errors[path]) {
          errors[path] = err.message;
        }
      });
      setFieldErrors(errors);
      setGeneralError("Please resolve highlighted fields before proceeding.");
      return;
    }

    setStep("OTP");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue || otpValue.trim().length !== 6) {
      setGeneralError("Please enter a valid 6-digit security code.");
      return;
    }

    onSubmit({ ...formData, otpCode: otpValue.trim() });
    setStep("FORM");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E8E8E5] bg-white p-6 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F4F4F5] pb-5 shrink-0">
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base font-bold tracking-tight text-[#18181B]">
                Public Appointment Request Portal
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Self-Service • No Login Required
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-1">
              Request an official campus visit with faculty and department officers
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#71717A] hover:bg-[#F4F4F5] transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {generalError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
            {generalError}
          </div>
        )}

        {step === "FORM" ? (
          <form onSubmit={handleInitialSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="text"
                    placeholder="e.g. Swati Pragyan"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                    }}
                    className={`w-full rounded-xl border bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] focus:bg-white focus:outline-none ${fieldErrors.name ? "border-red-500" : "border-[#D4D4D0] focus:border-[#18181B]"
                      }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Mobile Number (For OTP Verification) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <PhoneIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="tel"
                    placeholder="9853311223"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                    }}
                    className={`w-full rounded-xl border bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] focus:bg-white focus:outline-none ${fieldErrors.phone ? "border-red-500" : "border-[#D4D4D0] focus:border-[#18181B]"
                      }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="email"
                    placeholder="visitor@mail.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                    }}
                    className={`w-full rounded-xl border bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] focus:bg-white focus:outline-none ${fieldErrors.email ? "border-red-500" : "border-[#D4D4D0] focus:border-[#18181B]"
                      }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Organization / University
                </label>
                <div className="relative">
                  <BuildingsIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="text"
                    placeholder="e.g. Utkal University / Tech Solutions"
                    value={formData.organization}
                    onChange={(e) =>
                      setFormData({ ...formData, organization: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#D4D4D0] bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] focus:bg-white focus:border-[#18181B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Officer to Meet <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.preferredOfficer}
                  onChange={(e) => {
                    const officer = INITIAL_OFFICERS.find((o) => o.name === e.target.value);
                    setFormData({
                      ...formData,
                      preferredOfficer: e.target.value,
                      department: officer ? officer.departmentName : formData.department,
                    });
                  }}
                  className="w-full rounded-xl border border-[#D4D4D0] bg-[#F7F7F5] px-3.5 py-2.5 text-xs text-[#18181B] focus:bg-white focus:border-[#18181B] focus:outline-none"
                >
                  {INITIAL_OFFICERS.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name} — {o.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.department}
                  className="w-full rounded-xl border border-[#E8E8E5] bg-[#F4F4F5] px-3.5 py-2.5 text-xs text-[#71717A] cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarBlankIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.preferredDate}
                    onChange={(e) => {
                      setFormData({ ...formData, preferredDate: e.target.value });
                      if (fieldErrors.preferredDate)
                        setFieldErrors({ ...fieldErrors, preferredDate: "" });
                    }}
                    className={`w-full rounded-xl border bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] font-mono focus:bg-white focus:outline-none ${fieldErrors.preferredDate
                        ? "border-red-500"
                        : "border-[#D4D4D0] focus:border-[#18181B]"
                      }`}
                  />
                </div>
                {fieldErrors.preferredDate && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.preferredDate}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#3F3F46] mb-1.5">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <ClockIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredTimeSlot: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#D4D4D0] bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] font-mono focus:bg-white focus:border-[#18181B] focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#3F3F46] mb-1.5">
                Detailed Purpose of Visit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ChatTextIcon size={16} className="absolute left-3.5 top-3 text-[#A1A1AA]" />
                <textarea
                  rows={2}
                  placeholder="Explain the agenda of your visit (e.g. Academic guidance, official vendor submission, research tie-up)..."
                  value={formData.purpose}
                  onChange={(e) => {
                    setFormData({ ...formData, purpose: e.target.value });
                    if (fieldErrors.purpose) setFieldErrors({ ...fieldErrors, purpose: "" });
                  }}
                  className={`w-full rounded-xl border bg-[#F7F7F5] pl-10 pr-3 py-2.5 text-xs text-[#18181B] focus:bg-white focus:outline-none ${fieldErrors.purpose ? "border-red-500" : "border-[#D4D4D0] focus:border-[#18181B]"
                    }`}
                />
              </div>
              {fieldErrors.purpose && (
                <p className="text-[11px] text-red-600 mt-1">{fieldErrors.purpose}</p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-5 shrink-0">
              <span className="text-[11px] text-[#71717A] flex items-center space-x-1.5">
                <ShieldCheckIcon size={16} className="text-[#16A34A]" />
                <span>Phone OTP Verification Required</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#D4D4D0] px-4 py-2.5 text-xs font-semibold text-[#52525B] hover:bg-[#F4F4F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-[#18181B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#27272A] transition-all active:scale-[0.98]"
                >
                  <span>Proceed to Mobile Verification</span>
                  <ArrowRightIcon size={14} />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5 text-xs">
            <div className="rounded-xl bg-blue-50/80 p-5 border border-blue-100 text-blue-950">
              <span className="font-bold text-sm block">Enter Security Verification Code</span>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                A 6-digit security code has been dispatched to{" "}
                <strong className="font-mono text-neutral-900 font-bold">{formData.phone}</strong>.
              </p>
            </div>

            <div className="text-center">
              <label className="block font-semibold text-[#52525B] mb-2">
                6-Digit Security OTP (Simulated: 892100)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                className="w-48 mx-auto block rounded-xl border border-[#D4D4D0] bg-white p-3 text-center text-xl font-mono font-bold tracking-widest text-[#18181B] focus:border-[#18181B] focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#F4F4F5] pt-5">
              <button
                type="button"
                onClick={() => setStep("FORM")}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-[#52525B] hover:underline"
              >
                <ArrowLeftIcon size={14} />
                <span>Edit Details</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 rounded-xl bg-[#16A34A] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#15803D] transition-all active:scale-[0.98]"
              >
                <span>Verify & Submit Request</span>
                <CheckCircleIcon size={16} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
