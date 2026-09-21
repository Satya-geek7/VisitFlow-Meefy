import React from "react";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { TabKey } from "@/types/visitor";

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingApprovalsCount: number;
  pendingScreeningCount: number;
  onOpenScanner: () => void;
  onOpenWalkIn: () => void;
  onOpenPublicRequest: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  pendingScreeningCount,
  onOpenScanner,
  onOpenWalkIn,
  onOpenPublicRequest,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center space-x-5">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white border border-neutral-200/80 p-1.5 shadow-xs">
              <Image
                src="/images/logo.svg"
                alt="meefy logo"
                width={88}
                height={88}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-neutral-950">
                  meefy
                </span>
                <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-neutral-600">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-400 hidden sm:block">
                Visitor & Meeting Management Engine
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <Navigation
            activeTab={activeTab}
            onTabChange={onTabChange}
            pendingApprovalsCount={pendingApprovalsCount}
            pendingScreeningCount={pendingScreeningCount}
          />
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenPublicRequest}
            className="hidden md:inline-flex items-center space-x-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:border-neutral-300 transition-all active:scale-[0.98]"
            title="Public Guest Visit Booking (OTP Verified)"
          >
            <span>+ Public Request</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="inline-flex items-center space-x-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-2xs hover:bg-neutral-50 hover:border-neutral-400 transition-all active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5 text-neutral-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Scan QR</span>
          </button>

          <button
            onClick={onOpenWalkIn}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Walk-In</span>
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Scrollable Sub-bar for tablet and mobile */}
      <div className="xl:hidden flex items-center space-x-2 overflow-x-auto px-4 sm:px-6 py-2.5 border-t border-neutral-100 bg-neutral-50/70 scrollbar-none">
        {[
          { key: "live" as TabKey, label: "Live Operations" },
          { key: "screening" as TabKey, label: "Screening", badge: pendingScreeningCount, badgeColor: "bg-purple-600" },
          { key: "approvals" as TabKey, label: "Approvals", badge: pendingApprovalsCount, badgeColor: "bg-amber-500" },
          { key: "appointments" as TabKey, label: "Appointments" },
          { key: "rooms" as TabKey, label: "Rooms & Halls" },
          { key: "analytics" as TabKey, label: "Analytics" },
          { key: "audit" as TabKey, label: "Audit Logs" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 transition-all ${isActive
                ? "bg-neutral-900 text-white shadow-xs"
                : "bg-white border border-neutral-200/80 text-neutral-600 hover:bg-neutral-100"
                }`}
            >
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white ${tab.badgeColor || "bg-neutral-800"
                    }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
}
