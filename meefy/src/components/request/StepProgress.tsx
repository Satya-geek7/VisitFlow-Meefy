"use client";

import React from "react";
import { UserIcon, ShieldCheckIcon, CheckCircleIcon } from "@phosphor-icons/react";

interface StepProgressProps {
  currentStep: 1 | 2 | 3;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps = [
    { number: 1, label: "Visit Details", icon: UserIcon },
    { number: 2, label: "Security Verification", icon: ShieldCheckIcon },
    { number: 3, label: "Confirmation", icon: CheckCircleIcon },
  ];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-xs mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-emerald-600 transition-all duration-300 z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "calc(100% - 4rem)",
          }}
        />

        {steps.map((s) => {
          const isDone = currentStep > s.number;
          const isActive = currentStep === s.number;
          const Icon = s.icon;

          return (
            <div key={s.number} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                  isDone
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isActive
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {isDone ? <CheckCircleIcon size={20} weight="bold" /> : <Icon size={18} weight="bold" />}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-tight text-center ${
                  isActive ? "text-emerald-700 font-semibold" : isDone ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
