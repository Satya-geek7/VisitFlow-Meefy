"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  PlusCircleIcon,
  QrCodeIcon,
  CalendarCheckIcon,
  UserCheckIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { VisitorRequestInput } from "@/lib/validations/visitor.schema";

interface ConfirmationCardProps {
  confirmedToken: string;
  formData: VisitorRequestInput;
  onReset: () => void;
}

export function ConfirmationCard({ confirmedToken, formData, onReset }: ConfirmationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-xs max-w-xl mx-auto text-center space-y-6">
      {/* Concentric Green Circle Success Indicator per Design.md */}
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-emerald-100/60 animate-ping opacity-25" />
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
          <CheckCircleIcon size={44} weight="fill" />
        </div>
      </div>

      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider mb-2">
          <ShieldCheckIcon size={14} weight="bold" />
          <span>Status: Submitted for Screening</span>
        </span>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Appointment Request Submitted</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1.5">
          Your request has been routed to the receptionist desk for preliminary screening and host officer schedule coordination.
        </p>
      </div>

      {/* Tracking Token Card */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-left space-y-3">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <span className="text-xs text-gray-500 font-medium">Tracking Reference Pass:</span>
          <span className="font-mono font-bold text-base text-gray-900 bg-white px-2.5 py-1 rounded border border-gray-200 shadow-2xs">
            {confirmedToken}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div>
            <span className="text-gray-400 block font-normal">Visitor Name:</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
              <UserCheckIcon size={14} className="text-gray-500" />
              <span>{formData.name}</span>
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-normal">Host Officer:</span>
            <span className="font-semibold text-gray-800 block mt-0.5 truncate">
              {formData.preferredOfficer}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-normal">Target Date:</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
              <CalendarCheckIcon size={14} className="text-gray-500" />
              <span>{formData.preferredDate}</span>
            </span>
          </div>

          <div>
            <span className="text-gray-400 block font-normal">Target Slot:</span>
            <span className="font-semibold text-gray-800 block mt-0.5">
              {formData.preferredTimeSlot}
            </span>
          </div>
        </div>
      </div>

      {/* Helpful Instructions */}
      <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-lg p-3 text-left text-xs text-emerald-900 space-y-1">
        <p className="font-semibold">Next Steps in the Clearance Loop:</p>
        <ol className="list-decimal list-inside space-y-0.5 text-emerald-800">
          <li>Reception screens and verifies slot availability.</li>
          <li>Host officer reviews and grants digital security clearance.</li>
          <li>A secure QR Pass is issued and available on your tracking link.</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
        >
          <PlusCircleIcon size={16} />
          <span>New Request</span>
        </button>

        <Link
          href={`/status/${confirmedToken}`}
          className="w-full sm:flex-1 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <QrCodeIcon size={18} />
          <span>View Live Pass Status</span>
          <ArrowRightIcon size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
