import React, { useState } from "react";
import { RoomRecord } from "@/types/room";
import { RoomBookingModal } from "./RoomBookingModal";

interface RoomGridProps {
  rooms: RoomRecord[];
  onBookRoom?: (roomId: string, title: string, hostName: string, timeSlot: string) => void;
}

export function RoomGrid({ rooms, onBookRoom }: RoomGridProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);

  const availableCount = rooms.filter((r) => r.status === "AVAILABLE").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Conference & Seminar Rooms Management
          </h2>
          <p className="text-xs text-neutral-500">
            Real-time occupancy, audio-visual capabilities, and collision-free room reservation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
            {availableCount} of {rooms.length} Rooms Ready
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-neutral-400">
                    {room.code}
                  </span>
                  <h3 className="font-bold text-neutral-950 text-base">{room.name}</h3>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                    room.status === "OCCUPIED"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {room.status === "OCCUPIED" ? "In Session" : "Available"}
                </span>
              </div>

              <div className="mt-2 text-xs text-neutral-500 space-y-0.5">
                <p>📍 {room.location} • {room.floor}</p>
                <p>👥 Capacity: <strong className="text-neutral-800">{room.capacity} seats</strong></p>
              </div>

              {/* Equipment Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {room.equipment.map((eq) => (
                  <span
                    key={eq}
                    className="rounded-lg bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 border border-neutral-200/60"
                  >
                    {eq}
                  </span>
                ))}
              </div>

              {/* Booking status */}
              {room.currentMeeting ? (
                <div className="mt-4 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-700 border border-neutral-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Active Session:
                  </span>
                  <p className="mt-0.5 font-semibold text-neutral-900 leading-tight">
                    {room.currentMeeting}
                  </p>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Lead: {room.hostName}
                  </p>
                  <p className="text-emerald-700 font-medium text-[11px] mt-1">
                    Free at: {room.nextAvailable}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-emerald-50/50 p-3 text-xs text-emerald-900 border border-emerald-100">
                  <span className="font-semibold">Ready for immediate reservation</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    High-speed VC and projection equipment tested and active.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">
                {room.nextAvailable}
              </span>
              <button
                onClick={() => setSelectedRoom(room)}
                className="rounded-xl bg-neutral-950 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 shadow-xs transition-colors"
              >
                Reserve Slot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Room Booking Modal */}
      {selectedRoom && (
        <RoomBookingModal
          room={selectedRoom}
          isOpen={true}
          onClose={() => setSelectedRoom(null)}
          onConfirm={(title, host, slot) => {
            if (onBookRoom) onBookRoom(selectedRoom.id, title, host, slot);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
}
