import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  badgeText?: string;
  badgeType?: "success" | "warning" | "neutral";
  footerLeft?: string;
  footerRight?: string;
  livePulse?: boolean;
}

export function MetricCard({
  title,
  value,
  subValue,
  badgeText,
  badgeType = "neutral",
  footerLeft,
  footerRight,
  livePulse = false,
}: MetricCardProps) {
  return (
    <div className="group rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        {livePulse && (
          <span className="flex h-3 w-3 items-center justify-center">
            <span className="absolute h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative h-2 w-2 rounded-full bg-emerald-600"></span>
          </span>
        )}
        {badgeText && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition-colors ${
              badgeType === "warning"
                ? "bg-amber-50 text-amber-800 border-amber-200/80"
                : badgeType === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                : "bg-neutral-100 text-neutral-600 border-neutral-200/80"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline space-x-2">
        <span className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950">
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-medium text-neutral-400">
            {subValue}
          </span>
        )}
      </div>

      {(footerLeft || footerRight) && (
        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <span className="font-medium text-neutral-400">{footerLeft}</span>
          <span className="font-semibold text-neutral-800">{footerRight}</span>
        </div>
      )}
    </div>
  );
}
