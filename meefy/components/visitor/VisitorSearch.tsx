import React from "react";

interface VisitorSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterDepartment: string;
  onDepartmentChange: (department: string) => void;
  onReset: () => void;
}

export function VisitorSearch({
  searchQuery,
  onSearchChange,
  filterDepartment,
  onDepartmentChange,
  onReset,
}: VisitorSearchProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by visitor name, phone, pass #, organization, or host officer..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50/60 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
        />
      </div>

      <div className="flex items-center space-x-2">
        <select
          value={filterDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-2xs focus:border-neutral-900 focus:outline-none"
        >
          <option value="ALL">All Departments</option>
          <option value="Executive Directorate">Executive Directorate</option>
          <option value="Software & Training Div">Software & Training Div</option>
          <option value="Hardware & Networking">Hardware & Networking</option>
          <option value="Academics">Academics</option>
          <option value="Administration & Stores">Administration & Stores</option>
        </select>

        <button
          onClick={onReset}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 shadow-2xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
