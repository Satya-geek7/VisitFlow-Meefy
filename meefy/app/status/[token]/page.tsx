"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ShieldCheckIcon,
  QrCodeIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@phosphor-icons/react";
import logo from "@/public/images/logo.svg";
import { VisitorRecord } from "@/types/visitor";
import { INITIAL_VISITORS } from "@/data/visitors";

export default function AppointmentStatusPage() {
  const params = useParams();
  const rawToken = params?.token as string;
  const token = rawToken?.toUpperCase();

  const [appointment, setAppointment] = useState<VisitorRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    // First check local initial visitors
    const foundInitial = INITIAL_VISITORS.find(
      (v) =>
        v.passNumber.toUpperCase() === token ||
        v.id.toUpperCase() === token ||
        v.id.toUpperCase() === `V-${token}`
    );

    if (foundInitial) {
      setAppointment(foundInitial);
      setLoading(false);
      return;
    }

    // Otherwise fetch from /api/appointments/[token]
    fetch(`/api/appointments/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.appointment) {
          setAppointment(data.appointment);
        } else {
          setError(`No active record found for tracking pass: ${token}`);
        }
      })
      .catch(() => {
        setError("Network error while retrieving appointment pass.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return {
          bg: "bg-amber-50",
          text: "text-amber-800",
          border: "border-amber-200",
          label: "Submitted • Awaiting Screening",
        };
      case "SCREENED":
      case "HOST_PENDING":
        return {
          bg: "bg-blue-50",
          text: "text-blue-800",
          border: "border-blue-200",
          label: "Screened • Pending Host Clearance",
        };
      case "APPROVED":
      case "PASS_ISSUED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-800",
          border: "border-emerald-200",
          label: "Approved • QR Pass Active",
        };
      case "CHECKED_IN":
        return {
          bg: "bg-green-100",
          text: "text-green-900",
          border: "border-green-300",
          label: "Admitted • On Campus",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-200",
          label: status,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#18181B] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 w-full bg-white border-b border-[#E8E8E5] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shadow-xs overflow-hidden">
            <Image src={logo} alt="VisitFlow logo" width={28} height={28} priority />
          </div>
          <div>
            <span className="text-sm font-bold text-[#18181B] group-hover:text-[#16A34A] transition-colors">
              VisitFlow
            </span>
            <p className="text-[10px] text-[#71717A]">Digital Pass Verification</p>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E8E5] text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-[#F7F7F5] transition-colors"
        >
          <ArrowLeftIcon size={13} />
          <span>Portal Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-8 md:py-12">
        {loading ? (
          <div className="p-12 text-center space-y-3 bg-white border border-[#E8E8E5] rounded-2xl shadow-xs">
            <div className="w-8 h-8 mx-auto border-3 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#71717A] font-medium">Looking up campus pass record...</p>
          </div>
        ) : error || !appointment ? (
          <div className="p-8 text-center bg-white border border-[#E8E8E5] rounded-2xl shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              ✕
            </div>
            <h2 className="text-base font-bold text-[#18181B]">Pass Not Found</h2>
            <p className="text-xs text-[#71717A]">{error}</p>
            <div className="pt-2">
              <Link
                href="/request"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
              >
                Submit New Visit Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E8E5] rounded-2xl shadow-lg overflow-hidden space-y-6">
            {/* Header Badge */}
            <div className="p-6 bg-[#F7F7F5] border-b border-[#E8E8E5] text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider">
                {(() => {
                  const badge = getStatusBadge(appointment.status);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <ShieldCheckIcon size={14} weight="bold" />
                      <span>{badge.label}</span>
                    </span>
                  );
                })()}
              </div>

              <h1 className="text-xl font-bold text-[#18181B]">{appointment.name}</h1>
              <p className="text-xs text-[#71717A]">{appointment.organization || "Public Visitor"}</p>
            </div>

            {/* QR Section */}
            <div className="px-6 text-center space-y-3">
              <div className="w-48 h-48 mx-auto p-3 bg-white border-2 border-dashed border-[#D4D4D0] rounded-2xl flex flex-col items-center justify-center shadow-xs">
                {appointment.status === "APPROVED" ||
                appointment.status === "PASS_ISSUED" ||
                appointment.status === "CHECKED_IN" ? (
                  <div className="space-y-2">
                    <div className="w-36 h-36 bg-neutral-900 rounded-xl flex items-center justify-center text-white">
                      <QrCodeIcon size={120} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-[#71717A] p-2">
                    <ClockIcon size={36} className="mx-auto text-amber-600" />
                    <p className="text-[11px] font-semibold text-[#18181B]">Pass Pending Approval</p>
                    <p className="text-[10px] leading-tight">
                      QR entry code activates automatically once host officer clears screening.
                    </p>
                  </div>
                )}
              </div>

              <div className="inline-block px-3 py-1 rounded-lg bg-[#F4F4F5] border border-[#E4E4E7] font-mono text-sm font-bold text-[#18181B]">
                {appointment.passNumber}
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-[#F7F7F5] p-4 rounded-xl border border-[#E8E8E5]">
                <div>
                  <span className="text-[11px] text-[#71717A] block">Host Officer:</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">
                    {appointment.hostName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71717A] block">Department:</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">
                    {appointment.department}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71717A] block">Time Slot:</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">
                    {appointment.scheduledTime}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71717A] block">Accompanying:</span>
                  <span className="font-semibold text-[#18181B] mt-0.5 block">
                    {appointment.accompanyingCount} Guest(s)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Gate Entry Guidelines:</span>
                <p className="text-[11px] leading-relaxed">
                  Present this digital QR pass at Gate 1 or Gate 2 scanner on arrival. Please carry a valid government photo ID matching your registration.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E8E8E5] bg-white py-4 px-6 text-center text-xs text-[#71717A]">
        <p>© 2026 VisitFlow (VAMS) • Institutional Digital Entry Pass</p>
      </footer>
    </div>
  );
}
