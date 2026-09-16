import React, { useState } from "react";
import { VisitorRecord } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";

interface HostApprovalInboxProps {
  visitors: VisitorRecord[];
  onHostAction: (id: string, action: "APPROVE" | "REJECT", reason?: string) => void;
  onDelegateAction: (id: string, newHostName: string) => void;
}

export function HostApprovalInbox({
  visitors,
  onHostAction,
  onDelegateAction,
}: HostApprovalInboxProps) {
  const pendingApprovals = visitors.filter((v) => v.status === "HOST_PENDING");

  const [declineVisitorId, setDeclineVisitorId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const [delegateVisitorId, setDelegateVisitorId] = useState<string | null>(null);
  const [delegateHost, setDelegateHost] = useState(INITIAL_OFFICERS[1].name);

  const handleConfirmDecline = () => {
    if (!declineVisitorId) return;
    onHostAction(declineVisitorId, "REJECT", declineReason || "Host unavailable at scheduled time.");
    setDeclineVisitorId(null);
    setDeclineReason("");
  };

  const handleConfirmDelegate = () => {
    if (!delegateVisitorId) return;
    onDelegateAction(delegateVisitorId, delegateHost);
    setDelegateVisitorId(null);
  };

  return (
    <div className="space-y-6">
      {/* Inbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-950">
              Host Officer Decision & Approvals Inbox
            </h2>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
              {pendingApprovals.length} Awaiting Decision
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            One-click authorizations for officer appointments, delegation, and official visitor pass issuance
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-neutral-500">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>4-Hour SLA Escalation Guard Active</span>
        </div>
      </div>

      {/* Cards */}
      {pendingApprovals.length === 0 ? (
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
          <p className="mt-2 text-sm font-semibold text-neutral-800">
            All pending approvals cleared!
          </p>
          <p className="text-xs text-neutral-400">
            No meeting requests currently awaiting host confirmation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between hover:border-neutral-300 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-neutral-950 text-sm">{v.name}</span>
                  <span className="rounded-lg bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 font-medium">
                    {v.organization}
                  </span>
                  <span className="font-mono text-[11px] text-neutral-400">
                    {v.passNumber}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
                    SLA: 3h 15m left
                  </span>
                </div>

                <p className="text-xs text-neutral-600">
                  Meeting Requested With:{" "}
                  <span className="font-semibold text-neutral-900">{v.hostName}</span> (
                  {v.department})
                </p>

                <div className="rounded-xl bg-neutral-50 p-2.5 text-xs text-neutral-700 border border-neutral-100 max-w-2xl">
                  <span className="font-medium text-neutral-500">Purpose: </span>
                  <span className="text-neutral-900 italic">&ldquo;{v.purpose}&rdquo;</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-0.5">
                  <span>📅 Slot: <strong className="text-neutral-800">{v.scheduledTime}</strong></span>
                  <span>•</span>
                  <span>📍 Venue: <strong className="text-neutral-800">{v.roomName || "Main Office"}</strong></span>
                  <span>•</span>
                  <span>ID: <strong className="font-mono text-neutral-700">{v.idType} ({v.idNumberMasked})</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                <button
                  onClick={() => setDeclineVisitorId(v.id)}
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-red-600 shadow-2xs transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => setDelegateVisitorId(v.id)}
                  className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors"
                >
                  Delegate ↗
                </button>
                <button
                  onClick={() => onHostAction(v.id, "APPROVE")}
                  className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition-colors"
                >
                  Accept & Issue Pass
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decline Reason Modal */}
      {declineVisitorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Decline Visit Request
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Provide an optional decline note to accompany the email/SMS notification to the guest.
            </p>

            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Officer attending urgent center review. Please reschedule for next week..."
              className="mt-4 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs focus:outline-none focus:border-neutral-900"
            />

            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeclineVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 shadow-xs"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delegate Modal */}
      {delegateVisitorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Delegate Meeting to Colleague
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Select an available officer in the center to take over this visitor meeting.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                New Host Officer
              </label>
              <select
                value={delegateHost}
                onChange={(e) => setDelegateHost(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs focus:outline-none focus:border-neutral-900"
              >
                {INITIAL_OFFICERS.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDelegateVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelegate}
                className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 shadow-xs"
              >
                Transfer Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
