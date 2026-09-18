"use client";

import React from "react";
import Image from "next/image";
import { VisitorRecord } from "@/types/visitor";
import {
  Calendar,
  Clock,
  User,
  Buildings,
  IdentificationBadge,
  Bell,
  PencilSimple,
  CheckCircle,
  DotsThreeVertical,
  SignIn,
  SignOut,
} from "@phosphor-icons/react";

interface AppointmentDetailPanelProps {
  visitor: VisitorRecord | null;
  onPrintBadge: (visitor: VisitorRecord) => void;
  onNotifyHost: (visitor: VisitorRecord) => void;
  onStatusToggle: (visitorId: string) => void;
}

export function AppointmentDetailPanel({
  visitor,
  onPrintBadge,
  onNotifyHost,
  onStatusToggle,
}: AppointmentDetailPanelProps) {
  if (!visitor) {
    return (
      <div className="w-[320px] lg:w-[340px] shrink-0 border border-[#E8E8E5] rounded-xl bg-white p-6 flex flex-col items-center justify-center text-center text-[#A1A1AA] min-h-[420px]">
        <IdentificationBadge size={44} weight="light" className="mb-2 text-[#D4D4D8]" />
        <p className="text-sm font-medium text-[#52525B]">No Appointment Selected</p>
        <p className="text-xs text-[#A1A1AA] mt-1 max-w-[200px]">
          Select any visitor card from the queue to view full credentials and security details.
        </p>
      </div>
    );
  }

  const isCheckedIn = visitor.status === "CHECKED_IN";
  const canCheckIn = visitor.status === "APPROVED" || visitor.status === "PASS_ISSUED";

  return (
    <div className="w-[320px] lg:w-[340px] shrink-0 border border-[#E8E8E5] rounded-xl bg-white p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E5]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
            Appointment Details
          </h3>
          <p className="text-[11px] font-mono text-[#71717A] mt-0.5">
            ID: {visitor.passNumber}
          </p>
        </div>
        <button
          className="p-1 rounded text-[#71717A] hover:text-[#18181B] hover:bg-[#F0F0ED] transition-colors"
          title="More options"
        >
          <DotsThreeVertical size={18} weight="bold" />
        </button>
      </div>

      {/* Visitor Profile */}
      <div className="flex flex-col items-center text-center pt-1">
        <div className="relative w-18 h-18 rounded-full overflow-hidden bg-[#E4E4E7] border-2 border-white shadow-xs">
          {visitor.photoUrl ? (
            <Image
              src={visitor.photoUrl}
              alt={visitor.name}
              fill
              className="object-cover"
              sizes="72px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#16A34A]/10 text-[#16A34A] text-xl font-bold">
              {visitor.name.charAt(0)}
            </div>
          )}
          {/* Verified Badge */}
          <div className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
            <CheckCircle size={18} weight="fill" className="text-[#16A34A]" />
          </div>
        </div>

        <h4 className="text-sm font-bold text-[#18181B] mt-2.5 leading-snug">
          {visitor.name}
        </h4>
        <p className="text-xs text-[#71717A] font-medium">
          {visitor.organization || "Visitor / Contractor"}
        </p>
      </div>

      {/* Section: Schedule */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
          Schedule
        </span>
        <div className="rounded-lg bg-[#F7F7F5] p-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
            <Calendar size={14} className="text-[#71717A]" />
            <span>Today, Oct 24</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#52525B] pl-5 tabular-nums">
            <Clock size={12} className="text-[#A1A1AA]" />
            <span>{visitor.scheduledTime}</span>
          </div>
        </div>
      </div>

      {/* Section: Internal Host */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
          Internal Host
        </span>
        <div className="rounded-lg bg-[#F7F7F5] p-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
            <User size={14} className="text-[#71717A]" />
            <span>{visitor.hostName}</span>
          </div>
          <div className="text-xs text-[#52525B] pl-5">
            <span>{visitor.department}</span>
          </div>
        </div>
      </div>

      {/* Section: Access & Location */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
          Access & Location
        </span>
        <div className="rounded-lg bg-[#F7F7F5] p-3 space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#18181B]">
            <Buildings size={14} className="text-[#71717A]" />
            <span>{visitor.roomName || "Main Lobby"}</span>
          </div>
          <div className="text-[11px] text-[#71717A] pl-5">
            <span>Floor 2 • Security Zone B</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => onPrintBadge(visitor)}
          className="w-full h-10 bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <IdentificationBadge size={16} weight="bold" />
          <span>Print Badge</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNotifyHost(visitor)}
            className="h-9 border border-[#D4D4D0] bg-white hover:bg-[#F0F0ED] text-[#18181B] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bell size={14} />
            <span>Notify Host</span>
          </button>

          {isCheckedIn ? (
            <button
              onClick={() => onStatusToggle(visitor.id)}
              className="h-9 border border-[#DC2626] bg-white hover:bg-[#FEF2F2] text-[#DC2626] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <SignOut size={14} />
              <span>Check Out</span>
            </button>
          ) : canCheckIn ? (
            <button
              onClick={() => onStatusToggle(visitor.id)}
              className="h-9 border border-[#16A34A] bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#15803D] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <SignIn size={14} />
              <span>Check In</span>
            </button>
          ) : (
            <button
              onClick={() => {}}
              className="h-9 border border-[#D4D4D0] bg-white hover:bg-[#F0F0ED] text-[#18181B] text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <PencilSimple size={14} />
              <span>Modify</span>
            </button>
          )}
        </div>
      </div>

      {/* Pre-entry screening note */}
      <div className="flex items-center gap-2 bg-[#F7F7F5] rounded-lg p-2.5 text-[11px] text-[#52525B]">
        <CheckCircle size={15} weight="fill" className="text-[#16A34A] shrink-0" />
        <span>Visitor has completed pre-entry health screening.</span>
      </div>
    </div>
  );
}
