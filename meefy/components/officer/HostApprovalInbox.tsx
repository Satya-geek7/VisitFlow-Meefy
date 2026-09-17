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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg font-bold tracking-tight text-neutral-950">
              Host Decision & Approvals Inbox
            </h2>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
              {pendingApprovals.length} Awaiting Decision
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 max-w-2xl leading-relaxed">
            Instant decision workflow for NIELIT officers: Accept meeting, issue digital pass, decline with reason, or delegate to department colleague
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-600 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200/80">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>4-Hour SLA Guard Active</span>
        </div>
      </div>

      {/* Cards */}
      {pendingApprovals.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-16 text-center text-neutral-500 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3 text-xl">
            ✓
          </div>
          <p className="text-base font-bold text-neutral-900">
            All pending approvals are cleared!
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            No meeting requests currently awaiting your confirmation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map((v) => (
            <div
              key={v.id}
              className="flex flex-col gap-5 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-neutral-950 text-base">{v.name}</span>
                  <span className="rounded-lg bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 font-medium">
                    {v.organization}
                  </span>
                  <span className="font-mono text-xs text-neutral-400">
                    {v.passNumber}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                    SLA: ~3h remaining
                  </span>
                </div>

                <p className="text-xs text-neutral-600">
                  Meeting Requested With:{" "}
                  <strong className="text-neutral-900">{v.hostName}</strong> (
                  {v.department})
                </p>

                <div className="rounded-2xl bg-neutral-50/80 p-3.5 text-xs text-neutral-700 border border-neutral-100 max-w-2xl leading-relaxed">
                  <span className="font-bold text-neutral-500 uppercase text-[10px] tracking-wider block mb-0.5">
                    Agenda:
                  </span>
                  <span className="italic text-neutral-800">&ldquo;{v.purpose}&rdquo;</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 pt-1">
                  <span>📅 Slot: <strong className="text-neutral-800">{v.scheduledTime}</strong></span>
                  <span>•</span>
                  <span>📍 Venue: <strong className="text-neutral-800">{v.roomName || "Main Office"}</strong></span>
                  <span>•</span>
                  <span>ID: <strong className="font-mono text-neutral-700">{v.idType} ({v.idNumberMasked})</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                <button
                  onClick={() => setDeclineVisitorId(v.id)}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-rose-600 shadow-2xs transition-all active:scale-[0.98]"
                >
                  Decline
                </button>
                <button
                  onClick={() => setDelegateVisitorId(v.id)}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-all active:scale-[0.98]"
                >
                  Delegate ↗
                </button>
                <button
                  onClick={() => onHostAction(v.id, "APPROVE")}
                  className="rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Decline Visit Request
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Provide an optional note to accompany the email notification to the guest.
            </p>

            <textarea
              rows={3}
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g. Officer attending urgent center review. Please reschedule for next week..."
              className="mt-4 w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs focus:outline-none focus:border-neutral-900"
            />

            <div className="mt-5 flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeclineVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecline}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delegate Modal */}
      {delegateVisitorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Delegate Meeting to Colleague
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Select an available officer in NIELIT Bhubaneswar to take over this meeting.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                New Host Officer
              </label>
              <select
                value={delegateHost}
                onChange={(e) => setDelegateHost(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs focus:outline-none focus:border-neutral-900"
              >
                {INITIAL_OFFICERS.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setDelegateVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelegate}
                className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-bold text-white hover:bg-neutral-800 shadow-xs"
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
