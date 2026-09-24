"use client";

import React, { useRef, useEffect } from "react";
import {
  ShieldCheckIcon,
  DeviceMobileIcon,
  ArrowClockwiseIcon,
  CircleNotchIcon,
  LockKeyIcon,
  ArrowLeftIcon,
  InfoIcon,
  KeyIcon,
} from "@phosphor-icons/react";

interface OtpVerificationCardProps {
  phone: string;
  otpCode: string;
  setOtpCode: (code: string) => void;
  otpTimer: number;
  isSubmitting: boolean;
  canResend: boolean;
  remainingAttempts?: number;
  isLocked?: boolean;
  simulatedCode?: string | null;
  onResend: () => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OtpVerificationCard({
  phone,
  otpCode,
  setOtpCode,
  otpTimer,
  isSubmitting,
  canResend,
  remainingAttempts = 5,
  isLocked = false,
  simulatedCode,
  onResend,
  onBack,
  onSubmit,
}: OtpVerificationCardProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split 6-digit OTP into array of length 6
  const digits = Array.from({ length: 6 }, (_, i) => otpCode[i] || "");

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleDigitChange = (index: number, val: string) => {
    const cleanChar = val.replace(/\D/g, "");
    if (!cleanChar && val !== "") return;

    const newDigits = [...digits];
    newDigits[index] = cleanChar ? cleanChar.slice(-1) : "";
    const combined = newDigits.join("");
    setOtpCode(combined);

    // Auto-advance to next input
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      setOtpCode(pasted);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-xs max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50/50">
          <ShieldCheckIcon size={28} weight="fill" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Security Phone Verification</h2>
        <p className="text-sm text-gray-500 mt-1">
          A 6-digit security code has been dispatched to
        </p>
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-800">
          <DeviceMobileIcon size={14} />
          <span>+91 {phone.replace(/\D/g, "").slice(-10)}</span>
          <button
            type="button"
            onClick={onBack}
            className="text-emerald-700 hover:text-emerald-800 underline ml-1 cursor-pointer"
          >
            Change
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* 6-Digit OTP Box Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-center text-gray-700 uppercase tracking-wider">
            Enter 6-Digit Verification Code
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                disabled={isLocked || isSubmitting}
                value={digits[idx] || ""}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-lg border focus:outline-none transition-all ${
                  isLocked
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : digits[idx]
                    ? "border-emerald-600 bg-emerald-50/20 text-emerald-950 ring-2 ring-emerald-100"
                    : "border-gray-300 bg-gray-50/50 text-gray-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
                }`}
              />
            ))}
          </div>

          {/* Security details & attempts */}
          <div className="flex items-center justify-between text-xs text-gray-500 px-2 pt-1">
            <span className="inline-flex items-center gap-1">
              <LockKeyIcon size={14} className="text-emerald-600" />
              <span>TTL: 10 minutes</span>
            </span>

            {isLocked ? (
              <span className="text-rose-600 font-semibold">Code Locked (5/5 failed)</span>
            ) : remainingAttempts < 5 ? (
              <span className="text-amber-600 font-medium">{remainingAttempts} attempts remaining</span>
            ) : (
              <span className="text-gray-400">Max 5 attempts</span>
            )}
          </div>
        </div>

        {/* Development Helper / Simulated Code */}
        {simulatedCode && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <InfoIcon size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold flex items-center justify-between">
                <span>Dev / Evaluation Code:</span>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedCode)}
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium underline cursor-pointer"
                >
                  <KeyIcon size={13} />
                  <span>Auto-fill {simulatedCode}</span>
                </button>
              </div>
              <p className="mt-0.5 text-amber-800">
                In production, this code is routed via MSG91 SMS gateway.
              </p>
            </div>
          </div>
        )}

        {/* Resend Cooldown Action */}
        <div className="text-center pt-1">
          {canResend ? (
            <button
              type="button"
              onClick={onResend}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer disabled:opacity-50"
            >
              <ArrowClockwiseIcon size={14} />
              <span>Didn't receive code? Resend OTP</span>
            </button>
          ) : (
            <p className="text-xs text-gray-400">
              Resend verification code in <span className="font-mono font-semibold text-gray-700">{otpTimer}s</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
          >
            <ArrowLeftIcon size={14} />
            <span>Back to Details</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || otpCode.trim().length !== 6 || isLocked}
            className="w-full sm:flex-1 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <CircleNotchIcon size={18} className="animate-spin" />
                <span>Verifying & Submitting...</span>
              </>
            ) : (
              <>
                <ShieldCheckIcon size={18} weight="bold" />
                <span>Verify & Submit Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
