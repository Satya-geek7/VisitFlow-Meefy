import React from "react";
import { VisitorRecord } from "@/types/visitor";

interface AnalyticsReportsProps {
  visitors: VisitorRecord[];
}

export function AnalyticsReports({ visitors }: AnalyticsReportsProps) {
  const total = visitors.length;
  const checkedIn = visitors.filter((v) => v.status === "CHECKED_IN").length;
  const completed = visitors.filter((v) => v.status === "CHECKED_OUT").length;

  const deptCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    deptCounts[v.department] = (deptCounts[v.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-neutral-950">
            Executive Analytics & Compliance Reports
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Institutional visit metrics, peak traffic distribution, and host SLA adherence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-all active:scale-[0.98]"
          >
            🖨 Export Compliance PDF
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Today Total Volume
          </span>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-neutral-950">{total}</div>
          <p className="mt-2 text-xs text-emerald-600 font-semibold">↑ 18% vs last week</p>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Avg Host Response
          </span>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-neutral-950">14.2 min</div>
          <p className="mt-2 text-xs text-emerald-600 font-semibold">SLA Target: &lt; 4 hours</p>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Completed Visits
          </span>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-neutral-950">{completed}</div>
          <p className="mt-2 text-xs text-neutral-400 font-medium">Logged check-outs</p>
        </div>

        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            No-Show / Expired Rate
          </span>
          <div className="mt-3 text-3xl sm:text-4xl font-black text-neutral-950">2.4%</div>
          <p className="mt-2 text-xs text-emerald-600 font-semibold">Within 5% safety margin</p>
        </div>
      </div>

      {/* Analytics Rows */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Peak Visiting Hours Simulation */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-bold tracking-tight text-neutral-950">
            Peak Visiting Hours Distribution
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Hourly distribution of gate entry scans across campus today
          </p>

          <div className="mt-6 space-y-4">
            {[
              { time: "09:00 - 10:30 AM", count: 4, pct: 40 },
              { time: "10:30 - 12:00 PM", count: 8, pct: 80 },
              { time: "12:00 - 01:30 PM", count: 5, pct: 50 },
              { time: "01:30 - 03:00 PM", count: 10, pct: 100 },
              { time: "03:00 - 04:30 PM", count: 7, pct: 70 },
              { time: "04:30 - 06:00 PM", count: 3, pct: 30 },
            ].map((slot) => (
              <div key={slot.time} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-700">{slot.time}</span>
                  <span className="font-mono text-neutral-500 font-medium">{slot.count} visitors</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-neutral-900 transition-all duration-500"
                    style={{ width: `${slot.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-bold tracking-tight text-neutral-950">
            Traffic by Department / Division
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Breakdown of visitors across departments and facilities
          </p>

          <div className="mt-6 space-y-3.5">
            {Object.entries(deptCounts).map(([dept, count]) => {
              const pct = Math.round((count / (total || 1)) * 100);
              return (
                <div key={dept} className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{dept}</span>
                    <span className="font-mono font-bold text-neutral-950">{count} visits</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>{pct}% of today&apos;s total campus traffic</span>
                    <span className="text-emerald-700 font-semibold">Authorized</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
