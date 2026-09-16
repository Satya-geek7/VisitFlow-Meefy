import React, { useState } from "react";
import { VisitorRecord } from "@/types/visitor";
import { getInitials } from "@/lib/utils";

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: VisitorRecord[];
  onStatusToggle: (id: string) => void;
}

export function GateScannerModal({
  isOpen,
  onClose,
  visitors,
  onStatusToggle,
}: GateScannerModalProps) {
  const [scannerInput, setScannerInput] = useState("VIS-2026-0894");
  const [scannedRecord, setScannedRecord] = useState<VisitorRecord | null>(null);
  const [scanResult, setScanResult] = useState<{
    status: "IDLE" | "SUCCESS" | "ERROR";
    message: string;
    actionType?: "CHECK_IN" | "CHECK_OUT" | "NONE";
  }>({ status: "IDLE", message: "" });

  if (!isOpen) return null;

  const handleScan = () => {
    const input = scannerInput.trim().toUpperCase();
    const match = visitors.find(
      (v) => v.passNumber.toUpperCase() === input || v.id.toUpperCase() === input
    );

    if (!match) {
      setScannedRecord(null);
      setScanResult({
        status: "ERROR",
        message: "QR Pass Not Recognized: No active appointment or pass record found for this token.",
        actionType: "NONE",
      });
      return;
    }

    setScannedRecord(match);

    if (match.status === "APPROVED" || match.status === "PASS_ISSUED") {
      setScanResult({
        status: "SUCCESS",
        message: `Pass Verified: Scheduled for ${match.scheduledTime} with ${match.hostName}. Ready for Campus Entry.`,
        actionType: "CHECK_IN",
      });
    } else if (match.status === "CHECKED_IN") {
      setScanResult({
        status: "SUCCESS",
        message: `Currently Inside: Checked in at ${match.checkInTime || "morning"}. Ready for Departure Clearance.`,
        actionType: "CHECK_OUT",
      });
    } else if (match.status === "CHECKED_OUT") {
      setScanResult({
        status: "ERROR",
        message: "Pass Already Closed: This pass was already checked out and is no longer valid for re-entry.",
        actionType: "NONE",
      });
    } else if (match.status === "HOST_PENDING" || match.status === "SUBMITTED") {
      setScanResult({
        status: "ERROR",
        message: `Pass Incomplete: Status is '${match.status}'. The host officer has not authorized entry yet.`,
        actionType: "NONE",
      });
    } else {
      setScanResult({
        status: "ERROR",
        message: `Invalid Pass State: Status '${match.status}'. Entry cannot be granted.`,
        actionType: "NONE",
      });
    }
  };

  const handleConfirmAction = () => {
    if (!scannedRecord) return;
    onStatusToggle(scannedRecord.id);

    if (scanResult.actionType === "CHECK_IN") {
      setScanResult({
        status: "SUCCESS",
        message: `Entry Approved! ${scannedRecord.name} marked as CHECKED_IN. Host notified automatically.`,
        actionType: "NONE",
      });
    } else if (scanResult.actionType === "CHECK_OUT") {
      setScanResult({
        status: "SUCCESS",
        message: `Exit Recorded! ${scannedRecord.name} marked as CHECKED_OUT. Duration logged.`,
        actionType: "NONE",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base font-bold text-neutral-950">
                Security Gate Verification Terminal
              </h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                Gate 1 Optical Scanner
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Validate digital QR pass, confirm photo identity, and log check-in/out
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setScanResult({ status: "IDLE", message: "" });
              setScannedRecord(null);
            }}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Optical Scanner Viewport */}
        <div className="my-5 text-center">
          <div className="relative mx-auto flex h-44 w-full max-w-xs items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-neutral-950 text-white overflow-hidden shadow-inner">
            <span className="absolute inset-x-8 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse"></span>
            <div className="text-center p-4">
              <svg
                className="mx-auto h-8 w-8 text-neutral-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <p className="mt-2 text-xs font-mono font-semibold text-neutral-200">
                Optical Scanner Armed
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Scan QR token from visitor screen
              </p>
            </div>
          </div>
        </div>

        {/* Simulator Bar */}
        <div className="rounded-2xl bg-neutral-50/80 p-4 border border-neutral-100 text-xs">
          <label className="block font-semibold text-neutral-700 mb-1.5">
            Manual / Optical Pass Reader Token:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. VIS-2026-0894"
              value={scannerInput}
              onChange={(e) => setScannerInput(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-200 bg-white p-2.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
            <button
              onClick={handleScan}
              className="rounded-xl bg-neutral-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-xs active:scale-[0.98]"
            >
              Verify Token
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-neutral-500 font-mono">
            <span>Quick test:</span>
            <button
              type="button"
              onClick={() => setScannerInput("VIS-2026-0894")}
              className="underline hover:text-neutral-900"
            >
              VIS-2026-0894 (Entry)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setScannerInput("VIS-2026-0891")}
              className="underline hover:text-neutral-900"
            >
              VIS-2026-0891 (Exit)
            </button>
          </div>
        </div>

        {/* Scan Results & Confirmation Card */}
        {scanResult.status !== "IDLE" && (
          <div className="mt-5 space-y-3">
            <div
              className={`rounded-2xl p-4 text-xs ${
                scanResult.status === "SUCCESS"
                  ? "bg-emerald-50 text-emerald-950 border border-emerald-200"
                  : "bg-rose-50 text-rose-950 border border-rose-200"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                <span>{scanResult.status === "SUCCESS" ? "✓" : "⚠"}</span>
                <span>{scanResult.status === "SUCCESS" ? "Pass Verification Successful" : "Scan Error / Gate Reject"}</span>
              </div>
              <p className="mt-1 leading-relaxed text-neutral-700">{scanResult.message}</p>
            </div>

            {scannedRecord && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 text-xs gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-200 text-sm font-black text-neutral-800">
                    {getInitials(scannedRecord.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-950 text-sm">{scannedRecord.name}</h4>
                    <p className="text-neutral-500 font-medium">
                      {scannedRecord.organization} • ID: {scannedRecord.idType} ({scannedRecord.idNumberMasked})
                    </p>
                    <p className="text-neutral-600 mt-0.5">
                      Host: <strong className="text-neutral-900">{scannedRecord.hostName}</strong> ({scannedRecord.department})
                    </p>
                  </div>
                </div>

                {scanResult.actionType === "CHECK_IN" && (
                  <button
                    onClick={handleConfirmAction}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all active:scale-[0.98] shrink-0"
                  >
                    Confirm Check-In
                  </button>
                )}

                {scanResult.actionType === "CHECK_OUT" && (
                  <button
                    onClick={handleConfirmAction}
                    className="rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98] shrink-0"
                  >
                    Confirm Check-Out
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
