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
    onRejectRequest(rejectVisitorId, rejectReason || "Incomplete visitor information or conflict.");
    setRejectVisitorId(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-950">
              Receptionist Request Screening & Scheduling Queue
            </h2>
            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
              {pendingRequests.length} Pending Review
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Screen public and pre-registered visit requests, verify credentials, and schedule calendar slots against officer availability
          </p>
        </div>
      </div>

      {/* Queue Cards */}
      {pendingRequests.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center text-neutral-500">
          <svg className="mx-auto h-8 w-8 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="mt-2 text-sm font-medium text-neutral-800">
            Screening queue is all clear!
          </p>
          <p className="text-xs text-neutral-400">
            No incoming public visit requests requiring receptionist screening.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-semibold text-neutral-500">
                      {req.passNumber}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-neutral-950">
                      {req.name}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {req.organization} • <span className="font-mono">{req.phone}</span>
                    </p>
                  </div>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200">
                    Needs Screening
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3.5 text-xs border border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Requested Officer:</span>
                    <span className="font-semibold text-neutral-900">{req.hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Target Department:</span>
                    <span className="font-medium text-neutral-800">{req.department}</span>
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

                <div className="mt-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Purpose Statement:
                  </span>
                  <p className="mt-1 text-xs text-neutral-700 leading-relaxed italic">
                    &ldquo;{req.purpose}&rdquo;
                  </p>
                  {req.notes && (
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Note: {req.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end space-x-2 border-t border-neutral-100 pt-3">
                <button
                  onClick={() => setRejectVisitorId(req.id)}
                  className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-red-600 shadow-2xs transition-colors"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => handleOpenSchedule(req)}
                  className="rounded-lg bg-neutral-950 px-4 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 shadow-xs transition-colors"
                >
                  Screen & Schedule Slot →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screen & Schedule Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-950">
                  Assign Officer Slot & Room
                </h3>
                <p className="text-xs text-neutral-500">
                  Screening visitor: <span className="font-semibold text-neutral-800">{selectedVisitor.name}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Assign Officer (Host)
                </label>
                <select
                  value={assignedOfficerId}
                  onChange={(e) => setAssignedOfficerId(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {INITIAL_OFFICERS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — {o.designation} ({o.departmentName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Confirmed Meeting Slot
                </label>
                <select
                  value={assignedSlot}
                  onChange={(e) => setAssignedSlot(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  <option value="10:30 AM - 11:30 AM">10:30 AM - 11:30 AM (Available)</option>
                  <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM (Available)</option>
                  <option value="02:30 PM - 03:30 PM">02:30 PM - 03:30 PM (Available)</option>
                  <option value="03:30 PM - 04:30 PM">03:30 PM - 04:30 PM (Available)</option>
                  <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM (Available)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Designated Meeting Room / Venue
                </label>
                <select
                  value={assignedRoom}
                  onChange={(e) => setAssignedRoom(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                >
                  {INITIAL_ROOMS.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name} ({r.location}) — Capacity: {r.capacity} seats
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-3 text-blue-900 border border-blue-100">
                <p className="font-semibold">Next Step in Workflow:</p>
                <p className="mt-0.5 text-[11px] text-blue-700">
                  Submitting moves this request to <span className="font-mono font-bold">HOST_PENDING</span>.
                  The host officer will immediately receive a dashboard alert to Accept or Decline with 1 click.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedVisitor(null)}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSchedule}
                  className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Reject Visit Request
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Please specify the official reason for turning down this visit request.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Officer unavailable on proposed date, inquiry redirected to general email..."
              className="mt-4 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs focus:outline-none focus:border-neutral-900"
            />

            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                onClick={() => setRejectVisitorId(null)}
                className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-medium text-white hover:bg-rose-700 shadow-xs"
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
