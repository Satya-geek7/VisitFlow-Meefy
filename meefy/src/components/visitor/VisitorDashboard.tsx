"use client";

import React, { useState, useMemo } from "react";
import {
  VisitorRecord,
  WalkInFormData,
  PublicRequestFormData,
} from "@/types/visitor";
import { INITIAL_VISITORS } from "@/data/visitors";
import { INITIAL_AUDIT_LOGS } from "@/data/auditLogs";
import { AuditLogEntry, AuditAction } from "@/types/audit";
import { generatePassNumber, formatTime } from "@/lib/utils";

import { AppSidebar, SidebarTab } from "@/components/layout/AppSidebar";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { VisitorQueueScreen } from "@/components/reception/VisitorQueueScreen";
import { AccessApprovalsScreen } from "@/components/officer/AccessApprovalsScreen";
import { GateScanView } from "@/components/reception/GateScanView";
import { AnalyticsReports } from "@/components/admin/AnalyticsReports";

import { NotificationToast, ToastMessage } from "@/components/common/NotificationToast";
import { WalkInExpressModal } from "@/components/reception/WalkInExpressModal";
import { DigitalPassModal } from "@/components/visitor/DigitalPassModal";
import { GateScannerModal } from "@/components/reception/GateScannerModal";
import { PublicRequestModal } from "@/components/visitor/PublicRequestModal";
import { EmergencyEvacuationModal } from "@/components/admin/EmergencyEvacuationModal";
import { LandingPortalScreen } from "@/components/landing/LandingPortalScreen";

