import React from "react";
import { VisitorRecord } from "@/types/visitor.types";

interface VisitorRowProps {
  visitor: VisitorRecord;
  onViewPass: (visitor: VisitorRecord) => void;
  onStatusToggle: (id: string) => void;
}

export function VisitorRow({
  visitor,
  onViewPass,
  onStatusToggle,
}: VisitorRowProps) {
  const initials = visitor.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <tr className="hover:bg-neutral-50/60 transition-colors">
      {/* 1. Visitor & Organization */}
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800 border border-neutral-200">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-neutral-900">{visitor.name}</div>
            <div className="text-xs text-neutral-500">
              {visitor.organization} •{" "}
              <span className="font-mono text-[11px]">{visitor.phone}</span>
            </div>
            <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
              {visitor.passNumber}
            </div>
          </div>
        </div>
      </td>

      {/* 2. Host Officer & Dept */}
      <td className="px-6 py-4">
        <div className="font-medium text-neutral-900">{visitor.hostName}</div>
        <div className="text-xs text-neutral-500">{visitor.department}</div>
        {visitor.roomName && (
          <div className="inline-block mt-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            {visitor.roomName}
          </div>
        )}
      </td>

      {/* 3. Purpose */}
      <td className="px-6 py-4">
        <div className="max-w-xs text-xs text-neutral-700 line-clamp-2 leading-relaxed">
          {visitor.purpose}
        </div>
        {visitor.accompanyingCount > 0 && (
          <span className="text-[11px] text-neutral-500 mt-1 block">
            +{visitor.accompanyingCount} accompanying
          </span>
        )}
      </td>

      {/* 4. Time */}
      <td className="px-6 py-4 text-xs">
        <div className="font-medium text-neutral-800">{visitor.scheduledTime}</div>
        {visitor.checkInTime && (
          <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
            In: {visitor.checkInTime}
          </div>
        )}
      </td>

      {/* 5. Status */}
      <td className="px-6 py-4">
        {visitor.status === "CHECKED_IN" && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            Inside Premises
          </span>
        )}
        {visitor.status === "APPROVED" && (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-200">
            Approved (Waiting)
          </span>
        )}
        {visitor.status === "HOST_PENDING" && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
            Host Approval Pending
          </span>
        )}
        {visitor.status === "CHECKED_OUT" && (
          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 border border-neutral-200">
            Departed (Checked Out)
          </span>
        )}
        {visitor.status === "REJECTED" && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200">
            Declined
          </span>
        )}
      </td>

      {/* 6. Gate Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onViewPass(visitor)}
            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs"
            title="View Digital QR Pass"
          >
            View Pass
          </button>

          {visitor.status === "APPROVED" && (
            <button
              onClick={() => onStatusToggle(visitor.id)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 shadow-2xs"
            >
              Check In
            </button>
          )}

          {visitor.status === "CHECKED_IN" && (
            <button
              onClick={() => onStatusToggle(visitor.id)}
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 shadow-2xs"
            >
              Check Out
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
