"use client";

import React, { useState } from "react";
import { VisitorRecord } from "@/types/visitor";
import { ScanResultSuccess } from "./ScanResultSuccess";
import { ScanResultFailure } from "./ScanResultFailure";
import {
  QrCodeIcon,
  FlashlightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

interface GateScanViewProps {
  visitors: VisitorRecord[];
  onCheckIn: (visitorId: string) => void;
  onOpenWalkIn: () => void;
}

export function GateScanView({
  visitors,
  onCheckIn,
  onOpenWalkIn,
}: GateScanViewProps) {
  const [scanState, setScanState] = useState<"viewfinder" | "success" | "failure">("viewfinder");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRecord | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  // Trigger success for a specific visitor or default Marcus Sterling (#VF-90821)
  const handleSimulateSuccess = (visitor?: VisitorRecord) => {
    const target =
      visitor ||
      visitors.find((v) => v.passNumber === "VF-90821" || v.passNumber === "APT-9402") ||
      visitors[0];
    setSelectedVisitor(target);
    setScanState("success");
  };

  const handleSimulateFailure = () => {
    setScanState("failure");
  };

  const handleManualLookup = (query: string) => {
    const found = visitors.find(
      (v) =>
        v.passNumber.toLowerCase().includes(query.toLowerCase()) ||
        v.email.toLowerCase().includes(query.toLowerCase()) ||
        v.phone.includes(query)
    );
    if (found) {
      setSelectedVisitor(found);
      setScanState("success");
    } else {
      setScanState("failure");
    }
  };

  if (scanState === "success" && selectedVisitor) {
    return (
      <ScanResultSuccess
        visitor={selectedVisitor}
        onBackToScanner={() => setScanState("viewfinder")}
        onRescan={() => setScanState("viewfinder")}
        onCompleteCheckIn={(id) => {
          onCheckIn(id);
          setScanState("viewfinder");
        }}
      />
    );
  }

  if (scanState === "failure") {
    return (
      <ScanResultFailure
        onBackToScanner={() => setScanState("viewfinder")}
        onRetryScan={() => setScanState("viewfinder")}
        onManualOverride={() => {
          if (visitors[0]) {
            setSelectedVisitor(visitors[0]);
            setScanState("success");
          }
        }}
        onManualLookup={handleManualLookup}
        onRegisterNewVisitor={onOpenWalkIn}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      {/* Subheader */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#18181B]">
            Gate Scanner Station
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Present digital or printed QR pass to optical reader for automatic gate clearance.
          </p>
        </div>

        {/* Quick simulation pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulateSuccess()}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0] transition-colors flex items-center gap-1"
            title="Preview Screen 3: Access Granted"
          >
            <CheckCircleIcon size={14} weight="bold" />
            <span>Simulate Success</span>
          </button>
          <button
            onClick={handleSimulateFailure}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors flex items-center gap-1"
            title="Preview Screen 4: Expired Pass"
          >
            <XCircleIcon size={14} weight="bold" />
            <span>Simulate Error</span>
          </button>
        </div>
      </div>

      {/* Viewfinder per Design.md §11 */}
      <div className="relative aspect-video max-w-lg mx-auto rounded-2xl bg-neutral-950 border border-[#E8E8E5] overflow-hidden flex flex-col items-center justify-center p-6 shadow-md">
        {/* Corner Brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#22C55E]" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#22C55E]" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#22C55E]" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#22C55E]" />

        {/* Torch toggle */}
        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-colors ${
            torchOn
              ? "bg-amber-400 text-black border-amber-300"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20"
          }`}
          title="Toggle flashlight"
        >
          <FlashlightIcon size={16} weight={torchOn ? "fill" : "regular"} />
        </button>

        {/* Scanner Center Target & Animation */}
        <div className="relative w-48 h-48 border border-white/20 rounded-xl flex flex-col items-center justify-center text-center p-4">
          <QrCodeIcon size={56} weight="thin" className="text-[#22C55E]/80 animate-pulse" />
          <p className="text-[11px] font-medium text-neutral-300 mt-2">
            Align QR pass inside frame
          </p>
        </div>

        <div className="absolute bottom-3 text-center">
          <p className="text-[10px] text-neutral-400 font-mono">
            Optical Sensor Active • 60 FPS
          </p>
        </div>
      </div>

      {/* Manual lookup fallback below */}
      <div className="border border-[#E8E8E5] rounded-xl bg-white p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
          Quick Pass Lookup or Simulation
        </h3>
        <p className="text-xs text-[#71717A]">
          Choose an appointment below to instantly simulate scanning at the gate:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {visitors.slice(0, 4).map((v) => (
            <button
              key={v.id}
              onClick={() => handleSimulateSuccess(v)}
              className="p-2.5 rounded-lg border border-[#E8E8E5] hover:border-[#16A34A] hover:bg-[#F0FDF4]/30 text-left flex items-center justify-between transition-all"
            >
              <div>
                <p className="text-xs font-semibold text-[#18181B]">{v.name}</p>
                <p className="text-[10px] font-mono text-[#71717A]">{v.passNumber}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Scan
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