export function VisitorDashboard() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [activeTab, setActiveTab] = useState<SidebarTab>("queue");
  const [visitors, setVisitors] = useState<VisitorRecord[]>(INITIAL_VISITORS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals state
  const [selectedPass, setSelectedPass] = useState<VisitorRecord | null>(INITIAL_VISITORS[0]);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showPublicRequestModal, setShowPublicRequestModal] = useState(false);
  const [showRollCallModal, setShowRollCallModal] = useState(false);

  // Search query in top bar
  const [globalSearch, setGlobalSearch] = useState("");

  // Toast Notification state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const addToast = (
    title: string,
    description: string,
    type: "success" | "info" | "warning" = "success"
  ) => {
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
    action: AuditAction,
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
  const pendingApprovalsCount = useMemo(
    () => visitors.filter((v) => v.status === "HOST_PENDING").length,
    [visitors]
  );

  const activeCheckedInCount = useMemo(
    () => visitors.filter((v) => v.status === "CHECKED_IN").length,
    [visitors]
  );

  // Actions: Check In / Check Out Status Toggle
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
            addToast(
              "Visitor Admitted",
              `${v.name} checked in at ${time}. Host ${v.hostName} notified.`,
              "success"
            );
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
            addToast(
              "Visitor Checked Out",
              `${v.name} departed at ${time}. Pass deactivated.`,
              "info"
            );
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
            addToast(
              "Clearance Approved",
              `Access pass generated for ${v.name}.`,
              "success"
            );
            return { ...v, status: "APPROVED" };
          } else {
            addAuditLog(
              v.hostName,
              "OFFICER",
              "HOST_DECLINED",
              v.passNumber,
              `Host ${v.hostName} declined meeting with note: ${reason || "Unavailable"}`
            );
            addToast(
              "Clearance Declined",
              `Meeting request with ${v.name} was declined.`,
              "warning"
            );
            return { ...v, status: "DECLINED", rejectionReason: reason };
          }
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
      scheduledTime: "10:30 AM – 11:30 AM",
      checkInTime: time,
      status: "CHECKED_IN",
      accompanyingCount: Number(data.accompanyingCount) || 0,
      vehicleNumber: data.vehicleNumber,
      roomName: data.roomName || "Reception Consultation Desk",
      createdAt: new Date().toISOString(),
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };

    setVisitors([newRecord, ...visitors]);
    addAuditLog(
      "Reception Gate 1",
      "RECEPTIONIST",
      "GATE_CHECKED_IN",
      passNum,
      `Walk-in express visitor ${data.name} admitted to meet ${data.hostName}. Pass generated.`
    );
    addToast(
      "Walk-In Visitor Admitted",
      `${data.name} admitted. Digital pass generated.`,
      "success"
    );

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
    addToast(
      "Visit Request Submitted",
      `Tracking token: ${passNum}. Awaiting screening.`,
      "info"
    );
  };

  const handleViewPass = (visitor: VisitorRecord) => {
    setSelectedPass(visitor);
    setShowPassModal(true);
  };

  // Breadcrumb title helper
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case "queue":
        return "Receptionist Queue";
      case "approvals":
        return "Access Approvals";
      case "scan":
        return "Gate Scanner Station";
      case "analytics":
        return "Campus Analytics";
      case "settings":
        return "System Settings";
      default:
        return "Receptionist Queue";
    }
  };

  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-white text-[#18181B]">
        <LandingPortalScreen
          onEnterDashboard={(targetTab) => {
            if (targetTab) setActiveTab(targetTab);
            setCurrentView("dashboard");
          }}
          onOpenPublicRequest={() => setShowPublicRequestModal(true)}
          onTrackPass={(passNumber) => {
            const found = visitors.find((v) => v.passNumber === passNumber);
            if (found) {
              setSelectedPass(found);
              setShowPassModal(true);
            }
          }}
          pendingApprovalsCount={pendingApprovalsCount}
          totalVisitorsToday={visitors.length}
          activeCheckedInCount={activeCheckedInCount}
          visitors={visitors}
        />

        {/* Floating Notification Toast */}
        <NotificationToast toast={toast} onDismiss={() => setToast(null)} />

        {/* Modals available from Landing Page */}
        <DigitalPassModal
          visitor={selectedPass}
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
        />

        <PublicRequestModal
          isOpen={showPublicRequestModal}
          onClose={() => setShowPublicRequestModal(false)}
          onSubmit={handlePublicRequestSubmit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white text-[#18181B]">
      {/* 1. Shell Sidebar (Fixed 220px) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingApprovalsCount={pendingApprovalsCount}
        onReturnHome={() => setCurrentView("landing")}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (56px) */}
        <AppTopBar
          breadcrumbTitle={getBreadcrumbTitle()}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenNotifications={() =>
            addToast("All Systems Operational", "Zero security alerts detected in the building.", "info")
          }
          onReturnHome={() => setCurrentView("landing")}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Screen 1: Visitor Queue */}
          {activeTab === "queue" && (
            <VisitorQueueScreen
              visitors={visitors}
              onOpenWalkIn={() => setShowWalkInModal(true)}
              onViewPass={handleViewPass}
              onStatusToggle={handleStatusToggle}
              onNotifyHost={(v) =>
                addToast("Host Notified", `Sent SMS & email notification to ${v.hostName}.`, "info")
              }
            />
          )}

          {/* Screen 2: Access Approvals */}
          {activeTab === "approvals" && (
            <AccessApprovalsScreen
              visitors={visitors}
              onApprove={(id) => handleHostAction(id, "APPROVE")}
              onReject={(id, reason) => handleHostAction(id, "REJECT", reason)}
            />
          )}

          {/* Screen 3 & 4: Gate Scanner Station (Viewfinder, Success, Failure) */}
          {activeTab === "scan" && (
            <GateScanView
              visitors={visitors}
              onCheckIn={handleStatusToggle}
              onOpenWalkIn={() => setShowWalkInModal(true)}
            />
          )}

          {/* Analytics Reports */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B]">
                  Campus Analytics & Reports
                </h1>
                <p className="text-xs text-[#71717A] mt-0.5">
                  Visitor throughput, peak hour patterns, and department clearance compliance.
                </p>
              </div>
              <AnalyticsReports visitors={visitors} />
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B]">
                  System Settings
                </h1>
                <p className="text-xs text-[#71717A] mt-0.5">
                  Facility security parameters, scanner configurations, and notification webhooks.
                </p>
              </div>

              <div className="border border-[#E8E8E5] rounded-xl bg-white p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Gate & Scanner Operational Parameters
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-[#F0F0ED]">
                    <div>
                      <p className="font-semibold text-[#18181B]">Pass Early Grace Period</p>
                      <p className="text-[#71717A]">Allow check-in prior to scheduled slot</p>
                    </div>
                    <span className="font-mono font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      30 minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#F0F0ED]">
                    <div>
                      <p className="font-semibold text-[#18181B]">Pass Overstay Expiry Window</p>
                      <p className="text-[#71717A]">Automatic deactivation after slot ends</p>
                    </div>
                    <span className="font-mono font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      30 minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#18181B]">Max Facility Occupancy Limit</p>
                      <p className="text-[#71717A]">Real-time safety roll-call threshold</p>
                    </div>
                    <span className="font-mono font-bold text-[#18181B] bg-[#F4F4F5] px-2 py-0.5 rounded">
                      100 Persons
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-[#F0F0ED]">
                    <div>
                      <p className="font-semibold text-[#18181B]">Security Audit Log Stream</p>
                      <p className="text-[#71717A]">Append-only verified ledger events</p>
                    </div>
                    <span className="font-mono font-bold text-[#18181B] bg-[#F4F4F5] px-2 py-0.5 rounded">
                      {auditLogs.length} Events Logged
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

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
