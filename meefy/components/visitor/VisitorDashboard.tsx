"use client";

import React, { useState, useMemo } from "react";
import { TabKey, VisitorRecord, RoomRecord, WalkInFormData } from "@/types/visitor.types";
import { INITIAL_VISITORS } from "@/data/visitors";
import { INITIAL_ROOMS } from "@/data/rooms";
import { Header } from "@/components/layout/Header";
import { VisitorMetrics } from "./VisitorMetrics";
import { VisitorSearch } from "./VisitorSearch";
import { VisitorTable } from "./VisitorTable";
import { Appointments } from "./Appointments";
import { HostApprovals } from "./HostApprovals";
import { RoomsAndHalls } from "./RoomsAndHalls";
import { WalkInModal } from "./WalkInModal";
import { DigitalPassModal } from "./DigitalPassModal";
import { ScannerModal } from "./ScannerModal";

export function VisitorDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("live");
  const [visitors, setVisitors] = useState<VisitorRecord[]>(INITIAL_VISITORS);
  const [rooms] = useState<RoomRecord[]>(INITIAL_ROOMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("ALL");

  // Modals state
  const [selectedPass, setSelectedPass] = useState<VisitorRecord | null>(INITIAL_VISITORS[0]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);

  // Derived metrics
  const activeInsideCount = useMemo(
    () => visitors.filter((v) => v.status === "CHECKED_IN").length,
    [visitors]
  );
  const pendingApprovalsCount = useMemo(
    () => visitors.filter((v) => v.status === "PENDING_APPROVAL").length,
    [visitors]
  );
  const totalExpectedToday = useMemo(() => visitors.length, [visitors]);
  const occupiedRoomsCount = useMemo(
    () => rooms.filter((r) => r.status === "OCCUPIED").length,
    [rooms]
  );

  // Filtered visitors
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
        filterDepartment === "ALL" || v.department === filterDepartment;
      return matchesSearch && matchesDept;
    });
  }, [visitors, searchQuery, filterDepartment]);

  // Actions
  const handleHostAction = (id: string, action: "APPROVE" | "REJECT") => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
          : v
      )
    );
  };

  const handleStatusToggle = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          if (v.status === "APPROVED") {
            return {
              ...v,
              status: "CHECKED_IN",
              checkInTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          } else if (v.status === "CHECKED_IN") {
            return {
              ...v,
              status: "CHECKED_OUT",
            };
          }
        }
        return v;
      })
    );
  };

  const handleWalkInSubmit = (data: WalkInFormData) => {
    const newPassNum = `PAS-2026-09${Math.floor(10 + Math.random() * 89)}`;
    const newRecord: VisitorRecord = {
      id: `v-${Date.now()}`,
      passNumber: newPassNum,
      name: data.name,
      phone: data.phone,
      email: data.email || "guest@visitor.in",
      organization: data.organization || "Independent / Guest",
      idType: data.idType,
      idNumberMasked: data.idNumber
        ? `XXXX-XXXX-${data.idNumber.slice(-4)}`
        : "VERIFIED-AT-DESK",
      hostName: data.hostName,
      department: data.department,
      purpose: data.purpose,
      scheduledTime: "Walk-in (Immediate)",
      checkInTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "CHECKED_IN",
      accompanyingCount: Number(data.accompanyingCount) || 0,
      roomName: "Reception Consultation Desk",
    };

    setVisitors([newRecord, ...visitors]);
    setSelectedPass(newRecord);
    setShowWalkInModal(false);
  };

  const handleViewPass = (visitor: VisitorRecord) => {
    setSelectedPass(visitor);
    setShowPassModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">


      {/* 1. Header (with Navigation) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenScanner={() => setShowScannerModal(true)}
        onOpenWalkIn={() => setShowWalkInModal(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* 3. VisitorMetrics */}
        <VisitorMetrics
          activeInsideCount={activeInsideCount}
          totalExpectedToday={totalExpectedToday}
          pendingApprovalsCount={pendingApprovalsCount}
          occupiedRoomsCount={occupiedRoomsCount}
          totalRoomsCount={rooms.length}
        />

        {/* 4. Active Tab Content */}
        {activeTab === "live" && (
          <div className="space-y-6">
            <VisitorSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterDepartment={filterDepartment}
              onDepartmentChange={setFilterDepartment}
              onReset={() => {
                setSearchQuery("");
                setFilterDepartment("ALL");
              }}
            />
            <VisitorTable
              visitors={filteredVisitors}
              onViewPass={handleViewPass}
              onStatusToggle={handleStatusToggle}
            />
          </div>
        )}

        {activeTab === "appointments" && (
          <Appointments
            visitors={visitors}
            onOpenScheduleModal={() => setShowWalkInModal(true)}
            onViewPass={handleViewPass}
            onCheckIn={handleStatusToggle}
          />
        )}

        {activeTab === "approvals" && (
          <HostApprovals
            visitors={visitors}
            onHostAction={handleHostAction}
          />
        )}

        {activeTab === "rooms" && <RoomsAndHalls rooms={rooms} />}
      </main>

      {/* Modals */}
      <WalkInModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleWalkInSubmit}
      />

      <DigitalPassModal
        visitor={selectedPass}
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
      />

      <ScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        visitors={visitors}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
}
