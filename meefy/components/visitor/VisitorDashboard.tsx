"use client";

import React, { useState, useMemo } from "react";
import {
  TabKey,
  VisitorRecord,
  WalkInFormData,
  PublicRequestFormData,
} from "@/types/visitor";
import { RoomRecord } from "@/types/room";
import { AuditLogEntry } from "@/types/audit";
import { INITIAL_VISITORS } from "@/data/visitors";
import { INITIAL_ROOMS } from "@/data/rooms";
import { INITIAL_AUDIT_LOGS } from "@/data/auditLogs";
import { generatePassNumber, formatTime } from "@/lib/utils";

import { TopBanner } from "@/components/layout/TopBanner";
import { Header } from "@/components/layout/Header";
import { MetricCard } from "@/components/common/MetricCard";
import { NotificationToast, ToastMessage } from "@/components/common/NotificationToast";

import { LiveOccupancyBoard } from "@/components/reception/LiveOccupancyBoard";
import { ScreeningQueue } from "@/components/reception/ScreeningQueue";
import { WalkInExpressModal } from "@/components/reception/WalkInExpressModal";
import { GateScannerModal } from "@/components/reception/GateScannerModal";

import { HostApprovalInbox } from "@/components/officer/HostApprovalInbox";
import { OfficerAppointments } from "@/components/officer/OfficerAppointments";

import { RoomGrid } from "@/components/rooms/RoomGrid";

import { AnalyticsReports } from "@/components/admin/AnalyticsReports";
import { EmergencyEvacuationModal } from "@/components/admin/EmergencyEvacuationModal";
import { AuditLogsTable } from "@/components/admin/AuditLogsTable";

import { DigitalPassModal } from "@/components/visitor/DigitalPassModal";
import { PublicRequestModal } from "@/components/visitor/PublicRequestModal";

