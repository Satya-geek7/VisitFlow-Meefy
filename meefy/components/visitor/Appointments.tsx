import React from "react";
import { VisitorRecord } from "@/types/visitor.types";

interface AppointmentsProps {
  visitors: VisitorRecord[];
  onOpenScheduleModal: () => void;
  onViewPass: (visitor: VisitorRecord) => void;
  onCheckIn: (id: string) => void;
}

export function Appointments({
  visitors,
  onOpenScheduleModal,
  onViewPass,
  onCheckIn,
}: AppointmentsProps) {
  const scheduledVisitors = visitors.filter(
    (v) => v.status === "APPROVED" || v.status === "PENDING_APPROVAL"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Advance Appointment Management
          </h2>
          <p className="text-xs text-neutral-500">
            Official visitors scheduled with NIELIT Bhubaneswar departments
          </p>
        </div>
        <button
          onClick={onOpenScheduleModal}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition-colors"
        >
          + Schedule New Visit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scheduledVisitors.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-neutral-200 bg-white p-12 text-center text-sm text-neutral-500">
            No upcoming appointments scheduled.
          </div>
        ) : (
          scheduledVisitors.map((v) => (
            <div
              key={v.id}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-semibold text-neutral-500">
                    {v.passNumber}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                      v.status === "APPROVED"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {v.status === "APPROVED" ? "Approved" : "Awaiting Host"}
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-neutral-900">
                  {v.name}
                </h3>
                <p className="text-xs text-neutral-500">{v.organization}</p>

                <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-700 border border-neutral-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Host:</span>
                    <span className="font-medium text-neutral-900">
                      {v.hostName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Department:</span>
                    <span className="font-medium text-neutral-900">
                      {v.department}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Slot:</span>
                    <span className="font-medium text-neutral-900">
                      {v.scheduledTime}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-600 line-clamp-2 italic">
                  &ldquo;{v.purpose}&rdquo;
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end space-x-2 border-t border-neutral-100 pt-3">
                <button
                  onClick={() => onViewPass(v)}
                  className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs"
                >
                  Digital Pass
                </button>
                {v.status === "APPROVED" && (
                  <button
                    onClick={() => onCheckIn(v.id)}
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 shadow-2xs"
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
