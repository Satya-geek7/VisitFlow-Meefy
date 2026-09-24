"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  BellIcon,
  HouseLineIcon,
  CaretRightIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react";

interface AppTopBarProps {
  breadcrumbTitle?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenNotifications?: () => void;
  onReturnHome?: () => void;
}

export function AppTopBar({
  breadcrumbTitle = "Receptionist Queue",
  searchQuery = "",
  onSearchChange,
  onOpenNotifications,
  onReturnHome,
}: AppTopBarProps) {
  return (
    <header className="h-14 w-full bg-white border-b border-[#E8E8E5] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[#71717A]">
        {onReturnHome && (
          <button
            onClick={onReturnHome}
            className="inline-flex items-center gap-1 mr-1 px-2 py-1 rounded bg-[#F7F7F5] hover:bg-[#E8E8E5] text-[#18181B] font-semibold text-[11px] transition-colors"
            title="Return to Portal Gateway"
          >
            ← Portal
          </button>
        )}
        <div className="flex items-center gap-1.5 hover:text-[#18181B] cursor-pointer transition-colors">
          <HouseLineIcon size={15} />
          <span>Dashboard</span>
        </div>
        <CaretRightIcon size={12} className="text-[#A1A1AA]" />
        <span className="font-semibold text-[#18181B]">{breadcrumbTitle}</span>
      </div>

      {/* Right: Search, Notifications, User profile */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]"
          />
          <input
            type="text"
            placeholder="Search visitors..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-64 md:w-80 h-9 pl-9 pr-3 rounded-lg border border-[#E8E8E5] bg-[#F7F7F5] text-xs text-[#18181B] placeholder-[#A1A1AA] transition-all focus:bg-white focus:outline-none focus:border-[#D4D4D0] focus:ring-1 focus:ring-[#16A34A]"
          />
        </div>

        {/* Public Visitor Request Portal Link */}
        <Link
          href="/request"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E8E5] text-xs font-semibold text-[#18181B] bg-white hover:bg-[#F7F7F5] transition-colors"
          title="Open Public Visitor Request Portal (/request)"
        >
          <ArrowSquareOutIcon size={14} />
          <span>Public Form</span>
        </Link>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-[#71717A] hover:bg-[#F0F0ED] hover:text-[#18181B] transition-colors"
          title="Notifications"
        >
          <BellIcon size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E8E8E5]">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-[#18181B] leading-tight">
              Elena Rivera
            </p>
            <p className="text-[10px] text-[#71717A]">Head Receptionist</p>
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#E4E4E7] border border-[#E8E8E5] shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
              alt="Elena Rivera"
              fill
              className="object-cover"
              sizes="32px"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
