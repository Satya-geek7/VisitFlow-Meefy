"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { VisitorRecord } from "@/types/visitor";
import { AppointmentDetailPanel } from "./AppointmentDetailPanel";
import {
  User,
  Clock,
  MapPin,
  MagnifyingGlass,
  Funnel,
  CalendarBlank,
  Plus,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

interface VisitorQueueScreenProps {
  visitors: VisitorRecord[];
  onOpenWalkIn: () => void;
  onViewPass: (visitor: VisitorRecord) => void;
  onStatusToggle: (visitorId: string) => void;
  onNotifyHost: (visitor: VisitorRecord) => void;
}

export function VisitorQueueScreen({
  visitors,
  onOpenWalkIn,
  onViewPass,
  onStatusToggle,
  onNotifyHost,
}: VisitorQueueScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [scheduleFilter, setScheduleFilter] = useState("ALL_DAY");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>(
    visitors[0]?.id || ""
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected visitor object
  const selectedVisitor = useMemo(() => {
    return visitors.find((v) => v.id === selectedVisitorId) || visitors[0] || null;
  }, [visitors, selectedVisitorId]);

  // Headcount
  const checkedInCount = useMemo(() => {
    return visitors.filter((v) => v.status === "CHECKED_IN").length;
  }, [visitors]);

  // Filtered visitors
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        v.name.toLowerCase().includes(query) ||
        v.hostName.toLowerCase().includes(query) ||
        v.passNumber.toLowerCase().includes(query) ||
        (v.roomName && v.roomName.toLowerCase().includes(query));

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "CHECKED_IN") {
        matchesStatus = v.status === "CHECKED_IN";
      } else if (statusFilter === "UPCOMING") {
        matchesStatus = v.status === "PASS_ISSUED" || v.status === "APPROVED";
      } else if (statusFilter === "EXPIRED") {
        matchesStatus = v.status === "EXPIRED" || v.status === "REJECTED";
      }

      return matchesSearch && matchesStatus;
    });
  }, [visitors, searchQuery, statusFilter]);

  // Pagination
  const totalItems = filteredVisitors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedVisitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVisitors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisitors, currentPage, itemsPerPage]);

  const renderStatusBadge = (status: string) => {
    if (status === "CHECKED_IN") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#16A34A] text-white">
          Checked In
        </span>
      );
    }
    if (status === "PASS_ISSUED" || status === "APPROVED") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#2563EB] text-white">
          Upcoming
        </span>
      );
    }
    if (status === "EXPIRED" || status === "DECLINED" || status === "REJECTED") {
      return (
        <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#DC2626] text-white">
          Expired
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#F4F4F5] text-[#52525B]">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Subheader / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B]">
            Visitor Queue
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mt-0.5">
            MONITOR AND MANAGE ACTIVE ARRIVALS FOR TODAY
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Site Occupancy Badge */}
          <div className="flex items-center gap-2 border border-[#E8E8E5] bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#18181B] shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]" />
            </span>
            <span className="text-[#71717A] font-bold text-[10px] tracking-wider uppercase">
              SITE OCCUPANCY
            </span>
            <span className="tabular-nums font-bold text-[#18181B] pl-1">
              {checkedInCount} / 100
            </span>
          </div>

          {/* + Walk-in Entry Button */}
          <button
            onClick={onOpenWalkIn}
            className="h-9 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus size={15} weight="bold" />
            <span>Walk-in Entry</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Split Panel (Queue Cards + Appointment Details) */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left: Search, Filters, & 2-Column Cards Grid */}
        <div className="flex-1 w-full space-y-4">
          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
              />
              <input
                type="text"
                placeholder="Search by name, host, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E8E8E5] bg-white text-xs text-[#18181B] placeholder-[#A1A1AA] transition-colors focus:border-[#D4D4D0] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 px-3 pr-8 rounded-lg border border-[#E8E8E5] bg-white text-xs font-medium text-[#18181B] appearance-none cursor-pointer focus:outline-none focus:border-[#D4D4D0]"
              >
                <option value="ALL">All Statuses</option>
                <option value="CHECKED_IN">Checked In</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="EXPIRED">Expired</option>
              </select>
              <Funnel
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none"
              />
            </div>

            {/* Schedule Dropdown */}
            <div className="relative">
              <select
                value={scheduleFilter}
                onChange={(e) => setScheduleFilter(e.target.value)}
                className="h-9 px-3 pr-8 rounded-lg border border-[#E8E8E5] bg-white text-xs font-medium text-[#18181B] appearance-none cursor-pointer focus:outline-none focus:border-[#D4D4D0]"
              >
                <option value="ALL_DAY">Today&apos;s Full Schedule</option>
                <option value="MORNING">Morning (08:00 - 12:00)</option>
                <option value="AFTERNOON">Afternoon (12:00 - 17:00)</option>
              </select>
              <CalendarBlank
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none"
              />
            </div>
          </div>

          {/* Cards Grid: 2 Columns */}
          {paginatedVisitors.length === 0 ? (
            <div className="border border-[#E8E8E5] rounded-xl bg-white p-12 text-center text-[#71717A]">
              <p className="text-sm font-semibold text-[#18181B]">No appointments found</p>
              <p className="text-xs text-[#A1A1AA] mt-1">
                Try clearing your search or adjusting the status filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedVisitors.map((visitor) => {
                const isSelected = visitor.id === selectedVisitor?.id;
                return (
                  <div
                    key={visitor.id}
                    onClick={() => setSelectedVisitorId(visitor.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer bg-white ${
                      isSelected
                        ? "border-[#16A34A] ring-1 ring-[#16A34A] shadow-xs"
                        : "border-[#E8E8E5] hover:border-[#D4D4D0] hover:shadow-2xs"
                    }`}
                  >
                    {/* Top Row: Avatar + Name + Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#E4E4E7] shrink-0 border border-[#E8E8E5]">
                          {visitor.photoUrl ? (
                            <Image
                              src={visitor.photoUrl}
                              alt={visitor.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#F4F4F5] text-[#52525B] font-bold text-sm">
                              {visitor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#18181B] leading-tight">
                            {visitor.name}
                          </h3>
                          <p className="text-[11px] text-[#71717A] font-medium">
                            {visitor.organization ? "Visitor" : "Contractor"}
                          </p>
                        </div>
                      </div>

                      {renderStatusBadge(visitor.status)}
                    </div>

                    {/* Meta Details */}
                    <div className="mt-3.5 space-y-1.5 text-xs text-[#52525B] border-t border-[#F0F0ED] pt-3">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#A1A1AA] shrink-0" />
                        <span className="truncate">
                          Host: <strong className="font-semibold text-[#18181B]">{visitor.hostName}</strong> ({visitor.department})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums">
                        <Clock size={14} className="text-[#A1A1AA] shrink-0" />
                        <span>{visitor.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-[#A1A1AA] shrink-0" />
                        <span className="truncate">{visitor.roomName || "Meeting Room B"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Pagination Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E5] text-xs text-[#71717A]">
            <p>
              Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} appointments
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded border border-[#E8E8E5] bg-white hover:bg-[#F7F7F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-[#16A34A] text-white"
                      : "border border-[#E8E8E5] bg-white text-[#18181B] hover:bg-[#F7F7F5]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded border border-[#E8E8E5] bg-white hover:bg-[#F7F7F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CaretRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Appointment Details Panel */}
        <AppointmentDetailPanel
          visitor={selectedVisitor}
          onPrintBadge={onViewPass}
          onNotifyHost={onNotifyHost}
          onStatusToggle={onStatusToggle}
        />
      </div>

      {/* Footer */}
      <footer className="pt-6 border-t border-[#E8E8E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-2">
        <p>© 2024 VisitFlow Enterprise • Help Center</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          <span className="font-mono text-[11px] text-[#52525B]">SYSTEM LIVE v2.4.1-stable</span>
        </div>
      </footer>
    </div>
  );
}
