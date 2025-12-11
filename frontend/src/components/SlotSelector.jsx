// src/components/SlotSelector.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function SlotSelector({ courtId, onSelect, refreshToken }) {
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const timeSlots = [
    "06:00","07:00","08:00",
    "09:00","10:00","11:00",
    "12:00","13:00","14:00",
    "15:00","16:00","17:00",
    "18:00","19:00","20:00",
    "21:00"
  ];

  // Fetch booked slots whenever court changes or refreshToken increases
  useEffect(() => {
    if (!courtId) return;

    axios
      .get(`http://localhost:5000/api/bookings/unavailable?courtId=${courtId}`)
      .then((res) => setUnavailableSlots(res.data.unavailable || []))
      .catch(() => setUnavailableSlots([]));
  }, [courtId, refreshToken]);

  function handleSelectTime(time) {
    setSelectedTime(time);
    onSelect(time);
  }

  return (
    <div className="panel-inner">

      <div className="grid grid-cols-3 gap-3 mt-3">

        {timeSlots.map((time) => {
          const isBooked = unavailableSlots.includes(time);
          const isSelected = selectedTime === time;

          return (
            <button
              key={time}
              disabled={isBooked}
              onClick={() => !isBooked && handleSelectTime(time)}
              className={`
                slot-btn
                ${isBooked
                  ? "slot-booked"
                  : isSelected
                  ? "slot-selected"
                  : "slot-available"
                }
              `}
            >
              {time}
            </button>
          );
        })}

      </div>

      {/* Legends */}
      <div className="flex gap-3 mt-4">
        <span className="legend-available">Available</span>
        <span className="legend-booked">Booked</span>
        <span className="legend-selected">Selected</span>
      </div>

      {selectedTime && (
        <p className="mt-2 text-sm">
          Selected Slot: <span className="font-semibold">{selectedTime}</span>
        </p>
      )}

    </div>
  );
}

export default SlotSelector;
