"use client";

import React from "react";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  ClockIcon,
  ChatTextIcon,
  ArrowRightIcon,
  CircleNotchIcon,
  UsersIcon,
  NotePencilIcon,
} from "@phosphor-icons/react";
import { INITIAL_OFFICERS } from "@/data/officers";
import { INITIAL_DEPARTMENTS } from "@/data/departments";
import { VisitorRequestInput } from "@/lib/validations/visitor.schema";

export const TIME_SLOTS = [
  "10:00 AM – 10:30 AM",
  "10:30 AM – 11:30 AM",
  "11:30 AM – 12:30 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
];

interface VisitDetailsFormProps {
  formData: VisitorRequestInput;
  setFormData: React.Dispatch<React.SetStateAction<VisitorRequestInput>>;
  fieldErrors: Record<string, string>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function VisitDetailsForm({
  formData,
  setFormData,
  fieldErrors,
  isSubmitting,
  onSubmit,
}: VisitDetailsFormProps) {
  const handleOfficerChange = (officerName: string) => {
    const officer = INITIAL_OFFICERS.find((o) => o.name === officerName);
    setFormData((prev) => ({
      ...prev,
      preferredOfficer: officerName,
      department: officer ? officer.departmentName : prev.department,
    }));
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Visitor Information</h2>
          <p className="text-xs text-gray-500 mt-1">
            Provide your authentic contact credentials for entry clearance and digital pass generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.name
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20"
                    : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-600"
                }`}
              />
            </div>
            {fieldErrors.name && <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Mobile Number (10 digits) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <PhoneIcon size={18} />
              </span>
              <input
                type="tel"
                placeholder="e.g. 9853311223"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({ ...prev, phone: val }));
                }}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border rounded-lg focus:outline-none focus:ring-2 font-mono transition-all ${
                  fieldErrors.phone
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20"
                    : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-600"
                }`}
              />
            </div>
            {fieldErrors.phone && <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.phone}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-gray-400 font-normal">(for digital pass copy)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <EnvelopeIcon size={18} />
              </span>
              <input
                type="email"
                placeholder="rajesh.kumar@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20"
                    : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-600"
                }`}
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.email}</p>}
          </div>

          {/* Organization / Affiliation */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Organization / Company <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <BuildingsIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="e.g. TCS / Tech Mahindra / Independent"
                value={formData.organization}
                onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Specifics */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Visit Specifications</h2>
          <p className="text-xs text-gray-500 mt-1">
            Designate the officer or department you need to consult and preferred appointment timing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Host Officer */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Officer to Meet <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.preferredOfficer}
              onChange={(e) => handleOfficerChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
            >
              {INITIAL_OFFICERS.map((off) => (
                <option key={off.id} value={off.name}>
                  {off.name} ({off.designation})
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
            >
              {INITIAL_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Preferred Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <CalendarBlankIcon size={18} />
              </span>
              <input
                type="date"
                min={todayStr}
                value={formData.preferredDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>
            {fieldErrors.preferredDate && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.preferredDate}</p>
            )}
          </div>

          {/* Preferred Time Slot */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Preferred Time Slot <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ClockIcon size={18} />
              </span>
              <select
                value={formData.preferredTimeSlot}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferredTimeSlot: e.target.value }))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accompanying Count */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Accompanying Persons (Max 5)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UsersIcon size={18} />
              </span>
              <input
                type="number"
                min={0}
                max={5}
                value={formData.accompanyingCount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, accompanyingCount: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>

          {/* Purpose of Visit */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Detailed Purpose of Visit <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                <ChatTextIcon size={18} />
              </span>
              <textarea
                rows={3}
                placeholder="State the objective of your visit (e.g., project review, equipment delivery, official vendor consultation)..."
                value={formData.purpose}
                onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.purpose
                    ? "border-rose-400 focus:ring-rose-200 focus:border-rose-500 bg-rose-50/20"
                    : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-600"
                }`}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              {fieldErrors.purpose ? (
                <p className="text-xs text-rose-600 font-medium">{fieldErrors.purpose}</p>
              ) : (
                <span className="text-xs text-gray-400">Minimum 10 characters required</span>
              )}
              <span className="text-xs text-gray-400">{formData.purpose.length}/500</span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                <NotePencilIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="e.g. Carrying personal laptop (Serial #XYZ)"
                value={formData.notes || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-60 cursor-pointer min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <CircleNotchIcon size={18} className="animate-spin" />
              <span>Sending Verification Code...</span>
            </>
          ) : (
            <>
              <span>Proceed to Mobile Verification</span>
              <ArrowRightIcon size={18} weight="bold" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
