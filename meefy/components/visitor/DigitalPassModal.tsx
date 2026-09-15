import React from "react";
import { VisitorRecord } from "@/types/visitor.types";

interface DigitalPassModalProps {
  visitor: VisitorRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DigitalPassModal({
  visitor,
  isOpen,
  onClose,
}: DigitalPassModalProps) {
  if (!isOpen || !visitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
        >
          ✕
        </button>

        {/* Pass Header */}
        <div className="text-center border-b border-dashed border-neutral-200 pb-4">
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            NIELIT BHUBANESWAR
          </span>
          <h3 className="text-base font-extrabold text-neutral-900 tracking-tight mt-0.5">
            OFFICIAL VISITOR PASS
          </h3>
          <p className="font-mono text-xs font-semibold text-neutral-600 mt-1">
            {visitor.passNumber}
          </p>
        </div>

        {/* Pass Body & QR Code */}
        <div className="py-5 text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-neutral-900 p-2.5 bg-white shadow-xs">
            {/* SVG QR Code Simulation */}
            <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
              <rect
                x="5"
                y="5"
                width="30"
                height="30"
                stroke="#000"
                strokeWidth="6"
                rx="4"
              />
              <rect x="13" y="13" width="14" height="14" fill="#000" />
              <rect
                x="65"
                y="5"
                width="30"
                height="30"
                stroke="#000"
                strokeWidth="6"
                rx="4"
              />
              <rect x="73" y="13" width="14" height="14" fill="#000" />
              <rect
                x="5"
                y="65"
                width="30"
                height="30"
                stroke="#000"
                strokeWidth="6"
                rx="4"
              />
              <rect x="13" y="73" width="14" height="14" fill="#000" />
              <rect x="42" y="10" width="8" height="8" fill="#000" />
              <rect x="52" y="22" width="8" height="8" fill="#000" />
              <rect x="42" y="38" width="16" height="8" fill="#000" />
              <rect x="10" y="45" width="8" height="14" fill="#000" />
              <rect x="25" y="45" width="12" height="8" fill="#000" />
              <rect x="65" y="45" width="10" height="12" fill="#000" />
              <rect x="80" y="45" width="10" height="8" fill="#000" />
              <rect x="42" y="65" width="8" height="25" fill="#000" />
              <rect x="55" y="75" width="15" height="10" fill="#000" />
              <rect x="75" y="65" width="15" height="8" fill="#000" />
              <rect x="75" y="80" width="18" height="10" fill="#000" />
            </svg>
          </div>

          <div className="mt-4">
            <h4 className="text-base font-bold text-neutral-900">{visitor.name}</h4>
            <p className="text-xs font-medium text-neutral-500">
              {visitor.organization}
            </p>
            <span className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
              {visitor.status}
            </span>
          </div>
        </div>

        {/* Pass Metadata */}
        <div className="space-y-2 border-t border-dashed border-neutral-200 pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Host Officer:</span>
            <span className="font-semibold text-neutral-900 text-right">
              {visitor.hostName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Department:</span>
            <span className="font-medium text-neutral-800">
              {visitor.department}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Slot / Window:</span>
            <span className="font-medium text-neutral-800">
              {visitor.scheduledTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">ID Verification:</span>
            <span className="font-mono text-neutral-700">
              {visitor.idNumberMasked}
            </span>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <button
            onClick={() => window.print()}
            className="flex-1 rounded-xl bg-neutral-900 py-2 text-xs font-medium text-white hover:bg-neutral-800 shadow-xs transition-colors"
          >
            Print Badge / Pass
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
