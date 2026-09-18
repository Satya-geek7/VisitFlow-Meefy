import React, { useState } from "react";
import { VisitorRecord } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_ROOMS } from "@/data/rooms";

interface ScreeningQueueProps {
  visitors: VisitorRecord[];
  onScreenAndSchedule: (
    id: string,
    officerName: string,
    department: string,
    slotTime: string,
    roomName: string
  ) => void;
  onRejectRequest: (id: string, reason: string) => void;
}

export function ScreeningQueue({
  visitors,
  onScreenAndSchedule,
  onRejectRequest,
}: ScreeningQueueProps) {
  const pendingRequests = visitors.filter((v) => v.status === "SUBMITTED");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);

  // Scheduling dialog form
  const [assignedOfficerId, setAssignedOfficerId] = useState(INITIAL_OFFICERS[0].id);
  const [assignedSlot, setAssignedSlot] = useState("02:30 PM - 03:30 PM");
  const [assignedRoom, setAssignedRoom] = useState(INITIAL_ROOMS[0].name);

  // Reject dialog
  const [rejectVisitorId, setRejectVisitorId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleOpenSchedule = (visitor: VisitorRecord) => {
    setSelectedVisitor(visitor);
    const matchedOfficer = INITIAL_OFFICERS.find((o) => o.name.includes(visitor.hostName)) || INITIAL_OFFICERS[0];
    setAssignedOfficerId(matchedOfficer.id);
  };

  const handleConfirmSchedule = () => {
    if (!selectedVisitor) return;
    const officer = INITIAL_OFFICERS.find((o) => o.id === assignedOfficerId) || INITIAL_OFFICERS[0];
    onScreenAndSchedule(
      selectedVisitor.id,
      officer.name,
      officer.departmentName,
      assignedSlot,
      assignedRoom
    );
    setSelectedVisitor(null);
  };

  const handleConfirmReject = () => {
    if (!rejectVisitorId) return;
    onRejectRequest(rejectVisitorId, rejectReason || "Incomplete visitor details or schedule conflict.");
    setRejectVisitorId(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-lg font-bold tracking-tight text-neutral-950">
              Request Screening & Slot Scheduling Queue
            </h2>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
              {pendingRequests.length} Pending Review
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 max-w-2xl leading-relaxed">
            Screen incoming visit requests, verify government ID credentials, and allocate calendar slots against officer availability
          </p>
        </div>
      </div>

      {/* Queue Cards */}
      {pendingRequests.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-16 text-center text-neutral-500 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-3 text-xl">
            ✓
          </div>
          <p className="text-base font-bold text-neutral-900">
            Screening queue is completely clear!
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            All public visit requests have been reviewed and forwarded for host approval.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-neutral-400">
                      {req.passNumber}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-neutral-950">
                      {req.name}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {req.organization} • <span className="font-mono font-medium">{req.phone}</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-700 border border-purple-200">
                    Needs Screening
                  </span>
                </div>

                <div className="mt-5 space-y-2.5 rounded-2xl bg-neutral-50/80 p-4 text-xs border border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Requested Officer:</span>
                    <span className="font-bold text-neutral-900">{req.hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Target Department:</span>
                    <span className="font-semibold text-neutral-800">{req.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Preferred Slot:</span>
                    <span className="font-medium text-neutral-800">{req.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Official ID:</span>
                    <span className="font-mono text-neutral-700">{req.idType} ({req.idNumberMasked})</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Visit Purpose:
                  </span>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed italic bg-white p-2.5 rounded-xl border border-neutral-100">
                    &ldquo;{req.purpose}&rdquo;
                  </p>
                  {req.notes && (
                    <p className="mt-1.5 text-[11px] text-neutral-500">
                      <strong>Note:</strong> {req.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3 border-t border-neutral-100 pt-4">
                <button
                  onClick={() => setRejectVisitorId(req.id)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-rose-600 shadow-2xs transition-all active:scale-[0.98]"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => handleOpenSchedule(req)}
                  className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 shadow-xs transition-all active:scale-[0.98]"
                >
                  Screen & Assign Slot →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screen & Schedule Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-950">
                  Assign Officer Slot & Room
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Screening visitor: <span className="font-semibold text-neutral-800">{selectedVisitor.name}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Assign Host Officer
                </label>
                <select
                  value={assignedOfficerId}
                  onChange={(e) => setAssignedOfficerId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {INITIAL_OFFICERS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — {o.designation} ({o.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Confirmed Meeting Slot
                </label>
                <select
                  value={assignedSlot}
                  onChange={(e) => setAssignedSlot(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM (Free)</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM (Free)</option>
                  <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM (Free)</option>
                  <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM (Free)</option>
                  <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Free)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Designated Meeting Room / Venue
                </label>
                <select
                  value={assignedRoom}
                  onChange={(e) => setAssignedRoom(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {INITIAL_ROOMS.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.location}) — Capacity: {r.capacity} seats
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-blue-50/80 p-4 text-blue-900 border border-blue-100">
                <p className="font-bold">Automated Notification Dispatch:</p>
                <p className="mt-1 text-[11px] text-blue-700 leading-relaxed">
                  Submitting moves this appointment to <strong className="font-mono">HOST_PENDING</strong>.
                  The host officer will immediately receive an alert to Accept or Decline with 1 click.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-neutral-100 pt-5">
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSchedule}
                  className="rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800"
                >
                  Confirm & Dispatch to Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {rejectVisitorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Reject Visit Request
            </h3>
            <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
              Please specify the official reason for turning down this visit request.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Officer unavailable on proposed date, non-official inquiry redirected..."
              className="mt-4 w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs focus:outline-none focus:border-neutral-900"
            />

            <div className="mt-5 flex items-center justify-end space-x-3">
              <button
                onClick={() => setRejectVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
