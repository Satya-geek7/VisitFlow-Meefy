import React, { useState } from "react";
import { BlacklistEntry } from "@/types/audit";
import { INITIAL_BLACKLIST } from "@/data/auditLogs";

export function BlacklistManager() {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(INITIAL_BLACKLIST);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !reason) return;
    const newEntry: BlacklistEntry = {
      id: `bl-${Date.now()}`,
      name,
      phone,
      email: "flagged@visitor.block",
      reason,
      addedBy: "Admin Security Officer",
      addedAt: "Today",
    };
    setBlacklist([newEntry, ...blacklist]);
    setShowAddModal(false);
    setName("");
    setPhone("");
    setReason("");
  };

  const handleRemove = (id: string) => {
    setBlacklist(blacklist.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Security Blacklist & Gate Block Registry
          </h2>
          <p className="text-xs text-neutral-500">
            Flagged individuals barred from unannounced campus entry or restricted at screening
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
        >
          + Add Restricted Entry
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-100 bg-neutral-50/50 uppercase tracking-wider text-neutral-500 font-semibold">
            <tr>
              <th className="px-6 py-3.5">Flagged Individual</th>
              <th className="px-6 py-3.5">Contact / Phone</th>
              <th className="px-6 py-3.5">Security Reason</th>
              <th className="px-6 py-3.5">Restricted By</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {blacklist.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">
                  No restricted individuals currently on blocklist.
                </td>
              </tr>
            ) : (
              blacklist.map((entry) => (
                <tr key={entry.id} className="hover:bg-neutral-50/60">
                  <td className="px-6 py-4 font-bold text-neutral-900">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-neutral-600">
                    {entry.phone}
                  </td>
                  <td className="px-6 py-4 text-neutral-700 max-w-sm">
                    {entry.reason}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {entry.addedBy} ({entry.addedAt})
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Lift Restriction
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-950">
              Add Individual to Blacklist
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Bar this phone number or name from receiving gate clearance
            </p>

            <form onSubmit={handleAdd} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Security Reason / Incident Details
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail cause of security block..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="mt-4 flex items-center justify-end space-x-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-neutral-200 px-3.5 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
                >
                  Enforce Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
