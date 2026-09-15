import React from "react";
import { TabKey } from "@/types/visitor.types";

interface NavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingApprovalsCount: number;
}

export function Navigation({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
}: NavigationProps) {
  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: "live", label: "Live Operations" },
    { key: "appointments", label: "Appointments" },
    { key: "approvals", label: "Host Approvals", badge: pendingApprovalsCount },
    { key: "rooms", label: "Rooms & Halls" },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1 border-l border-neutral-200 pl-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-neutral-900 text-white shadow-xs"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <span>{tab.label}</span>
            {Boolean(tab.badge && tab.badge > 0) && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
