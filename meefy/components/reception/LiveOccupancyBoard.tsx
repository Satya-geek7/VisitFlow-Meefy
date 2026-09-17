import React, { useState, useMemo } from "react";
import { VisitorRecord } from "@/types/visitor";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getInitials } from "@/lib/utils";

interface LiveOccupancyBoardProps {
  visitors: VisitorRecord[];
  onViewPass: (visitor: VisitorRecord) => void;
  onStatusToggle: (id: string) => void;
  onOpenRollCall: () => void;
  onOpenScanner: () => void;
}

export function LiveOccupancyBoard({
  visitors,
  onViewPass,
  onStatusToggle,
  onOpenRollCall,
  onOpenScanner,
}: LiveOccupancyBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CHECKED_IN" | "UPCOMING" | "HISTORY">("ALL");

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        v.name.toLowerCase().includes(q) ||
        v.organization.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q) ||
        v.passNumber.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q);

      const matchesDept =
        departmentFilter === "ALL" || v.department === departmentFilter;

      let matchesStatus = true;
      if (statusFilter === "CHECKED_IN") {
        matchesStatus = v.status === "CHECKED_IN";
      } else if (statusFilter === "UPCOMING") {
        matchesStatus = v.status === "APPROVED" || v.status === "PASS_ISSUED" || v.status === "HOST_PENDING";
      } else if (statusFilter === "HISTORY") {
        matchesStatus = v.status === "CHECKED_OUT" || v.status === "REJECTED" || v.status === "DECLINED";
      }

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [visitors, searchQuery, departmentFilter, statusFilter]);

  const currentlyInsideCount = useMemo(
    () => visitors.filter((v) => v.status === "CHECKED_IN").length,
    [visitors]
  );

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by visitor name, pass #, phone, organization, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 py-3 pl-11 pr-10 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters and Emergency Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-neutral-700 shadow-2xs focus:border-neutral-900 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Executive Directorate">Executive Directorate</option>
            <option value="Software & Training Div">Software & Training Div</option>
            <option value="Hardware & Networking">Hardware & Networking</option>
            <option value="Academics & Research">Academics & Research</option>
            <option value="Administration & Stores">Administration & Stores</option>
          </select>

          {/* Status Pills */}
          <div className="flex rounded-2xl border border-neutral-200 bg-neutral-50/80 p-1 text-xs font-medium">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                statusFilter === "ALL"
                  ? "bg-white text-neutral-950 font-semibold shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("CHECKED_IN")}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                statusFilter === "CHECKED_IN"
                  ? "bg-white text-neutral-950 font-bold shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Inside ({currentlyInsideCount})
            </button>
            <button
              onClick={() => setStatusFilter("UPCOMING")}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                statusFilter === "UPCOMING"
                  ? "bg-white text-neutral-950 font-semibold shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Expected
            </button>
            <button
              onClick={() => setStatusFilter("HISTORY")}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                statusFilter === "HISTORY"
                  ? "bg-white text-neutral-950 font-semibold shadow-2xs"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              History
            </button>
          </div>

          {/* Emergency Roll-Call */}
          <button
            onClick={onOpenRollCall}
            className="inline-flex items-center space-x-2 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all shadow-2xs active:scale-[0.98]"
            title="Export real-time headcount for fire warden or safety audit"
          >
            <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Emergency Roll-Call</span>
          </button>
        </div>
      </div>

      {/* Ledger Table Container */}
      <div className="overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 px-6 sm:px-8 py-5 gap-2">
          <div>
            <h2 className="text-base font-bold tracking-tight text-neutral-950">
              Campus Visitor Operations Ledger
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live facility access log with real-time pass validation and gate check-out
            </p>
          </div>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-mono font-medium text-neutral-600">
            {filteredVisitors.length} record{filteredVisitors.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="border-b border-neutral-100 bg-neutral-50/40 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-6 sm:px-8 py-4">Visitor & ID</th>
                <th className="px-6 py-4">Host Officer & Venue</th>
                <th className="px-6 py-4">Purpose & Agenda</th>
                <th className="px-6 py-4">Timings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 sm:px-8 py-4 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-neutral-400">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
                      🔍
                    </div>
                    No visitor records found matching your query or filters.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => {
                  const initials = getInitials(v.name);
                  return (
                    <tr key={v.id} className="hover:bg-neutral-50/70 transition-colors">
                      {/* 1. Visitor Details */}
                      <td className="px-6 sm:px-8 py-4.5">
                        <div className="flex items-center space-x-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-xs font-black text-neutral-800 border border-neutral-200/80 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900 tracking-tight">{v.name}</div>
                            <div className="text-xs text-neutral-500 font-medium">
                              {v.organization} •{" "}
                              <span className="font-mono text-[11px] text-neutral-600">{v.phone}</span>
                            </div>
                            <div className="mt-0.5 flex items-center space-x-1.5 text-[11px] font-mono text-neutral-400">
                              <span className="font-semibold text-neutral-500">{v.passNumber}</span>
                              <span>•</span>
                              <span>{v.idType} ({v.idNumberMasked})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Host Officer & Room */}
                      <td className="px-6 py-4.5">
                        <div className="font-semibold text-neutral-900">{v.hostName}</div>
                        <div className="text-xs text-neutral-500">{v.department}</div>
                        <div className="mt-1 flex items-center space-x-2">
                          {v.roomName && (
                            <span className="inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                              📍 {v.roomName}
                            </span>
                          )}
                          {v.vehicleNumber && (
                            <span className="font-mono text-[10px] text-neutral-400">
                              🚗 {v.vehicleNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Purpose */}
                      <td className="px-6 py-4.5">
                        <div className="max-w-xs text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                          {v.purpose}
                        </div>
                        {v.accompanyingCount > 0 && (
                          <span className="mt-1 inline-block text-[11px] font-medium text-neutral-500">
                            +{v.accompanyingCount} accompanying guest{v.accompanyingCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </td>

                      {/* 4. Timing */}
                      <td className="px-6 py-4.5 text-xs">
                        <div className="font-medium text-neutral-800">{v.scheduledTime}</div>
                        {v.checkInTime && (
                          <div className="mt-0.5 font-semibold text-emerald-700">
                            In: {v.checkInTime}
                          </div>
                        )}
                        {v.checkOutTime && (
                          <div className="mt-0.5 font-medium text-neutral-400">
                            Out: {v.checkOutTime}
                          </div>
                        )}
                      </td>

                      {/* 5. Status */}
                      <td className="px-6 py-4.5">
                        <StatusBadge status={v.status} size="sm" />
                      </td>

                      {/* 6. Gate Action */}
                      <td className="px-6 sm:px-8 py-4.5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewPass(v)}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 shadow-2xs transition-all active:scale-[0.98]"
                            title="View Official Digital QR Pass"
                          >
                            QR Pass
                          </button>

                          {(v.status === "APPROVED" || v.status === "PASS_ISSUED") && (
                            <button
                              onClick={() => onStatusToggle(v.id)}
                              className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-2xs transition-all active:scale-[0.98]"
                            >
                              Check In
                            </button>
                          )}

                          {v.status === "CHECKED_IN" && (
                            <button
                              onClick={() => onStatusToggle(v.id)}
                              className="rounded-xl bg-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 shadow-2xs transition-all active:scale-[0.98]"
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
