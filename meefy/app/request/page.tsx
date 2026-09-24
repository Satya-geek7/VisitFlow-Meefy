"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import logo from "@/public/images/logo.svg";

import {
  VisitorRequestInput,
  VisitorRequestSchema,
} from "@/lib/validations/visitor.schema";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_DEPARTMENTS } from "@/data/departments";
import { StepProgress } from "@/components/request/StepProgress";
import { VisitDetailsForm, TIME_SLOTS } from "@/components/request/VisitDetailsForm";
import { OtpVerificationCard } from "@/components/request/OtpVerificationCard";
import { ConfirmationCard } from "@/components/request/ConfirmationCard";

export default function VisitorRequestPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<VisitorRequestInput>({
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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Confirmed State
  const [confirmedToken, setConfirmedToken] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // 60-second OTP cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  // Step 1: Submit Visit Details & Request OTP
  const handleDetailsSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/visitors/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setGeneralError(data.error || "Failed to dispatch verification code.");
        setIsSubmitting(false);
        return;
      }

      setSimulatedCode(data.simulatedCode || "892100");
      setOtpCode("");
      setOtpTimer(60);
      setCanResend(false);
      setCurrentStep(2);
    } catch {
      setGeneralError("Network connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP and Create Appointment
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (otpCode.length !== 6) {
      setGeneralError("Please enter the complete 6-digit security code.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Verify OTP
      const verifyRes = await fetch("/api/visitors/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, code: otpCode }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setGeneralError(verifyData.error || "Invalid verification code.");
        if (verifyData.remainingAttempts !== undefined) {
          setRemainingAttempts(verifyData.remainingAttempts);
        }
        if (verifyData.isLocked) {
          setIsLocked(true);
        }
        setIsSubmitting(false);
        return;
      }

      const verifiedSessionToken = verifyData.sessionToken;
      setSessionToken(verifiedSessionToken);

      // 2. Submit Appointment Record
      const apptRes = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${verifiedSessionToken}`,
        },
        body: JSON.stringify({
          ...formData,
          sessionToken: verifiedSessionToken,
        }),
      });

      const apptData = await apptRes.json();
      if (!apptRes.ok || !apptData.success) {
        setGeneralError(apptData.error || "Failed to submit appointment request.");
        setIsSubmitting(false);
        return;
      }

      setConfirmedToken(apptData.token || apptData.appointment?.passNumber);
      setCurrentStep(3);
    } catch {
      setGeneralError("Network error while submitting appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setGeneralError(null);
    try {
      const res = await fetch("/api/visitors/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setGeneralError(data.error || "Failed to resend verification code.");
        return;
      }

      setSimulatedCode(data.simulatedCode || "892100");
      setOtpCode("");
      setOtpTimer(60);
      setCanResend(false);
      setRemainingAttempts(5);
      setIsLocked(false);
    } catch {
      setGeneralError("Unable to resend OTP at this time.");
    }
  };

  const handleReset = () => {
    setFormData({
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
    setOtpCode("");
    setSimulatedCode(null);
    setConfirmedToken("");
    setCurrentStep(1);
    setGeneralError(null);
    setFieldErrors({});
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#18181B] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 w-full bg-white border-b border-[#E8E8E5] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs overflow-hidden">
              <Image src={logo} alt="VisitFlow logo" width={28} height={28} priority />
            </div>
            <div>
              <span className="text-sm font-bold text-[#18181B] group-hover:text-[#16A34A] transition-colors">
                VisitFlow
              </span>
              <p className="text-[10px] text-[#71717A]">Visitor Request Portal</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#71717A]">
            <ShieldCheckIcon size={14} className="text-[#16A34A]" />
            <span>SMS OTP Verification</span>
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E8E5] text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-[#F7F7F5] transition-colors"
          >
            <ArrowLeftIcon size={13} />
            <span>Portal Home</span>
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 md:py-12 space-y-8">
        {/* Step Indicator */}
        <StepProgress currentStep={currentStep} />

        {/* Global Error Banner */}
        {generalError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between animate-in fade-in duration-150">
            <span>{generalError}</span>
            <button
              onClick={() => setGeneralError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Wizard Steps */}
        {currentStep === 1 && (
          <VisitDetailsForm
            formData={formData}
            setFormData={setFormData}
            fieldErrors={fieldErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleDetailsSubmit}
          />
        )}

        {currentStep === 2 && (
          <OtpVerificationCard
            phone={formData.phone}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            otpTimer={otpTimer}
            isSubmitting={isSubmitting}
            canResend={canResend}
            remainingAttempts={remainingAttempts}
            isLocked={isLocked}
            simulatedCode={simulatedCode}
            onResend={handleResendOtp}
            onBack={() => {
              setCurrentStep(1);
              setGeneralError(null);
            }}
            onSubmit={handleOtpSubmit}
          />
        )}

        {currentStep === 3 && (
          <ConfirmationCard
            confirmedToken={confirmedToken}
            formData={formData}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E8E8E5] bg-white py-4 px-6 text-center text-xs text-[#71717A]">
        <p>© 2026 VisitFlow (VAMS) • Official Institutional Visitor Access Portal</p>
      </footer>
    </div>
  );
}
