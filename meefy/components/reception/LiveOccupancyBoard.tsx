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
    <div className="space-y-4">
      {/* Controls & Emergency Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
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
            placeholder="Search by visitor name, pass #, phone, organization, or host officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-2xs focus:border-neutral-900 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Executive Directorate">Executive Directorate</option>
            <option value="Software & Training Div">Software & Training Div</option>
            <option value="Hardware & Networking">Hardware & Networking</option>
            <option value="Academics & Research">Academics & Research</option>
            <option value="Administration & Stores">Administration & Stores</option>
          </select>

          <div className="flex rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                statusFilter === "ALL" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("CHECKED_IN")}
              className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                statusFilter === "CHECKED_IN" ? "bg-white text-neutral-900 shadow-2xs font-semibold" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Inside ({currentlyInsideCount})
            </button>
            <button
              onClick={() => setStatusFilter("UPCOMING")}
              className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                statusFilter === "UPCOMING" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Expected
            </button>
          </div>

          <button
            onClick={onOpenRollCall}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100/70 transition-colors shadow-2xs"
            title="Export real-time head count for safety roll call"
          >
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Emergency Roll-Call</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-neutral-950">
              Visitor Operations Ledger
            </h2>
            <p className="text-xs text-neutral-500">
              Live on-campus tracking, gate clearance, and official records
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-neutral-500 font-mono">
              {filteredVisitors.length} record{filteredVisitors.length === 1 ? "" : "s"} shown
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-6 py-3.5">Visitor & ID</th>
                <th className="px-6 py-3.5">Host Officer & Dept</th>
                <th className="px-6 py-3.5">Purpose & Venue</th>
                <th className="px-6 py-3.5">Slot / Timings</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-400">
                    No visitor records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => {
                  const initials = getInitials(v.name);
                  return (
                    <tr key={v.id} className="hover:bg-neutral-50/60 transition-colors">
                      {/* 1. Visitor Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-800 border border-neutral-200">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900">{v.name}</div>
                            <div className="text-xs text-neutral-500">
                              {v.organization} •{" "}
                              <span className="font-mono text-[11px]">{v.phone}</span>
                            </div>
                            <div className="mt-0.5 flex items-center space-x-2 text-[11px] font-mono text-neutral-400">
                              <span>{v.passNumber}</span>
                              <span>•</span>
                              <span>{v.idType} ({v.idNumberMasked})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Host Officer */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{v.hostName}</div>
                        <div className="text-xs text-neutral-500">{v.department}</div>
                        {v.vehicleNumber && (
                          <div className="mt-1 font-mono text-[10px] text-neutral-400">
                            🚗 {v.vehicleNumber}
                          </div>
                        )}
                      </td>

                      {/* 3. Purpose & Room */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                          {v.purpose}
                        </div>
                        <div className="mt-1 flex items-center space-x-2">
                          {v.roomName && (
                            <span className="inline-block text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                              📍 {v.roomName}
                            </span>
                          )}
                          {v.accompanyingCount > 0 && (
                            <span className="text-[11px] text-neutral-500">
                              +{v.accompanyingCount} guest{v.accompanyingCount > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 4. Timing */}
                      <td className="px-6 py-4 text-xs">
                        <div className="font-medium text-neutral-800">{v.scheduledTime}</div>
                        {v.checkInTime && (
                          <div className="mt-0.5 font-medium text-emerald-700">
                            In: {v.checkInTime}
                          </div>
                        )}
                        {v.checkOutTime && (
                          <div className="mt-0.5 font-medium text-neutral-500">
                            Out: {v.checkOutTime}
                          </div>
                        )}
                      </td>

                      {/* 5. Status Badge */}
                      <td className="px-6 py-4">
                        <StatusBadge status={v.status} />
                      </td>

                      {/* 6. Gate Action */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewPass(v)}
                            className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs"
                            title="View Digital Pass & QR Code"
                          >
                            QR Pass
                          </button>

                          {(v.status === "APPROVED" || v.status === "PASS_ISSUED") && (
                            <button
                              onClick={() => onStatusToggle(v.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 shadow-2xs transition-colors"
                            >
                              Check In
                            </button>
                          )}

                          {v.status === "CHECKED_IN" && (
                            <button
                              onClick={() => onStatusToggle(v.id)}
                              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 shadow-2xs transition-colors"
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
