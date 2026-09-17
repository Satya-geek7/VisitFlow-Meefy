import React, { useState } from "react";
import { WalkInFormData } from "@/types/visitor";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_ROOMS } from "@/data/rooms";

interface WalkInExpressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: WalkInFormData) => void;
}

export function WalkInExpressModal({
  isOpen,
  onClose,
  onSubmit,
}: WalkInExpressModalProps) {
  const [formData, setFormData] = useState<WalkInFormData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    idType: "Aadhaar Card",
    idNumber: "",
    hostName: INITIAL_OFFICERS[0].name,
    department: INITIAL_OFFICERS[0].departmentName,
    purpose: "",
    accompanyingCount: 0,
    vehicleNumber: "",
    roomName: "Reception Consultation Desk",
  });

  if (!isOpen) return null;

  const handleOfficerChange = (officerName: string) => {
    const officer = INITIAL_OFFICERS.find((o) => o.name === officerName);
    setFormData({
      ...formData,
      hostName: officerName,
      department: officer ? officer.departmentName : formData.department,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.purpose) {
      alert("Please enter all required fields: Full Name, Phone, and Purpose.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5 shrink-0">
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-lg font-black tracking-tight text-neutral-950">
                Walk-In Express Entry Lane
              </h3>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                Gate 1 Check-In
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Rapid on-spot admission for unannounced guests with instant host officer dispatch
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra Das"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Organization / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Bhubaneswar / Vendor Co."
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="visitor@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Official ID Type *
              </label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Government ID">Government Official ID</option>
                <option value="Driving License">Driving License</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Student / College ID">Student / College ID</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                ID Reference / Number
              </label>
              <input
                type="text"
                placeholder="e.g. 4519 or DL-0210"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Host Officer to Meet *
              </label>
              <select
                value={formData.hostName}
                onChange={(e) => handleOfficerChange(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                {INITIAL_OFFICERS.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.designation})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Allocated Room / Desk
              </label>
              <select
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Reception Consultation Desk">Reception Consultation Desk</option>
                {INITIAL_ROOMS.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.floor})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1.5">
              Purpose of Visit *
            </label>
            <textarea
              rows={2}
              required
              placeholder="State purpose of visit (e.g. Official inquiry, document submission, lab inspection)..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Accompanying Guests
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.accompanyingCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accompanyingCount: Number(e.target.value),
                  })
                }
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1.5">
                Vehicle # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. OD-02-AX-1234"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value })
                }
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50/70 p-3 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/80 p-4 text-amber-900 border border-amber-200/60 flex items-start space-x-3">
            <span className="mt-0.5 text-base">⚡</span>
            <p className="text-[11px] leading-relaxed">
              Upon submission, an immediate high-priority web notification is dispatched to{" "}
              <strong className="text-neutral-900">{formData.hostName}</strong> with a 5-minute countdown.
              The visitor is admitted directly and a secure gate pass is generated.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-neutral-100 pt-5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition-all active:scale-[0.98]"
            >
              Admit & Issue Digital Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
