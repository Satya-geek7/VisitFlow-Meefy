import React, { useState } from "react";
import { VisitorRecord } from "@/types/visitor.types";

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: VisitorRecord[];
  onStatusToggle: (id: string) => void;
}

export function ScannerModal({
  isOpen,
  onClose,
  visitors,
  onStatusToggle,
}: ScannerModalProps) {
  const [scannerInput, setScannerInput] = useState("PAS-2026-0894");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScan = () => {
    const target = visitors.find(
      (v) => v.passNumber.toLowerCase() === scannerInput.trim().toLowerCase()
    );
    if (!target) {
      setFeedback("Error: Unrecognized QR pass code. No record found.");
      return;
    }
    if (target.status === "APPROVED") {
      onStatusToggle(target.id);
      setFeedback(
        `Verified! Checked In: ${target.name} (${target.organization}) -> Heading to: ${target.hostName}`
      );
    } else if (target.status === "CHECKED_IN") {
      onStatusToggle(target.id);
      setFeedback(
        `Departure Recorded! Checked Out: ${target.name}. Pass completed.`
      );
    } else {
      setFeedback(`Pass Status: ${target.status}. No gate action needed.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Security Gate QR Scanner
            </h3>
            <p className="text-xs text-neutral-500">
              Fast arrival check-in and departure check-out
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setFeedback(null);
            }}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="my-5 text-center">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400 bg-neutral-50">
            <span className="absolute inset-x-4 top-1/2 h-0.5 bg-red-500 animate-pulse"></span>
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
              <p className="mt-2 text-xs text-neutral-500">Camera Scanner Ready</p>
            </div>
          </div>

          {feedback && (
            <div className="mt-4 rounded-xl bg-neutral-900 p-3 text-left text-xs font-medium text-emerald-400 border border-neutral-800">
              {feedback}
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 pt-4 text-xs">
          <p className="font-semibold text-neutral-700 mb-2">
            Simulate Optical Scan with Pass ID:
          </p>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="e.g. PAS-2026-0894"
              value={scannerInput}
              onChange={(e) => setScannerInput(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 transition-all"
            />
            <button
              onClick={handleScan}
              className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 shadow-xs transition-colors"
            >
              Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
