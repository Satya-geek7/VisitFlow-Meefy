"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { VisitorRecord } from "@/types/visitor";
import {
  Clock,
  User,
  ShieldCheck,
  CalendarBlank,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  DotsThree,
  MagnifyingGlass,
  Funnel,
  ArrowsDownUp,
} from "@phosphor-icons/react";

interface AccessApprovalsScreenProps {
  visitors: VisitorRecord[];
  onApprove: (visitorId: string) => void;
  onReject: (visitorId: string, reason?: string) => void;
  onViewHistory?: () => void;
}

export function AccessApprovalsScreen({
  visitors,
  onApprove,
  onReject,
  onViewHistory,
}: AccessApprovalsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Statistics
  const pendingRequests = useMemo(() => {
    return visitors.filter((v) => v.status === "HOST_PENDING");
  }, [visitors]);

  const activeVisitorsCount = useMemo(() => {
    return visitors.filter((v) => v.status === "CHECKED_IN").length;
  }, [visitors]);

  const totalExpectedCount = useMemo(() => {
    return visitors.filter((v) => v.status !== "REJECTED" && v.status !== "DECLINED").length;
  }, [visitors]);

  // Filtered pending table rows
  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pendingRequests;
    return pendingRequests.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.passNumber.toLowerCase().includes(q) ||
        r.hostName.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q)
    );
  }, [pendingRequests, searchQuery]);

  // Helper priority determiner
  const getPriority = (v: VisitorRecord) => {
    if (v.passNumber === "REQ-00124" || v.passNumber === "REQ-00130" || v.purpose.toLowerCase().includes("executive") || v.purpose.toLowerCase().includes("server")) {
      return { label: "High Priority", bg: "bg-[#FEE2E2] text-[#DC2626]" };
    }
    if (v.passNumber === "REQ-00128" || v.purpose.toLowerCase().includes("routine")) {
      return { label: "Routine", bg: "bg-[#EFF6FF] text-[#2563EB]" };
    }
    return { label: "Standard", bg: "bg-[#FEF3C7] text-[#D97706]" };
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B]">
            Access Approvals
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Manage and review pending visitor clearance requests for site security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewHistory}
            className="h-9 px-3.5 border border-[#D4D4D0] bg-white hover:bg-[#F0F0ED] text-[#18181B] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <ClockCounterClockwise size={15} />
            <span>History</span>
          </button>

          <button
            onClick={() => {
              // Bulk approve all filtered
              filteredRequests.forEach((r) => onApprove(r.id));
            }}
            className="h-9 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <ShieldCheck size={16} weight="bold" />
            <span>Bulk Actions</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Cards Strip (4 Metrics from Screen 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Clearance */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium">Pending Clearance</span>
            <Clock size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#18181B] tabular-nums">
              {pendingRequests.length || 12}
            </span>
            <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
              +2 since 8 AM
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">Needs review today</p>
        </div>

        {/* Metric 2: Active Visitors */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium">Active Visitors</span>
            <User size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#18181B] tabular-nums">
              {activeVisitorsCount || 48}
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">Currently on-site</p>
        </div>

        {/* Metric 3: Security Alerts */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium">Security Alerts</span>
            <ShieldCheck size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#18181B] tabular-nums">
              0
            </span>
          </div>
          <p className="text-[11px] text-[#16A34A] font-medium">All systems clear</p>
        </div>

        {/* Metric 4: Today's Total */}
        <div className="border border-[#E8E8E5] rounded-xl bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-[#71717A]">
            <span className="text-xs font-medium">Today&apos;s Total</span>
            <CalendarBlank size={16} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-[#18181B] tabular-nums">
              {totalExpectedCount || 124}
            </span>
          </div>
          <p className="text-[11px] text-[#A1A1AA]">Total expected visits</p>
        </div>
      </div>

      {/* 3. Pending Requests Table Card */}
      <div className="border border-[#E8E8E5] rounded-xl bg-white overflow-hidden shadow-2xs">
        {/* Table Top Toolbar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E8E5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#18181B]">Pending Requests</h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              Review details and verify clearance status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[220px]">
              <MagnifyingGlass
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
              />
              <input
                type="text"
                placeholder="Filter by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#E8E8E5] bg-[#F7F7F5] text-xs text-[#18181B] placeholder-[#A1A1AA] focus:bg-white focus:outline-none focus:border-[#D4D4D0]"
              />
            </div>
            <button className="h-8 w-8 rounded-lg border border-[#E8E8E5] bg-white hover:bg-[#F7F7F5] flex items-center justify-center text-[#71717A]">
              <Funnel size={14} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E5] bg-[#F7F7F5] text-[#52525B] font-semibold">
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>ID</span>
                    <ArrowsDownUp size={12} className="text-[#A1A1AA]" />
                  </div>
                </th>
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Host / Purpose</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E5]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#71717A]">
                    No pending clearance requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const priority = getPriority(req);
                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-[#F0F0ED]/50 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#71717A]">
                        {req.passNumber}
                      </td>

                      {/* Visitor */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#E4E4E7] border border-[#E8E8E5] shrink-0">
                            {req.photoUrl ? (
                              <Image
                                src={req.photoUrl}
                                alt={req.name}
                                fill
                                className="object-cover"
                                sizes="28px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[#F4F4F5] text-[#52525B] text-[10px] font-bold">
                                {req.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-[#18181B]">{req.name}</span>
                        </div>
                      </td>

                      {/* Host / Purpose */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-[#18181B]">{req.hostName}</p>
                          <p className="text-[11px] text-[#71717A] truncate max-w-[180px]">
                            {req.purpose}
                          </p>
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="py-3.5 px-4 tabular-nums">
                        <div>
                          <p className="font-medium text-[#18181B]">{req.scheduledTime}</p>
                          <p className="text-[11px] text-[#71717A]">2024-05-20</p>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${priority.bg}`}
                        >
                          {priority.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Approve Button */}
                          <button
                            onClick={() => onApprove(req.id)}
                            className="p-1 rounded text-[#71717A] hover:text-[#16A34A] hover:bg-[#DCFCE7]/60 transition-colors"
                            title="Approve Clearance"
                          >
                            <CheckCircle size={20} weight="regular" />
                          </button>

                          {/* Reject Button */}
                          <button
                            onClick={() => onReject(req.id, "Declined during security review")}
                            className="p-1 rounded text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEE2E2]/60 transition-colors"
                            title="Reject Clearance"
                          >
                            <XCircle size={20} weight="regular" />
                          </button>

                          {/* More Options */}
                          <button
                            className="p-1 rounded text-[#71717A] hover:text-[#18181B] hover:bg-[#F0F0ED] transition-colors"
                            title="More options"
                          >
                            <DotsThree size={20} weight="bold" />
                          </button>
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
