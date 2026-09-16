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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-neutral-950">
                Walk-In Express Registration Lane
              </h3>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                Gate Arrival
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Rapid on-spot entry for unannounced guests with instant host alert dispatch
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra Das"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Organization / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Bhubaneswar / Vendor Co."
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="visitor@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Official ID Type *
              </label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Government ID">Government Official ID</option>
                <option value="Driving License">Driving License</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Student / College ID">Student / College ID</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                ID Reference / Last 4 digits
              </label>
              <input
                type="text"
                placeholder="e.g. 4519 or DL-0210"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Host Officer to Meet *
              </label>
              <select
                value={formData.hostName}
                onChange={(e) => handleOfficerChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                {INITIAL_OFFICERS.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.designation})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Allocated Room / Desk
              </label>
              <select
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
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
            <label className="block font-semibold text-neutral-700 mb-1">
              Purpose of Visit *
            </label>
            <textarea
              rows={2}
              required
              placeholder="State agenda of meeting (e.g. Official consultation, tender clarification, hardware delivery)..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Vehicle # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. OD-02-AX-1234"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 p-3 text-amber-900 border border-amber-100 flex items-start space-x-2">
            <span className="mt-0.5 text-amber-600">⚡</span>
            <p className="text-[11px] leading-relaxed">
              Upon confirmation, an immediate high-priority web notification is sent to{" "}
              <span className="font-semibold">{formData.hostName}</span> with a 5-minute countdown.
              The visitor is admitted directly and issued a gate QR pass.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-medium text-white shadow-xs hover:bg-neutral-800 transition-all"
            >
              Admit & Issue Digital Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
