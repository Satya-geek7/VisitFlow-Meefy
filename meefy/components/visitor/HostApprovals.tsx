import React from "react";
import { VisitorRecord } from "@/types/visitor.types";

interface HostApprovalsProps {
  visitors: VisitorRecord[];
  onHostAction: (id: string, action: "APPROVE" | "REJECT") => void;
}

export function HostApprovals({ visitors, onHostAction }: HostApprovalsProps) {
  const pendingVisitors = visitors.filter((v) => v.status === "PENDING_APPROVAL");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <h2 className="text-base font-bold text-neutral-950">
          Host Decision & Approval Inbox
        </h2>
        <p className="text-xs text-neutral-500">
          Single-click approval workflow for officers to authorize, reschedule, or re-route upcoming visitors
        </p>
      </div>

      <div className="space-y-4">
        {pendingVisitors.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-500">
            <svg
              className="mx-auto h-8 w-8 text-neutral-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="mt-2 text-sm font-medium text-neutral-700">
              All pending approvals cleared!
            </p>
            <p className="text-xs text-neutral-400">
              No requests currently awaiting host confirmation.
            </p>
          </div>
        ) : (
          pendingVisitors.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-neutral-950">{v.name}</span>
                  <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {v.organization}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  Seeking meeting with:{" "}
                  <span className="font-medium text-neutral-900">{v.hostName}</span> (
                  {v.department})
                </p>
                <p className="text-xs text-neutral-500">
                  Purpose: <span className="text-neutral-800">{v.purpose}</span>
                </p>
                <p className="text-xs text-neutral-400 font-mono">
                  Slot: {v.scheduledTime} • ID: {v.idType} ({v.idNumberMasked})
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => onHostAction(v.id, "REJECT")}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-red-600 shadow-2xs transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => onHostAction(v.id, "APPROVE")}
                  className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition-colors"
                >
                  Accept & Issue Pass
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
