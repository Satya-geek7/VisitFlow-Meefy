"use client";

import React from "react";
import Image from "next/image";
import {
  SquaresFour,
  ClipboardText,
  QrCode,
  ChartBar,
  Gear,
  SignOut,
  Buildings,
} from "@phosphor-icons/react";

export type SidebarTab = "queue" | "approvals" | "scan" | "analytics" | "settings";

interface AppSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  pendingApprovalsCount?: number;
}

export function AppSidebar({
  activeTab,
  onSelectTab,
  pendingApprovalsCount = 0,
}: AppSidebarProps) {
  const navItems = [
    {
      id: "queue" as SidebarTab,
      label: "Queue",
      icon: SquaresFour,
    },
    {
      id: "approvals" as SidebarTab,
      label: "Approvals",
      icon: ClipboardText,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    {
      id: "scan" as SidebarTab,
      label: "Scan Pass",
      icon: QrCode,
    },
    {
      id: "analytics" as SidebarTab,
      label: "Analytics",
      icon: ChartBar,
    },
    {
      id: "settings" as SidebarTab,
      label: "Settings",
      icon: Gear,
    },
  ];

  return (
    <aside className="w-[220px] shrink-0 min-h-screen bg-[#F7F7F5] border-r border-[#E8E8E5] flex flex-col justify-between py-5 px-3 select-none">
      {/* Top section: Logo & Nav */}
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
            <Buildings size={20} weight="fill" />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-[#18181B] leading-none">
              VisitFlow
            </div>
            <div className="text-[11px] font-medium text-[#71717A] mt-1 tracking-wider uppercase">
              (MEEFY)
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-xs"
                    : "text-[#52525B] hover:bg-[#F0F0ED] hover:text-[#18181B]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={18}
                    weight={isActive ? "bold" : "regular"}
                    className={isActive ? "text-white" : "text-[#71717A]"}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      isActive
                        ? "bg-white text-[#16A34A]"
                        : "bg-[#FEF3C7] text-[#D97706]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: User Info & Logout */}
      <div className="pt-4 border-t border-[#E8E8E5] space-y-3 px-1">
        <div className="flex items-center gap-2.5 px-2">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#E4E4E7] border border-[#E8E8E5] shrink-0">
            {/* Sarah Miller avatar */}
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Miller"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#18181B] truncate leading-tight">
              Sarah Miller
            </p>
            <p className="text-[11px] text-[#71717A] truncate">Receptionist</p>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
        >
          <SignOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
