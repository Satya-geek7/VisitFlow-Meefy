import React, { useState } from "react";
import { RoomRecord } from "@/types/room";
import { INITIAL_OFFICERS } from "@/data/officers";

interface RoomBookingModalProps {
  room: RoomRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string, host: string, slot: string) => void;
}

export function RoomBookingModal({
  room,
  isOpen,
  onClose,
  onConfirm,
}: RoomBookingModalProps) {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [hostName, setHostName] = useState(INITIAL_OFFICERS[0].name);
  const [timeSlot, setTimeSlot] = useState("02:00 PM - 03:30 PM");
  const [attendeesCount, setAttendeesCount] = useState(8);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting title / agenda.");
      return;
    }
    onConfirm(meetingTitle, hostName, timeSlot);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Reserve {room.name}
            </h3>
            <p className="text-xs text-neutral-500">
              {room.location} • Max {room.capacity} seats
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Meeting Title / Agenda *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Project Progress Review / Vendor Consultation"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Organizing Officer (Host)
            </label>
            <select
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              {INITIAL_OFFICERS.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name} ({o.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM</option>
                <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Attendees Count
              </label>
              <input
                type="number"
                min="1"
                max={room.capacity}
                value={attendeesCount}
                onChange={(e) => setAttendeesCount(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3 text-neutral-600 border border-neutral-100">
            <span className="font-semibold text-neutral-800">Collision Prevention Guard:</span>
            <p className="mt-0.5 text-[11px] text-neutral-500">
              The scheduler confirms room availability across existing officer appointments to guarantee zero double-booking.
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-neutral-950 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
