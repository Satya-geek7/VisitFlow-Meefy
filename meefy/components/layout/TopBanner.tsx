import React from "react";

export function TopBanner() {
  return (
    <div className="border-b border-neutral-200 bg-white px-6 py-2.5 text-xs text-neutral-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wider text-neutral-900 uppercase">
            NIELIT
          </span>
          <span className="text-neutral-300">|</span>
          <span className="hidden sm:inline">
            National Institute of Electronics & Information Technology, MeitY, Govt. of India
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-neutral-700">Access Control Active</span>
          </span>
          <span className="text-neutral-300">|</span>
          <span>Bhubaneswar, Odisha</span>
        </div>
      </div>
    </div>
  );
}
