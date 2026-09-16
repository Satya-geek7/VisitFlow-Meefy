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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 print:p-0 overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl print:border-none print:shadow-none print:rounded-none max-h-[92vh] flex flex-col my-6">
        {/* Header with Emergency Red Alert */}
        <div className="border-b border-neutral-100 pb-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="flex h-3.5 w-3.5 rounded-full bg-rose-600 animate-ping"></span>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-rose-700 uppercase">
                EMERGENCY EVACUATION MANIFEST & ROLL-CALL
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 print:hidden"
            >
              ✕
            </button>
          </div>
          <p className="mt-1.5 text-xs text-neutral-500">
            NIELIT Bhubaneswar Campus Safety Roster • Generated on{" "}
            <span className="font-mono font-semibold text-neutral-800">
              {new Date().toLocaleTimeString()} ({new Date().toLocaleDateString()})
            </span>
          </p>
        </div>

        {/* Headcount Stat Card */}
        <div className="my-5 flex flex-wrap items-center justify-between rounded-2xl bg-rose-50/80 p-5 border border-rose-200 text-rose-950 shrink-0 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-700">
              Total Individuals Currently Inside Facility
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{totalOccupants} Persons</div>
          </div>
          <div className="text-right text-xs text-rose-800 space-y-0.5">
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
        <div className="flex-1 overflow-y-auto rounded-2xl border border-neutral-200 min-h-[160px]">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="sticky top-0 border-b border-neutral-200 bg-neutral-100/90 backdrop-blur-xs font-bold uppercase text-[11px] tracking-wider text-neutral-600">
              <tr>
                <th className="px-5 py-3.5">Pass #</th>
                <th className="px-5 py-3.5">Visitor Name & Contact</th>
                <th className="px-5 py-3.5">Guests</th>
                <th className="px-5 py-3.5">Host Officer & Venue</th>
                <th className="px-5 py-3.5">Check-In</th>
                <th className="px-5 py-3.5">Vehicle #</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {insideVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-500 font-medium">
                    No visitors are currently logged inside the building. Campus is clear.
                  </td>
                </tr>
              ) : (
                insideVisitors.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50/80">
                    <td className="px-5 py-3.5 font-mono font-bold text-neutral-900">
                      {v.passNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-neutral-900 text-sm">{v.name}</div>
                      <div className="font-mono text-[11px] text-neutral-500 font-medium">
                        {v.phone} • {v.organization}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-neutral-800">
                      +{v.accompanyingCount}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-neutral-900">{v.hostName}</div>
                      <div className="text-[11px] font-medium text-indigo-700">{v.roomName || "Main Office"}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-emerald-700 font-bold">
                      {v.checkInTime || "Morning"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-neutral-600">
                      {v.vehicleNumber || "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 print:hidden shrink-0">
          <span className="text-xs text-neutral-500 font-medium">
            Emergency roll-call document formatted for rapid fire warden printing.
          </span>
          <div className="flex space-x-2.5">
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all active:scale-[0.98]"
            >
              🖨 Print Evacuation Manifest
            </button>
            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
