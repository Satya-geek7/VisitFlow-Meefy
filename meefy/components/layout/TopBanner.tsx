import React from "react";

export function TopBanner() {
  return (
    <div className="border-b border-neutral-200/80 bg-white/80 px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-neutral-500 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-bold tracking-widest text-neutral-900 uppercase text-[11px]">
            NIELIT
          </span>
          <span className="text-neutral-300">|</span>
          <span className="hidden sm:inline font-medium text-neutral-600">
            National Institute of Electronics & Information Technology • MeitY, Govt. of India
          </span>
          <span className="sm:hidden font-medium text-neutral-600">
            NIELIT Bhubaneswar
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-neutral-800">Campus Security Active</span>
          </span>
          <span className="text-neutral-300 hidden md:inline">|</span>
          <span className="text-neutral-500 hidden md:inline">Bhubaneswar, Odisha</span>
        </div>
      </div>
    </div>
  );
}
