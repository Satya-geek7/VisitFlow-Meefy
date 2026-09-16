import React from "react";
import { VisitorRecord } from "@/types/visitor";

interface EmergencyEvacuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: VisitorRecord[];
}

export function EmergencyEvacuationModal({
  isOpen,
  onClose,
  visitors,
}: EmergencyEvacuationModalProps) {
  if (!isOpen) return null;

  const insideVisitors = visitors.filter((v) => v.status === "CHECKED_IN");
  const totalOccupants = insideVisitors.reduce(
    (acc, v) => acc + 1 + (v.accompanyingCount || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 print:p-0">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl print:border-none print:shadow-none print:rounded-none">
        {/* Header with Emergency Red Alert */}
        <div className="border-b border-neutral-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 rounded-full bg-red-600 animate-ping"></span>
              <h3 className="text-lg font-extrabold tracking-tight text-red-700 uppercase">
                EMERGENCY EVACUATION MANIFEST & ROLL-CALL
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 print:hidden"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-neutral-600">
            NIELIT Bhubaneswar Campus Safety Roster • Generated on{" "}
            <span className="font-mono font-semibold">
              {new Date().toLocaleTimeString()} ({new Date().toLocaleDateString()})
            </span>
          </p>
        </div>

        {/* Headcount Stat */}
        <div className="my-4 flex flex-wrap items-center justify-between rounded-2xl bg-red-50 p-4 border border-red-200 text-red-950">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-red-700">
              Total Individuals On Campus
            </span>
            <div className="text-3xl font-extrabold">{totalOccupants} Persons</div>
          </div>
          <div className="text-right text-xs text-red-800">
            <p><strong>{insideVisitors.length}</strong> Registered Lead Visitors</p>
            <p>
              <strong>
                {insideVisitors.reduce((acc, v) => acc + (v.accompanyingCount || 0), 0)}
              </strong>{" "}
              Accompanying Guests
            </p>
          </div>
        </div>

        {/* Occupant Table */}
        <div className="max-h-96 overflow-y-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 border-b border-neutral-200 bg-neutral-100 font-semibold uppercase text-neutral-600">
              <tr>
                <th className="px-4 py-2.5">Pass #</th>
                <th className="px-4 py-2.5">Visitor Name & Phone</th>
                <th className="px-4 py-2.5">Guests</th>
                <th className="px-4 py-2.5">Host Officer & Venue</th>
                <th className="px-4 py-2.5">Check-In</th>
                <th className="px-4 py-2.5">Vehicle #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {insideVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No visitors are currently logged inside the building. Campus is clear.
                  </td>
                </tr>
              ) : (
                insideVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-mono font-bold text-neutral-800">
                      {v.passNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-neutral-900">{v.name}</div>
                      <div className="font-mono text-[11px] text-neutral-500">
                        {v.phone} • {v.organization}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      +{v.accompanyingCount}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-800">{v.hostName}</div>
                      <div className="text-[11px] text-indigo-700">{v.roomName || "Main Office"}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-700 font-semibold">
                      {v.checkInTime || "Morning"}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-600">
                      {v.vehicleNumber || "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 print:hidden">
          <span className="text-[11px] text-neutral-500">
            Use for fire marshals and security roll-call checks.
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
            >
              🖨 Print Evacuation Manifest
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
