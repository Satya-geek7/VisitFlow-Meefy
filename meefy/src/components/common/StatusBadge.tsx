import React from "react";
import { VisitStatus } from "@/types/visitor";

interface StatusBadgeProps {
  status: VisitStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  switch (status) {
    case "CHECKED_IN":
      return (
        <span
          className={`inline-flex items-center rounded-full font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
        >
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
          Inside Campus
        </span>
      );

    case "APPROVED":
    case "PASS_ISSUED":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          Pass Ready
        </span>
      );

    case "HOST_PENDING":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
        >
          Awaiting Officer
        </span>
      );

    case "SUBMITTED":
    case "SCREENED":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200 ${sizeClasses}`}
        >
          Needs Screening
        </span>
      );

    case "CHECKED_OUT":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-neutral-100 text-neutral-600 border border-neutral-200 ${sizeClasses}`}
        >
          Checked Out
        </span>
      );

    case "DECLINED":
    case "REJECTED":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}
        >
          {status === "DECLINED" ? "Host Declined" : "Rejected"}
        </span>
      );

    case "NO_SHOW":
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-neutral-200 text-neutral-700 border border-neutral-300 ${sizeClasses}`}
        >
          No Show
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center rounded-full font-medium bg-neutral-100 text-neutral-700 border border-neutral-200 ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