export function VisitorDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("live");
  const [visitors, setVisitors] = useState<VisitorRecord[]>(INITIAL_VISITORS);
  const [rooms, setRooms] = useState<RoomRecord[]>(INITIAL_ROOMS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [selectedPass, setSelectedPass] = useState<VisitorRecord | null>(INITIAL_VISITORS[0]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showPublicRequestModal, setShowPublicRequestModal] = useState(false);
  const [showRollCallModal, setShowRollCallModal] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const addToast = (title: string, description: string, type: "success" | "info" | "warning" = "success") => {
    setToast({
      id: `t-${Date.now()}`,
      title,
      description,
      type,
    });
  };

  const addAuditLog = (
    actor: string,
    actorRole: "RECEPTIONIST" | "OFFICER" | "ADMIN" | "VISITOR" | "SYSTEM",
    action: any,
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: formatTime(),
      actor,
      actorRole,
      action,
      entityType: "APPOINTMENT",
      entityId,
      details,
      ipAddress: "192.168.10.42",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Metrics
  const activeInsideCount = useMemo(
    () => visitors.filter((v) => v.status === "CHECKED_IN").length,
    [visitors]
  );
  const pendingApprovalsCount = useMemo(
    () => visitors.filter((v) => v.status === "HOST_PENDING").length,
    [visitors]
  );
  const pendingScreeningCount = useMemo(
    () => visitors.filter((v) => v.status === "SUBMITTED").length,
    [visitors]
  );
  const totalExpectedToday = useMemo(
    () => visitors.filter((v) => v.status !== "REJECTED" && v.status !== "DECLINED").length,
    [visitors]
  );
  const occupiedRoomsCount = useMemo(
    () => rooms.filter((r) => r.status === "OCCUPIED").length,
    [rooms]
  );

  // Actions: Check In / Check Out
  const handleStatusToggle = (id: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          if (v.status === "APPROVED" || v.status === "PASS_ISSUED") {
            const time = formatTime();
            addAuditLog(
              "Reception Gate 1",
              "RECEPTIONIST",
              "GATE_CHECKED_IN",
              v.passNumber,
              `${v.name} scanned QR at Gate 1. Verified and admitted to campus.`
            );
            addToast("Visitor Admitted", `${v.name} checked in at ${time}. Host ${v.hostName} notified.`, "success");
            return {
              ...v,
              status: "CHECKED_IN",
              checkInTime: time,
            };
          } else if (v.status === "CHECKED_IN") {
            const time = formatTime();
            addAuditLog(
              "Exit Gate 2",
              "RECEPTIONIST",
              "GATE_CHECKED_OUT",
              v.passNumber,
              `${v.name} checked out at exit. Total visit duration logged.`
            );
            addToast("Visitor Checked Out", `${v.name} departed at ${time}. Pass deactivated.`, "info");
            return {
              ...v,
              status: "CHECKED_OUT",
              checkOutTime: time,
            };
          }
        }
        return v;
      })
    );
  };

  // Actions: Host Officer Approval / Reject
  const handleHostAction = (id: string, action: "APPROVE" | "REJECT", reason?: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          if (action === "APPROVE") {
            addAuditLog(
              v.hostName,
              "OFFICER",
              "HOST_APPROVED",
              v.passNumber,
              `Host ${v.hostName} approved meeting request with ${v.name}. Pass generated.`
            );
            addToast("Appointment Approved", `Pass generated for ${v.name}. Confirmation email dispatched.`, "success");
            return { ...v, status: "APPROVED" };
          } else {
            addAuditLog(
              v.hostName,
              "OFFICER",
              "HOST_DECLINED",
              v.passNumber,
              `Host ${v.hostName} declined meeting with note: ${reason || "Unavailable"}`
            );
            addToast("Appointment Declined", `Meeting request with ${v.name} was declined.`, "warning");
            return { ...v, status: "DECLINED", rejectionReason: reason };
          }
        }
        return v;
      })
    );
  };

  // Actions: Host Delegate to colleague
  const handleDelegateAction = (id: string, newHostName: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          addAuditLog(
            v.hostName,
            "OFFICER",
            "HOST_APPROVED",
            v.passNumber,
            `Delegated appointment to ${newHostName}.`
          );
          addToast("Visit Delegated", `Meeting with ${v.name} transferred to ${newHostName}.`, "info");
          return { ...v, hostName: newHostName };
        }
        return v;
      })
    );
  };

  // Actions: Receptionist Screening & Scheduling
  const handleScreenAndSchedule = (
    id: string,
    officerName: string,
    department: string,
    slotTime: string,
    roomName: string
  ) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          addAuditLog(
            "Reception Desk",
            "RECEPTIONIST",
            "REQUEST_SCREENED",
            v.passNumber,
            `Screened visitor ${v.name}. Assigned to ${officerName} for ${slotTime} in ${roomName}.`
          );
          addToast("Request Screened", `Forwarded to ${officerName} for 1-click confirmation.`, "info");
          return {
            ...v,
            status: "HOST_PENDING",
            hostName: officerName,
            department,
            scheduledTime: slotTime,
            roomName,
          };
        }
        return v;
      })
    );
  };

  // Actions: Receptionist Reject
  const handleRejectRequest = (id: string, reason: string) => {
    setVisitors((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          addAuditLog(
            "Reception Desk",
            "RECEPTIONIST",
            "REQUEST_REJECTED",
            v.passNumber,
            `Rejected public request: ${reason}`
          );
          addToast("Request Rejected", `Visit request for ${v.name} rejected: ${reason}`, "warning");
          return { ...v, status: "REJECTED", rejectionReason: reason };
        }
        return v;
      })
    );
  };

  // Actions: Walk-In Form Submit
  const handleWalkInSubmit = (data: WalkInFormData) => {
    const passNum = generatePassNumber();
    const time = formatTime();

    const newRecord: VisitorRecord = {
      id: `v-${Date.now()}`,
      passNumber: passNum,
      name: data.name,
      phone: data.phone,
      email: data.email || "guest@visitor.in",
      organization: data.organization || "Independent Visitor",
      idType: data.idType,
      idNumberMasked: data.idNumber
        ? `****-****-${data.idNumber.slice(-4)}`
        : "VERIFIED-AT-GATE",
      hostName: data.hostName,
      department: data.department,
      purpose: data.purpose,
      scheduledTime: "Walk-in (Immediate Access)",
      checkInTime: time,
      status: "CHECKED_IN",
      accompanyingCount: Number(data.accompanyingCount) || 0,
      vehicleNumber: data.vehicleNumber,
      roomName: data.roomName || "Reception Consultation Desk",
      createdAt: new Date().toISOString(),
    };

    setVisitors([newRecord, ...visitors]);
    addAuditLog(
      "Reception Gate 1",
      "RECEPTIONIST",
      "GATE_CHECKED_IN",
      passNum,
      `Walk-in express visitor ${data.name} admitted to meet ${data.hostName}. Pass generated.`
    );
    addToast("Walk-In Visitor Admitted", `${data.name} admitted. Digital pass generated.`, "success");

    setSelectedPass(newRecord);
    setShowPassModal(true);
  };

  // Actions: Public Request Submit (from /request)
  const handlePublicRequestSubmit = (data: PublicRequestFormData) => {
    const passNum = generatePassNumber();

    const newRecord: VisitorRecord = {
      id: `v-${Date.now()}`,
      passNumber: passNum,
      name: data.name,
      phone: data.phone,
      email: data.email || "guest@visitor.in",
      organization: data.organization || "Public Guest",
      idType: "Aadhaar Card",
      idNumberMasked: "OTP-VERIFIED-PHONE",
      hostName: data.preferredOfficer,
      department: data.department,
      purpose: data.purpose,
      scheduledTime: `${data.preferredDate} (${data.preferredTimeSlot})`,
      status: "SUBMITTED",
      accompanyingCount: Number(data.accompanyingCount) || 0,
      createdAt: new Date().toISOString(),
      notes: data.notes,
    };

    setVisitors([newRecord, ...visitors]);
    addAuditLog(
      data.name,
      "VISITOR",
      "REQUEST_SUBMITTED",
      passNum,
      `Public visit request submitted online with phone OTP verification.`
    );
    addToast("Visit Request Submitted", `Tracking token: ${passNum}. Awaiting receptionist screening.`, "info");
  };

  // Actions: Room Booking
  const handleBookRoom = (roomId: string, title: string, host: string, slot: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          addAuditLog(
            host,
            "OFFICER",
            "ROOM_RESERVED",
            r.code,
            `Reserved ${r.name} for '${title}' during ${slot}.`
          );
          addToast("Room Reserved", `${r.name} reserved for ${host}.`, "success");
          return {
            ...r,
            status: "OCCUPIED",
            currentMeeting: title,
            hostName: host,
            nextAvailable: slot.split("-")[1]?.trim() || "Later Today",
          };
        }
        return r;
      })
    );
  };

  const handleViewPass = (visitor: VisitorRecord) => {
    setSelectedPass(visitor);
    setShowPassModal(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Official NIELIT Top Banner */}
      <TopBanner />

      {/* 2. Header & Tab Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        pendingScreeningCount={pendingScreeningCount}
        onOpenScanner={() => setShowScannerModal(true)}
        onOpenWalkIn={() => setShowWalkInModal(true)}
        onOpenPublicRequest={() => setShowPublicRequestModal(true)}
      />

      {/* 3. Main Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* KPI Metrics Strip */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Currently Inside"
            value={activeInsideCount}
            subValue="active passes"
            livePulse={true}
            badgeText="Safety Roll-Call Ready"
            badgeType="success"
            footerLeft="Real-time headcount"
            footerRight="100% Verified"
          />

          <MetricCard
            title="Expected Visitors"
            value={totalExpectedToday}
            subValue="scheduled visits"
            badgeText="Advance & Walk-Ins"
            badgeType="neutral"
            footerLeft="On-time arrival"
            footerRight="94% adherence"
          />

          <MetricCard
            title="Host Approvals"
            value={pendingApprovalsCount}
            subValue="pending action"
            badgeText={pendingApprovalsCount > 0 ? "SLA Active" : "Clear"}
            badgeType={pendingApprovalsCount > 0 ? "warning" : "success"}
            footerLeft="Average response"
            footerRight="14 mins"
          />

          <MetricCard
            title="Rooms & Halls"
            value={`${occupiedRoomsCount}/${rooms.length}`}
            subValue="in session"
            badgeText={`${rooms.length - occupiedRoomsCount} Available`}
            badgeType="neutral"
            footerLeft="Meeting spaces"
            footerRight="Conflict-Free"
          />
        </section>

        {/* Dynamic Tab Views */}
        {activeTab === "live" && (
          <LiveOccupancyBoard
            visitors={visitors}
            onViewPass={handleViewPass}
            onStatusToggle={handleStatusToggle}
            onOpenRollCall={() => setShowRollCallModal(true)}
            onOpenScanner={() => setShowScannerModal(true)}
          />
        )}

        {activeTab === "screening" && (
          <ScreeningQueue
            visitors={visitors}
            onScreenAndSchedule={handleScreenAndSchedule}
            onRejectRequest={handleRejectRequest}
          />
        )}

        {activeTab === "approvals" && (
          <HostApprovalInbox
            visitors={visitors}
            onHostAction={handleHostAction}
            onDelegateAction={handleDelegateAction}
          />
        )}

        {activeTab === "appointments" && (
          <OfficerAppointments
            visitors={visitors}
            onOpenScheduleModal={() => setShowWalkInModal(true)}
            onViewPass={handleViewPass}
            onCheckIn={handleStatusToggle}
          />
        )}

        {activeTab === "rooms" && (
          <RoomGrid rooms={rooms} onBookRoom={handleBookRoom} />
        )}

        {activeTab === "analytics" && (
          <AnalyticsReports visitors={visitors} />
        )}

        {activeTab === "audit" && (
          <AuditLogsTable logs={auditLogs} />
        )}
      </main>

      {/* Floating Notification Toast */}
      <NotificationToast toast={toast} onDismiss={() => setToast(null)} />

      {/* Modals */}
      <WalkInExpressModal
        isOpen={showWalkInModal}
        onClose={() => setShowWalkInModal(false)}
        onSubmit={handleWalkInSubmit}
      />

      <DigitalPassModal
        visitor={selectedPass}
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
      />

      <GateScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        visitors={visitors}
        onStatusToggle={handleStatusToggle}
      />

      <PublicRequestModal
        isOpen={showPublicRequestModal}
        onClose={() => setShowPublicRequestModal(false)}
        onSubmit={handlePublicRequestSubmit}
      />

      <EmergencyEvacuationModal
        isOpen={showRollCallModal}
        onClose={() => setShowRollCallModal(false)}
        visitors={visitors}
      />
    </div>
  );
}
