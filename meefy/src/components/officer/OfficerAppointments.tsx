import React, { useState, useMemo } from "react";
import { VisitorRecord } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";

interface OfficerAppointmentsProps {
  visitors: VisitorRecord[];
  onOpenScheduleModal: () => void;
  onViewPass: (visitor: VisitorRecord) => void;
  onCheckIn: (id: string) => void;
}

export function OfficerAppointments({
  visitors,
  onOpenScheduleModal,
  onViewPass,
  onCheckIn,
}: OfficerAppointmentsProps) {
  const [selectedOfficer, setSelectedOfficer] = useState<string>("ALL");

  const scheduledVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const isUpcoming =
        v.status === "APPROVED" ||
        v.status === "PASS_ISSUED" ||
        v.status === "CHECKED_IN";
      const matchesOfficer =
        selectedOfficer === "ALL" || v.hostName.includes(selectedOfficer);
      return isUpcoming && matchesOfficer;
    });
  }, [visitors, selectedOfficer]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-950">
            Officer Appointments & Daily Agenda
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Confirmed visitor arrivals, allocated discussion venues, and campus gate check-in status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedOfficer}
            onChange={(e) => setSelectedOfficer(e.target.value)}
            className="rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 shadow-2xs focus:border-neutral-900 focus:outline-none"
          >
            <option value="ALL">All Officers (Center View)</option>
            {INITIAL_OFFICERS.map((o) => (
              <option key={o.id} value={o.name}>
                {o.name} ({o.departmentName})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenScheduleModal}
            className="rounded-2xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
          >
            + New Appointment
          </button>
        </div>
      </div>

      {/* Grid of appointments */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scheduledVisitors.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-neutral-200/90 bg-white p-16 text-center text-sm text-neutral-400 shadow-xs">
            No upcoming or confirmed appointments found for this selection today.
          </div>
        ) : (
          scheduledVisitors.map((v) => (
            <div
              key={v.id}
              className="flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-semibold text-neutral-400">
                    {v.passNumber}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      v.status === "CHECKED_IN"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {v.status === "CHECKED_IN" ? "Inside Campus" : "Pass Issued"}
                  </span>
                </div>

                <h3 className="mt-2.5 text-base font-bold tracking-tight text-neutral-950">
                  {v.name}
                </h3>
                <p className="text-xs text-neutral-500 font-medium">{v.organization}</p>

                <div className="mt-5 space-y-2 rounded-2xl bg-neutral-50/80 p-3.5 text-xs text-neutral-700 border border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Host:</span>
                    <span className="font-bold text-neutral-900">{v.hostName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Slot:</span>
                    <span className="font-medium text-neutral-900">{v.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Venue:</span>
                    <span className="font-bold text-indigo-700">{v.roomName || "Main Office"}</span>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-neutral-600 line-clamp-2 italic leading-relaxed">
                  &ldquo;{v.purpose}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-2.5 border-t border-neutral-100 pt-4">
                <button
                  onClick={() => onViewPass(v)}
                  className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-all"
                >
                  Digital Pass
                </button>
                {v.status !== "CHECKED_IN" && (
                  <button
                    onClick={() => onCheckIn(v.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs transition-all active:scale-[0.98]"
                  >
                    Check In Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
