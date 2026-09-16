import React, { useState } from "react";
import { AuditLogEntry } from "@/types/audit";

interface AuditLogsTableProps {
  logs: AuditLogEntry[];
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const filteredLogs = logs.filter((l) => {
    if (filterAction === "ALL") return true;
    return l.action === filterAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            System Security & Compliance Audit Log
          </h2>
          <p className="text-xs text-neutral-500">
            Immutable chronological record of all status transitions, gate scans, and officer approvals
          </p>
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-2xs focus:border-neutral-900 focus:outline-none"
        >
          <option value="ALL">All Actions</option>
          <option value="GATE_CHECKED_IN">Gate Check-In</option>
          <option value="GATE_CHECKED_OUT">Gate Check-Out</option>
          <option value="HOST_APPROVED">Host Approved</option>
          <option value="PASS_ISSUED">Pass Issued</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-100 bg-neutral-50/50 uppercase tracking-wider text-neutral-500 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Timestamp</th>
              <th className="px-6 py-3.5">Actor & Role</th>
              <th className="px-6 py-3.5">Action</th>
              <th className="px-6 py-3.5">Target Entity</th>
              <th className="px-6 py-3.5">Details</th>
              <th className="px-6 py-3.5 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/60">
                <td className="px-6 py-4 font-mono text-neutral-500">
                  {log.timestamp}
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-neutral-900">{log.actor}</div>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 font-mono">
                    {log.actorRole}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-mono font-semibold text-neutral-800 border border-neutral-200">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-neutral-700">
                  {log.entityId}
                </td>
                <td className="px-6 py-4 text-neutral-700 leading-relaxed max-w-sm">
                  {log.details}
                </td>
                <td className="px-6 py-4 text-right font-mono text-neutral-400">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
