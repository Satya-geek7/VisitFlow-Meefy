import React from "react";

interface VisitorMetricsProps {
  activeInsideCount: number;
  totalExpectedToday: number;
  pendingApprovalsCount: number;
  occupiedRoomsCount: number;
  totalRoomsCount: number;
}

export function VisitorMetrics({
  activeInsideCount,
  totalExpectedToday,
  pendingApprovalsCount,
  occupiedRoomsCount,
  totalRoomsCount,
}: VisitorMetricsProps) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Currently Inside */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Currently Inside
          </span>
          <span className="flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative h-2 w-2 rounded-full bg-emerald-600"></span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-950">
            {activeInsideCount}
          </span>
          <span className="text-xs text-neutral-500">active passes</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2.5">
          <span>Safety Roll-call active</span>
          <span className="font-medium text-emerald-600">All logged in</span>
        </div>
      </div>

      {/* 2. Expected Today */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Expected Today
          </span>
          <svg
            className="h-4 w-4 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-950">
            {totalExpectedToday}
          </span>
          <span className="text-xs text-neutral-500">total visitors</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2.5">
          <span>Advance & Walk-ins</span>
          <span className="font-medium text-neutral-700">92% on-time</span>
        </div>
      </div>

      {/* 3. Awaiting Host */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Awaiting Host
          </span>
          {pendingApprovalsCount > 0 ? (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
              Needs Action
            </span>
          ) : (
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              Clear
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-950">
            {pendingApprovalsCount}
          </span>
          <span className="text-xs text-neutral-500">pending requests</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2.5">
          <span>Avg response</span>
          <span className="font-medium text-neutral-700">~2.4 mins</span>
        </div>
      </div>

      {/* 4. Rooms & Halls */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Rooms & Halls
          </span>
          <span className="text-xs font-semibold text-neutral-500">Utilization</span>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-neutral-950">
            {occupiedRoomsCount}/{totalRoomsCount}
          </span>
          <span className="text-xs text-neutral-500">in session</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-2.5">
          <span>Active sessions</span>
          <span className="font-medium text-emerald-600">
            {totalRoomsCount - occupiedRoomsCount} Available
          </span>
        </div>
      </div>
    </section>
  );
}
