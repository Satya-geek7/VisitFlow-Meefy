"use client";

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  XCircleIcon,
  WarningIcon,
  ArrowClockwiseIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  HeadsetIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

interface ScanResultFailureProps {
  onBackToScanner: () => void;
  onRetryScan: () => void;
  onManualOverride: () => void;
  onManualLookup: (query: string) => void;
  onRegisterNewVisitor: () => void;
}

export function ScanResultFailure({
  onBackToScanner,
  onRetryScan,
  onManualOverride,
  onManualLookup,
  onRegisterNewVisitor,
}: ScanResultFailureProps) {
  const [lookupQuery, setLookupQuery] = useState("");

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupQuery.trim()) {
      onManualLookup(lookupQuery.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Top Bar: Back & Session ID */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToScanner}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeftIcon size={14} />
          <span>Back to Scanner</span>
        </button>
        <span className="font-mono text-xs text-[#71717A]">
          SESSION_ID: ERR_992_XF
        </span>
      </div>

      {/* Hero Warning Icon & Heading */}
      <div className="flex flex-col items-center text-center space-y-2">
        {/* Double concentric red ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-[#FEE2E2] flex items-center justify-center bg-[#FEF2F2]">
            <XCircleIcon size={64} weight="fill" className="text-[#DC2626]" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#18181B]">
          Invalid or Expired Pass
        </h1>
        <p className="text-xs md:text-sm text-[#52525B] max-w-md">
          The QR code presented is no longer valid for entry at this facility.
        </p>
      </div>

      {/* System Error Pill Banner */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-xs">
        <div className="flex items-center gap-2 text-[#DC2626] font-semibold">
          <WarningIcon size={16} weight="bold" />
          <span>System Error: TOKEN_EXPIRED</span>
        </div>
        <span className="text-[11px] text-[#A1A1AA]">Detected 2 minutes ago</span>
      </div>

      {/* 2-Column Diagnostics & Immediate Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Scan Diagnostics */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-5 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
            Scan Diagnostics
          </h3>

          <div className="space-y-3 pt-1 text-xs">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                ATTEMPTED USE
              </span>
              <p className="font-semibold text-[#18181B] mt-0.5 tabular-nums">
                Today, 10:45 AM
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                ORIGINAL DATE
              </span>
              <p className="font-semibold text-[#18181B] mt-0.5">
                Oct 12, 2023
              </p>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                REASON CODE
              </span>
              <p className="font-semibold text-[#DC2626] mt-0.5">
                Auth Token Lifetime Exceeded
              </p>
            </div>
          </div>
        </div>

        {/* Right: Immediate Actions */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
              Immediate Actions
            </h3>
            <p className="text-xs text-[#52525B] mt-2 leading-relaxed">
              Please ask the visitor to refresh their pass or proceed to manual verification.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onRetryScan}
              className="w-full h-10 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <ArrowClockwiseIcon size={15} weight="bold" />
              <span>Retry QR Scan</span>
            </button>

            <button
              onClick={onManualOverride}
              className="w-full h-10 border border-[#D4D4D0] bg-white hover:bg-[#F0F0ED] text-[#18181B] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Override & Verify Manually</span>
              <CaretRightIcon size={14} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Lookup Card */}
      <div className="border border-[#E8E8E5] rounded-xl bg-white p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#18181B]">
              Can&apos;t scan? Use Manual Lookup
            </h3>
            <p className="text-xs text-[#52525B] mt-0.5">
              Search for the visitor using their email, phone number, or appointment ID to verify their credentials manually.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F4F4F5] text-[#52525B] shrink-0">
            Alternative Method
          </span>
        </div>

        <form onSubmit={handleLookup} className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
            />
            <input
              type="text"
              placeholder="Enter Appointment ID or Visitor Email..."
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E8E8E5] bg-white text-xs text-[#18181B] placeholder-[#A1A1AA] focus:border-[#D4D4D0] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Find Visitor
          </button>
        </form>

        <div className="flex items-center gap-6 pt-1 text-xs text-[#52525B]">
          <button
            type="button"
            onClick={onRegisterNewVisitor}
            className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors"
          >
            <UserPlusIcon size={15} />
            <span>Register New Visitor</span>
          </button>

          <button
            type="button"
            onClick={() => { }}
            className="inline-flex items-center gap-1.5 hover:text-[#16A34A] transition-colors"
          >
            <HeadsetIcon size={15} />
            <span>Contact IT Support</span>
          </button>
        </div>
      </div>

      {/* Security Protocol Footnote */}
      <p className="text-center text-[10px] text-[#A1A1AA] leading-relaxed max-w-lg mx-auto">
        Security Protocol 4.2: All failed scans must be logged in the daily visitor registry.
        Questions? Visit the Knowledge Base or call Ext. 404.
      </p>
    </div>
  );
}
