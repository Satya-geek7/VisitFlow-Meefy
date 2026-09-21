import React from "react";
import { VisitorRecord } from "@/types/visitor.types";
import { VisitorRow } from "./VisitorRow";

interface VisitorTableProps {
  visitors: VisitorRecord[];
  onViewPass: (visitor: VisitorRecord) => void;
  onStatusToggle: (id: string) => void;
}

export function VisitorTable({
  visitors,
  onViewPass,
  onStatusToggle,
}: VisitorTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Daily Visitor Ledger & Gate Access
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time status of all pre-scheduled and walk-in visitors today
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
          Showing {visitors.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-6 py-3.5">Visitor & Organization</th>
              <th className="px-6 py-3.5">Host Officer & Dept</th>
              <th className="px-6 py-3.5">Purpose of Visit</th>
              <th className="px-6 py-3.5">Scheduled / In Time</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Gate Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {visitors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-neutral-400"
                >
                  No visitor entries match your query.
                </td>
              </tr>
            ) : (
              visitors.map((visitor) => (
                <VisitorRow
                  key={visitor.id}
                  visitor={visitor}
                  onViewPass={onViewPass}
                  onStatusToggle={onStatusToggle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
