"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UserIcon,
  BuildingsIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  IdentificationCardIcon,
  SquaresFourIcon,
  ClipboardTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  LockKeyIcon,
  XIcon,
} from "@phosphor-icons/react";
import logo from "@/public/images/logo.svg";
import { SidebarTab } from "@/components/layout/AppSidebar";
import { VisitorRecord } from "@/types/visitor";

interface LandingPortalScreenProps {
  onEnterDashboard: (targetTab?: SidebarTab) => void;
  onOpenPublicRequest: () => void;
  onTrackPass: (passNumber: string) => void;
  pendingApprovalsCount: number;
  totalVisitorsToday: number;
  activeCheckedInCount: number;
  visitors: VisitorRecord[];
}

export function LandingPortalScreen({
  onEnterDashboard,
  onOpenPublicRequest,
  onTrackPass,
  pendingApprovalsCount,
  totalVisitorsToday,
  activeCheckedInCount,
  visitors,
}: LandingPortalScreenProps) {
  const [trackingInput, setTrackingInput] = useState("");
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = trackingInput.trim().toUpperCase();
    if (!token) {
      setLookupError("Please enter your tracking token (e.g. VF-3819 or APT-9402)");
      return;
    }

    const found = visitors.find(
      (v) =>
        v.passNumber.toUpperCase() === token ||
        v.id.toUpperCase() === token ||
        v.id.toUpperCase() === `V-${token}`
    );

    if (found) {
      setShowLookupModal(false);
      onTrackPass(found.passNumber);
    } else {
      setLookupError(`No appointment record found matching "${token}". Please verify your reference number.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#18181B] flex flex-col justify-between selection:bg-[#DCFCE7] selection:text-[#15803D]">
      {/* 1. Official Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#E8E8E5] sticky top-0 z-30 px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs overflow-hidden">
            <Image src={logo} alt="VisitFlow logo" width={30} height={30} priority />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#18181B]">
                VisitFlow
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#F4F4F5] text-[#71717A] tracking-wider uppercase border border-[#E4E4E7]">
                VAMS 1.0
              </span>
            </div>
            <p className="text-[11px] text-[#71717A] hidden sm:block">
              Campus Visitor & Appointment Management System
            </p>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setShowLookupModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E8E5] text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-[#F7F7F5] transition-colors"
          >
            <MagnifyingGlassIcon size={14} />
            <span className="hidden sm:inline">Track Pass</span>
          </button>

          <button
            onClick={() => onEnterDashboard("queue")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#18181B] text-white text-xs font-bold hover:bg-[#27272A] transition-all shadow-xs active:scale-[0.98]"
          >
            <BuildingsIcon size={14} />
            <span>Staff Dashboard</span>
            <ArrowRightIcon size={12} className="text-[#A1A1AA]" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 lg:py-14 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Campus Security Clearance & Official Gate Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#18181B] leading-[1.15]">
            Welcome to the Campus Gateway
          </h1>

          <p className="text-sm sm:text-base text-[#71717A] leading-relaxed max-w-2xl mx-auto">
            Choose your portal below to submit a public appointment request with host officers,
            or access the authorized receptionist and faculty management dashboard.
          </p>
        </div>

        {/* 3. The Two Core Portal Cards (Option 1 vs Option 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ================= OPTION 1: PUBLIC VISITOR PORTAL ================= */}
          <div className="relative group rounded-2xl border-2 border-[#E8E8E5] hover:border-[#16A34A] bg-white p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-[#16A34A]/5">
            <div className="space-y-6">
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[11px] font-bold tracking-wide uppercase">
                  <UserIcon size={13} weight="bold" />
                  <span>Option 1 • Public Portal</span>
                </span>
                <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-md">
                  No Login Required
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                  <IdentificationCardIcon size={26} weight="duotone" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
                  Visitor Request Portal
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Apply for official campus entry to meet faculty officers or departments.
                  Verify via phone OTP to obtain your authorized digital QR entry pass.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-[#F4F4F5] text-xs text-[#52525B]">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                  <span>3-Step Self-Service Form (Details → OTP → Pass)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                  <span>6-Digit Security OTP verification (SMS29 / MSG91)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon size={16} weight="fill" className="text-[#16A34A] shrink-0" />
                  <span>Real-time digital pass tracking & QR gate check-in</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-8 space-y-3">
              <button
                onClick={onOpenPublicRequest}
                className="w-full h-11 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Request Visit Appointment</span>
                <ArrowRightIcon size={15} weight="bold" />
              </button>

              <button
                onClick={() => setShowLookupModal(true)}
                className="w-full h-10 border border-[#E8E8E5] hover:border-[#D4D4D0] bg-white hover:bg-[#F7F7F5] text-[#52525B] hover:text-[#18181B] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon size={14} />
                <span>Track Existing Pass / Token</span>
              </button>
            </div>
          </div>

          {/* ================= OPTION 2: STAFF & SECURITY WORKSPACE ================= */}
          <div className="relative group rounded-2xl border-2 border-[#E8E8E5] hover:border-[#18181B] bg-white p-7 sm:p-8 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/5">
            <div className="space-y-6">
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-[11px] font-bold tracking-wide uppercase">
                  <LockKeyIcon size={13} weight="bold" />
                  <span>Option 2 • Staff Workspace</span>
                </span>
                <span className="text-[11px] font-semibold text-[#52525B] bg-[#F4F4F5] px-2 py-0.5 rounded-md">
                  Authorized Personnel
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] border border-[#E4E4E7] flex items-center justify-center text-[#18181B]">
                  <BuildingsIcon size={26} weight="duotone" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
                  Staff & Officer Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                  Unified operational workspace for Receptionists, Department Host Officers,
                  Gate Security Scanners, and Campus Premise Administrators.
                </p>
              </div>

              {/* Role Badges / Deep-Links */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4F4F5] text-xs">
                <button
                  onClick={() => onEnterDashboard("queue")}
                  className="p-2.5 rounded-xl border border-[#E8E8E5] bg-[#FDFDFC] hover:bg-[#F7F7F5] hover:border-[#D4D4D0] transition-colors text-left group/btn"
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#18181B] text-[11px]">
                    <SquaresFourIcon size={14} className="text-[#16A34A]" />
                    <span>Reception Queue</span>
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-0.5">Screening & walk-ins</p>
                </button>

                <button
                  onClick={() => onEnterDashboard("approvals")}
                  className="p-2.5 rounded-xl border border-[#E8E8E5] bg-[#FDFDFC] hover:bg-[#F7F7F5] hover:border-[#D4D4D0] transition-colors text-left group/btn"
                >
                  <div className="flex items-center justify-between font-bold text-[#18181B] text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <ClipboardTextIcon size={14} className="text-[#2563EB]" />
                      <span>Host Approvals</span>
                    </div>
                    {pendingApprovalsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#FEF3C7] text-[#D97706] text-[9px] font-bold flex items-center justify-center">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-0.5">1-click clearance</p>
                </button>

                <button
                  onClick={() => onEnterDashboard("scan")}
                  className="p-2.5 rounded-xl border border-[#E8E8E5] bg-[#FDFDFC] hover:bg-[#F7F7F5] hover:border-[#D4D4D0] transition-colors text-left group/btn"
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#18181B] text-[11px]">
                    <QrCodeIcon size={14} className="text-[#9333EA]" />
                    <span>Gate Scanner</span>
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-0.5">Camera QR verify</p>
                </button>

                <button
                  onClick={() => onEnterDashboard("analytics")}
                  className="p-2.5 rounded-xl border border-[#E8E8E5] bg-[#FDFDFC] hover:bg-[#F7F7F5] hover:border-[#D4D4D0] transition-colors text-left group/btn"
                >
                  <div className="flex items-center gap-1.5 font-bold text-[#18181B] text-[11px]">
                    <ChartBarIcon size={14} className="text-[#EA580C]" />
                    <span>Admin Roll Call</span>
                  </div>
                  <p className="text-[10px] text-[#71717A] mt-0.5">Campus occupancy</p>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-8 space-y-3">
              <button
                onClick={() => onEnterDashboard("queue")}
                className="w-full h-11 bg-[#18181B] hover:bg-[#27272A] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Staff Workspace</span>
                <ArrowRightIcon size={15} weight="bold" />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-[#71717A]">
                  Logged in as <strong className="text-[#18181B]">Elena Rivera</strong> (Head Receptionist)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Live Institutional Campus Metrics Strip */}
        <div className="rounded-2xl border border-[#E8E8E5] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F4F4F5] mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
              <ShieldCheckIcon size={16} className="text-[#16A34A]" />
              <span>Real-Time Premise Visibility & Gate Status</span>
            </div>
            <span className="text-[11px] text-[#71717A]">
              Gate 1 & Gate 2 • Active Verification
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-[#F7F7F5]">
              <p className="text-[11px] text-[#71717A] font-medium">Currently On Campus</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#18181B] mt-0.5">
                {activeCheckedInCount}
              </p>
              <span className="text-[10px] text-[#16A34A] font-semibold">Live Occupancy</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F7F5]">
              <p className="text-[11px] text-[#71717A] font-medium">Total Scheduled Today</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#18181B] mt-0.5">
                {totalVisitorsToday}
              </p>
              <span className="text-[10px] text-[#52525B] font-semibold">Daily Visits</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F7F5]">
              <p className="text-[11px] text-[#71717A] font-medium">Pending Host Approvals</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#D97706] mt-0.5">
                {pendingApprovalsCount}
              </p>
              <span className="text-[10px] text-[#D97706] font-semibold">Awaiting Clearance</span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F7F5]">
              <p className="text-[11px] text-[#71717A] font-medium">Gate Security SLA</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#16A34A] mt-0.5">
                &lt; 15s
              </p>
              <span className="text-[10px] text-[#16A34A] font-semibold">QR Fast-Track</span>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Clean Footer */}
      <footer className="w-full border-t border-[#E8E8E5] bg-white py-4 px-6 text-center text-xs text-[#71717A]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 VisitFlow (VAMS) • Institutional Campus Visitor & Appointment Management System</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-[#16A34A] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              Systems Online
            </span>
            <span>SMS29 / MSG91 Active</span>
          </div>
        </div>
      </footer>

      {/* Modal: Quick Pass Tracking Lookup */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E8E8E5] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5]">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon size={18} className="text-[#16A34A]" />
                <h3 className="text-sm font-bold text-[#18181B]">Track Digital Pass</h3>
              </div>
              <button
                onClick={() => {
                  setShowLookupModal(false);
                  setLookupError(null);
                }}
                className="p-1 rounded-full text-[#71717A] hover:bg-[#F4F4F5]"
              >
                <XIcon size={16} />
              </button>
            </div>

            <form onSubmit={handleTrackSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3F3F46] mb-1.5">
                  Tracking Token / Pass Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. APT-9402 or VF-3819"
                  value={trackingInput}
                  onChange={(e) => {
                    setTrackingInput(e.target.value);
                    if (lookupError) setLookupError(null);
                  }}
                  autoFocus
                  className="w-full h-11 px-3.5 rounded-xl border border-[#D4D4D0] bg-[#F7F7F5] text-sm font-mono text-[#18181B] uppercase focus:bg-white focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                />
                {lookupError && (
                  <p className="text-[11px] text-red-600 mt-1.5">{lookupError}</p>
                )}
                <p className="text-[11px] text-[#71717A] mt-1.5">
                  Try demo tokens: <strong className="font-mono text-[#18181B]">APT-9402</strong>, <strong className="font-mono text-[#18181B]">APT-9403</strong>, or your generated <strong className="font-mono text-[#18181B]">VF-XXXX</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLookupModal(false);
                    setLookupError(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#D4D4D0] text-xs font-semibold text-[#52525B] hover:bg-[#F4F4F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-xs font-bold text-white shadow-xs"
                >
                  Lookup Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
