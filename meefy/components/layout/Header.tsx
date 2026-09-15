import React from "react";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { TabKey } from "@/types/visitor.types";

interface HeaderProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  pendingApprovalsCount: number;
  onOpenScanner: () => void;
  onOpenWalkIn: () => void;
}

export function Header({
  activeTab,
  onTabChange,
  pendingApprovalsCount,
  onOpenScanner,
  onOpenWalkIn,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-8">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-neutral-200 p-1 shadow-xs">
              <Image
                src="/images/NIELIT.png"
                alt="NIELIT Logo"
                width={90}
                height={90}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-neutral-950">
                  meefy
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Visitor & Meeting Intelligence Engine
              </p>
            </div>
          </div>

          {/* Navigation */}
          <Navigation
            activeTab={activeTab}
            onTabChange={onTabChange}
            pendingApprovalsCount={pendingApprovalsCount}
          />
        </div>

        {/* Action CTAs */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenScanner}
            className="hidden sm:inline-flex items-center space-x-2 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
          >
            <svg
              className="h-4 w-4 text-neutral-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Scan QR Pass</span>
          </button>
          <button
            onClick={onOpenWalkIn}
            className="inline-flex items-center space-x-2 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.99]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New Walk-In Visitor</span>
          </button>
        </div>
      </div>
    </header>
  );
}
