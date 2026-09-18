import React from "react";
import { VisitorRecord } from "@/types/visitor";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 print:p-0 overflow-y-auto">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl print:border-none print:shadow-none print:max-w-none my-6">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors print:hidden"
        >
          ✕
        </button>

        {/* Pass Header */}
        <div className="text-center border-b border-dashed border-neutral-200 pb-5">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            <span>VISITOR ACCESS PASS</span>
            <span>•</span>
            <span>SECURE CAMPUS ENTRY</span>
          </div>
          <h3 className="text-lg font-black text-neutral-950 tracking-tight mt-1 uppercase">
            Official Visitor Entry Pass
          </h3>
          <p className="font-mono text-xs font-bold text-neutral-600 mt-1">
            {visitor.passNumber}
          </p>
        </div>

        {/* Pass Body & QR Code */}
        <div className="py-6 text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-3xl border-2 border-neutral-950 p-3 bg-white shadow-xs">
            {/* SVG QR Code Simulation */}
            <svg className="h-full w-full" viewBox="0 0 100 100" fill="none">
              <rect x="5" y="5" width="30" height="30" stroke="#000" strokeWidth="6" rx="4" />
              <rect x="13" y="13" width="14" height="14" fill="#000" />
              <rect x="65" y="5" width="30" height="30" stroke="#000" strokeWidth="6" rx="4" />
              <rect x="73" y="13" width="14" height="14" fill="#000" />
              <rect x="5" y="65" width="30" height="30" stroke="#000" strokeWidth="6" rx="4" />
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
            <h4 className="text-lg font-black tracking-tight text-neutral-950">{visitor.name}</h4>
            <p className="text-xs text-neutral-500 font-semibold mt-0.5">
              {visitor.organization}
            </p>
            <div className="mt-2">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                {visitor.status === "CHECKED_IN" ? "Checked In (Active On-Premises)" : "Approved For Gate Access"}
              </span>
            </div>
          </div>
        </div>

        {/* Pass Metadata */}
        <div className="space-y-2.5 border-t border-dashed border-neutral-200 pt-4 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Host Officer:</span>
            <span className="font-bold text-neutral-900 text-right">
              {visitor.hostName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Department:</span>
            <span className="font-semibold text-neutral-800">
              {visitor.department}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Valid Slot Window:</span>
            <span className="font-semibold text-neutral-800">
              {visitor.scheduledTime}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Designated Venue:</span>
            <span className="font-bold text-indigo-700">
              {visitor.roomName || "Main Office / Reception Desk"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500 font-medium">Verified ID:</span>
            <span className="font-mono text-neutral-700 font-semibold">
              {visitor.idType} ({visitor.idNumberMasked})
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-6 flex space-x-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 rounded-2xl bg-neutral-950 py-3 text-xs font-bold text-white hover:bg-neutral-800 shadow-xs transition-all active:scale-[0.98]"
          >
            🖨 Print Badge / Pass
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl border border-neutral-200 px-4 py-3 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
