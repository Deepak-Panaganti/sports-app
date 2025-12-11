import React, { useEffect, useState } from "react";
import axios from "axios";
import SlotSelector from "../components/SlotSelector";
import PriceCalculator from "../components/PriceCalculator";
import ThemeToggle from "../components/ThemeToggle";
import { Listbox } from "@headlessui/react";

function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");

  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/courts").then((res) => setCourts(res.data));
    axios.get("http://localhost:5000/api/coaches").then((res) => setCoaches(res.data));
    axios.get("http://localhost:5000/api/equipment").then((res) => setEquipment(res.data));
  }, []);

  function handleSlotSelect(slot) {
    setStartTime(slot);
    const [hour] = slot.split(":");
    const endHour = String(Number(hour) + 1).padStart(2, "0");
    setEndTime(`${endHour}:00`);
  }

  async function submitBooking() {
    if (!selectedCourt || !startTime) {
      alert("Please choose a court and slot first!");
      return;
    }

    const payload = {
      courtId: selectedCourt,
      startTime: new Date(`2025-01-01T${startTime}:00Z`),
      endTime: new Date(`2025-01-01T${endTime}:00Z`),
      equipment: selectedEquipment ? [{ equipmentId: selectedEquipment, quantity: 1 }] : [],
      coachId: selectedCoach || null,
    };

    try {
      await axios.post("http://localhost:5000/api/bookings", payload);
      alert("Booking Successful!");
      setRefreshToken(t => t + 1);
      setStartTime("");
      setEndTime("");
      setSelectedCoach("");
      setSelectedEquipment("");
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.message || err.message));
      setRefreshToken(t => t + 1);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Court Booking
        </h1>
        <ThemeToggle />
      </div>

      {/* COURT CARD */}
      <div className="card mb-6">
        <h3 className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
          Available Courts
        </h3>

        <div className="space-y-3">
          {courts.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCourt(c._id)}
              className="p-3 rounded-md border cursor-pointer"
              style={{
                background: selectedCourt === c._id ? "var(--glass)" : "var(--card)",
                color: "var(--text)",
                borderColor: selectedCourt === c._id ? "var(--accent)" : "transparent",
              }}
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {c.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIME SLOT SELECTOR */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
          Choose a Time Slot
        </h3>

        {selectedCourt ? (
          <SlotSelector
            courtId={selectedCourt}
            onSelect={handleSlotSelect}
            refreshToken={refreshToken}
          />
        ) : (
          <div style={{ color: "var(--text-muted)" }}>Select a court first.</div>
        )}
      </div>

      {/* BOOKING DETAILS */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
          Booking Details
        </h3>

        {/* Start Time */}
        <input
          className="border p-2 w-full rounded mb-3 text-sm"
          style={{ background: "var(--card)", color: "var(--text)" }}
          value={startTime}
          placeholder="Start Time"
          disabled
        />

        {/* End Time */}
        <input
          className="border p-2 w-full rounded mb-3 text-sm"
          style={{ background: "var(--card)", color: "var(--text)" }}
          value={endTime}
          placeholder="End Time"
          disabled
        />

        {/* EQUIPMENT DROPDOWN (CUSTOM) */}
        <Listbox value={selectedEquipment} onChange={setSelectedEquipment}>
          <div className="relative mt-1 mb-3">
            <Listbox.Button
              className="w-full p-2 text-sm rounded border"
              style={{ background: "var(--card)", color: "var(--text)" }}
            >
              {selectedEquipment
                ? equipment.find((eq) => eq._id === selectedEquipment)?.name
                : "Select equipment"}
            </Listbox.Button>

            <Listbox.Options
              className="absolute w-full mt-1 max-h-60 overflow-auto rounded shadow-lg z-50"
              style={{
                background: "var(--glass)",
                color: "var(--text)",
                border: "1px solid var(--accent)",
              }}
            >
              {equipment.map((eq) => (
                <Listbox.Option
                  key={eq._id}
                  value={eq._id}
                  className="p-2 cursor-pointer hover:bg-[var(--card)]"
                  style={{ color: "var(--text)" }}
                >
                  {eq.name} (₹{eq.rentalPrice})
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        {/* COACH DROPDOWN (CUSTOM) */}
        <Listbox value={selectedCoach} onChange={setSelectedCoach}>
          <div className="relative mt-1 mb-3">
            <Listbox.Button
              className="w-full p-2 text-sm rounded border"
              style={{ background: "var(--card)", color: "var(--text)" }}
            >
              {selectedCoach
                ? coaches.find((c) => c._id === selectedCoach)?.name
                : "Select coach"}
            </Listbox.Button>

            <Listbox.Options
              className="absolute w-full mt-1 max-h-60 overflow-auto rounded shadow-lg z-50"
              style={{
                background: "var(--glass)",
                color: "var(--text)",
                border: "1px solid var(--accent)",
              }}
            >
              {coaches.map((co) => (
                <Listbox.Option
                  key={co._id}
                  value={co._id}
                  className="p-2 cursor-pointer hover:bg-[var(--card)]"
                  style={{ color: "var(--text)" }}
                >
                  {co.name} — ₹{co.hourlyFee}/hr
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <PriceCalculator
          courtId={selectedCourt}
          startTime={startTime}
          endTime={endTime}
          equipmentId={selectedEquipment}
          coachId={selectedCoach}
        />

        <button onClick={submitBooking} className="btn-primary mt-4">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookingPage;




