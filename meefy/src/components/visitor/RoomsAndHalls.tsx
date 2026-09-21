import React from "react";
import { RoomRecord } from "@/types/room";

interface RoomsAndHallsProps {
  rooms: RoomRecord[];
}

export function RoomsAndHalls({ rooms }: RoomsAndHallsProps) {
  const availableRoomsCount = rooms.filter((r) => r.status === "AVAILABLE").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-neutral-950">
            Conference & Seminar Rooms
          </h2>
          <p className="text-xs text-neutral-500">
            Conflict-free room reservation management for official meetings
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
          {availableRoomsCount} Rooms Currently Available
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-neutral-900">{room.name}</h3>
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

              <p className="text-xs text-neutral-500 mt-0.5">{room.location}</p>
              <p className="text-xs text-neutral-500 mt-1">
                Capacity:{" "}
                <span className="font-medium text-neutral-800">
                  {room.capacity} seats
                </span>
              </p>

              {room.currentMeeting ? (
                <div className="mt-4 rounded-xl bg-neutral-50 p-3.5 text-xs text-neutral-700 border border-neutral-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Current Booking:
                  </span>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {room.currentMeeting}
                  </p>
                  <p className="text-neutral-500 mt-0.5">Host: {room.hostName}</p>
                  <p className="text-emerald-700 mt-1 font-medium">
                    Free at: {room.nextAvailable}
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-emerald-50/40 p-3.5 text-xs text-emerald-800 border border-emerald-100">
                  <span className="font-medium">Ready for immediate booking</span>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Equipped with Smart Projector, VC System & High-Speed Wi-Fi
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-neutral-100 pt-3 flex justify-end">
              <button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 shadow-2xs transition-colors">
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
