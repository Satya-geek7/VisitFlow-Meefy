"use client";

import React from "react";
import Image from "next/image";
import { VisitorRecord } from "@/types/visitor";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  IdentificationBadge,
  CaretRight,
} from "@phosphor-icons/react";

interface ScanResultSuccessProps {
  visitor: VisitorRecord;
  onBackToScanner: () => void;
  onRescan: () => void;
  onCompleteCheckIn: (visitorId: string) => void;
}

export function ScanResultSuccess({
  visitor,
  onBackToScanner,
  onRescan,
  onCompleteCheckIn,
}: ScanResultSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Back to Scanner Link */}
      <div>
        <button
          onClick={onBackToScanner}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Scanner</span>
        </button>
      </div>

      {/* Access Granted Hero Banner */}
      <div className="flex flex-col items-center text-center space-y-2">
        {/* Double concentric green ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-[#BBF7D0] flex items-center justify-center bg-[#DCFCE7]/30">
            <CheckCircle size={64} weight="fill" className="text-[#16A34A]" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#16A34A]">
          Access Granted
        </h1>
        <p className="text-xs md:text-sm text-[#52525B] max-w-md">
          The QR code has been verified successfully. All credentials are valid and the visitor is authorized for entry.
        </p>
      </div>

      {/* Visitor Identity Card */}
      <div className="border border-[#E8E8E5] rounded-xl bg-white p-5 space-y-5 shadow-2xs">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E5]">
          <div className="flex items-center gap-2">
            <IdentificationBadge size={18} className="text-[#16A34A]" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                Visitor Identity
              </h3>
              <p className="text-[11px] font-mono text-[#71717A]">
                Verified Digital Pass ID: #{visitor.passNumber}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase tracking-wider">
            VALID PASS
          </span>
        </div>

        {/* Visitor Profile & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#E4E4E7] border border-[#E8E8E5] shrink-0">
              {visitor.photoUrl ? (
                <Image
                  src={visitor.photoUrl}
                  alt={visitor.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#16A34A]/10 text-[#16A34A] text-lg font-bold">
                  {visitor.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-[#18181B] leading-tight">
                {visitor.name}
              </h4>
              <p className="text-xs text-[#71717A]">
                {visitor.organization || "Global Dynamics Inc."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F4F4F5] text-[#52525B] tracking-wider uppercase">
              EXTERNAL VENDOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F4F4F5] text-[#52525B] tracking-wider uppercase">
              PRIORITY ACCESS
            </span>
          </div>
        </div>

        {/* 2-Column Schedule & Host Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0F0ED]">
          {/* Col 1 */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Appointment Time
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18181B] mt-0.5 tabular-nums">
                <Clock size={13} className="text-[#71717A]" />
                <span>{visitor.scheduledTime}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Date
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#18181B] mt-0.5">
                <Calendar size={13} className="text-[#71717A]" />
                <span>Oct 24, 2023</span>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Internal Host
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-[#E4E4E7] text-[9px] font-bold text-[#52525B] flex items-center justify-center">
                  JS
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#18181B] leading-none">
                    {visitor.hostName}
                  </p>
                  <p className="text-[10px] text-[#71717A] mt-0.5">
                    {visitor.department || "Senior Project Director"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Destination
              </span>
              <div className="flex items-start gap-1.5 mt-0.5">
                <MapPin size={13} className="text-[#71717A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#18181B] leading-none">
                    {visitor.roomName || "Innovation Lab B-12"}
                  </p>
                  <p className="text-[10px] text-[#71717A] mt-0.5">Level 4, North Wing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Clearance Alert Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] text-xs text-[#15803D]">
          <ShieldCheck size={16} weight="fill" className="text-[#16A34A] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Security clearance level: <strong>Level 2 (Standard Office)</strong>. Escort not required for this destination.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onRescan}
          className="h-10 px-6 border border-[#D4D4D0] bg-white hover:bg-[#F0F0ED] text-[#18181B] text-xs font-semibold rounded-lg transition-colors shadow-2xs"
        >
          Rescan
        </button>

        <button
          onClick={() => onCompleteCheckIn(visitor.id)}
          className="h-10 px-7 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span>Complete Check-in</span>
          <CaretRight size={14} weight="bold" />
        </button>
      </div>

      {/* Support note */}
      <p className="text-center text-[11px] text-[#71717A]">
        Need help? Contact <strong>Security Support</strong> at extension 404
      </p>

      {/* Footer */}
      <footer className="pt-6 border-t border-[#E8E8E5] flex items-center justify-between text-[11px] text-[#71717A]">
        <p>© 2023 VisitFlow Enterprise Edition</p>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
          <span>Scanner System Online</span>
          <span className="font-mono text-[10px] text-[#A1A1AA]">v2.4.1-STABLE</span>
        </div>
      </footer>
    </div>
  );
}
