import React, { useState } from "react";
import { WalkInFormData } from "@/types/visitor.types";

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: WalkInFormData) => void;
}

export function WalkInModal({ isOpen, onClose, onSubmit }: WalkInModalProps) {
  const [formData, setFormData] = useState<WalkInFormData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    idType: "Aadhaar Card",
    idNumber: "",
    hostName: "Dr. P. K. Dash (Director)",
    department: "Executive Directorate",
    purpose: "",
    accompanyingCount: 0,
    vehicleNumber: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.purpose) {
      alert("Please fill in the required fields: Full Name, Phone, and Purpose of visit.");
      return;
    }
    onSubmit(formData);
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      organization: "",
      idType: "Aadhaar Card",
      idNumber: "",
      hostName: "Dr. P. K. Dash (Director)",
      department: "Executive Directorate",
      purpose: "",
      accompanyingCount: 0,
      vehicleNumber: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-950">
              Walk-In Visitor Registration
            </h3>
            <p className="text-xs text-neutral-500">
              Reception gate entry & automatic host announcement
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="visitor@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Official ID Verification Type
              </label>
              <select
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Government ID">Government Official ID</option>
                <option value="Driving License">Driving License</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Student / College ID">Student ID</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                ID Number / Reference
              </label>
              <input
                type="text"
                placeholder="Last 4 digits or ID number"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Host Officer to Meet
              </label>
              <select
                value={formData.hostName}
                onChange={(e) =>
                  setFormData({ ...formData, hostName: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Dr. P. K. Dash (Director)">
                  Dr. P. K. Dash (Director)
                </option>
                <option value="Er. Soumya Mishra (Head, Training)">
                  Er. Soumya Mishra (Head, Training)
                </option>
                <option value="Shri B. C. Panda (Systems In-charge)">
                  Shri B. C. Panda (Systems)
                </option>
                <option value="Dr. A. Nayak (Academic Coordinator)">
                  Dr. A. Nayak (Academics)
                </option>
                <option value="Shri K. C. Tripathy (Admin)">
                  Shri K. C. Tripathy (Admin)
                </option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Target Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              >
                <option value="Executive Directorate">Executive Directorate</option>
                <option value="Software & Training Div">
                  Software & Training Div
                </option>
                <option value="Hardware & Networking">
                  Hardware & Networking
                </option>
                <option value="Academics">Academics</option>
                <option value="Administration & Stores">
                  Administration & Stores
                </option>
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
              placeholder="State the official agenda or context of the meeting..."
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Accompanying Persons
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
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Vehicle Registration # (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. OD-02-AX-1234"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleNumber: e.target.value })
                }
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
              />
            </div>
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
              Confirm & Generate Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
