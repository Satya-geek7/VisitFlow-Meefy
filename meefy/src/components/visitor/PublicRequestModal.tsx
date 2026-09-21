import React, { useState } from "react";
import { PublicRequestFormData } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_DEPARTMENTS } from "@/data/departments";

interface PublicRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PublicRequestFormData) => void;
}

export function PublicRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: PublicRequestModalProps) {
  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [otpValue, setOtpValue] = useState("8921");
  const [formData, setFormData] = useState<PublicRequestFormData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    preferredOfficer: INITIAL_OFFICERS[0].name,
    department: INITIAL_DEPARTMENTS[0].name,
    purpose: "",
    preferredDate: new Date().toISOString().split("T")[0],
    preferredTimeSlot: "11:00 AM - 12:30 PM",
    accompanyingCount: 0,
    notes: "",
  });

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.purpose) {
      alert("Please enter full name, mobile number, and meeting purpose.");
      return;
    }
    // Advance to OTP verification step per PRD 7.1
    setStep("OTP");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.trim().length !== 4) {
      alert("Please enter a 4-digit OTP.");
      return;
    }
    onSubmit({ ...formData, otpCode: otpValue });
    setStep("FORM");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5 shrink-0">
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-lg font-black tracking-tight text-neutral-950">
                Public Appointment Request Portal
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                Self-Service • No Login Required
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Request an official appointment with host officers and faculty
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {step === "FORM" ? (
          <form onSubmit={handleInitialSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swati Pragyan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Mobile Number (For OTP Verification) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98533 11223"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Organization / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. Utkal University / Tech Solutions"
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="visitor@mail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Preferred Officer to Meet
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
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {INITIAL_OFFICERS.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name} — {o.designation}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTimeSlot: e.target.value })
                  }
                  className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="10:30 AM - 11:30 AM">Morning (10:30 AM - 11:30 AM)</option>
                  <option value="11:30 AM - 01:00 PM">Late Morning (11:30 AM - 01:00 PM)</option>
                  <option value="02:30 PM - 03:30 PM">Afternoon (02:30 PM - 03:30 PM)</option>
                  <option value="03:30 PM - 05:00 PM">Late Afternoon (03:30 PM - 05:00 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Detailed Purpose of Visit *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Explain the agenda of your visit (e.g. Academic guidance, official vendor submission, research tie-up)..."
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-neutral-100 pt-5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                Proceed to Mobile Verification →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-5 text-xs">
            <div className="rounded-2xl bg-blue-50/80 p-5 border border-blue-100 text-blue-950">
              <span className="font-bold text-sm block">Enter Security Verification Code</span>
              <p className="mt-1 text-xs text-blue-800 leading-relaxed">
                A 4-digit security code has been sent to{" "}
                <strong className="font-mono text-neutral-900 font-bold">{formData.phone}</strong> to block spam and verify guest identity.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-2">
                4-Digit Security OTP (Simulated: 8921)
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-40 rounded-2xl border border-neutral-300 bg-white p-3.5 text-center text-lg font-mono font-bold tracking-widest text-neutral-950 focus:outline-none focus:border-neutral-950 shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
              <button
                type="button"
                onClick={() => setStep("FORM")}
                className="text-xs font-semibold text-neutral-600 hover:underline"
              >
                ← Edit Form Details
              </button>
              <button
                type="submit"
                className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
              >
                Verify & Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
