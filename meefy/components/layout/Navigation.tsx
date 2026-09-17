import React from "react";
import { TabKey } from "@/types/visitor";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingApprovalsCount: number;
  pendingScreeningCount: number;
}

export function Navigation({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  pendingScreeningCount,
}: NavigationProps) {
  const tabs: { key: TabKey; label: string; badge?: number; badgeColor?: string }[] = [
    { key: "live", label: "Live Operations" },
    {
      key: "screening",
      label: "Screening Queue",
      badge: pendingScreeningCount,
      badgeColor: "bg-purple-600",
    },
    {
      key: "approvals",
      label: "Host Approvals",
      badge: pendingApprovalsCount,
      badgeColor: "bg-amber-500",
    },
    { key: "appointments", label: "Appointments" },
    { key: "rooms", label: "Rooms & Halls" },
    { key: "analytics", label: "Executive Analytics" },
    { key: "audit", label: "Audit Logs" },
  ];

  return (
    <nav className="hidden xl:flex items-center space-x-1.5 border-l border-neutral-200/80 pl-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-tight transition-all duration-150 ${
              isActive
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <span>{tab.label}</span>
            {Boolean(tab.badge && tab.badge > 0) && (
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white shadow-2xs ${
                  tab.badgeColor || "bg-neutral-800"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
