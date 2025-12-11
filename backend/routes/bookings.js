const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/User");
const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");
const Court = require("../models/Court");
const Coach = require("../models/Coach");
const PricingRule = require("../models/PricingRule");

const calculatePrice = require("../utils/calculatePrice");

// ----------------------------
// Helpers
// ----------------------------
function parseFlexibleTime(input) {
  // Accepts:
  // - ISO string -> new Date(iso)
  // - "HH:MM" -> returns Date set to 2025-01-01T{HH}:{MM}:00Z (consistent day)
  // - Date object -> returns as-is
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === "string") {
    // try ISO first
    const d = new Date(input);
    if (!isNaN(d)) return d;
    // try HH:MM
    if (/^\d{2}:\d{2}$/.test(input)) {
      return new Date(`2025-01-01T${input}:00Z`);
    }
  }
  return null;
}

// ----------------------------
// GET BOOKINGS (optional ?user=)
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;

    const bookings = await Booking.find(filter)
      .populate("court")
      .populate("coach")
      .populate("equipment.equipmentId");

    res.json(bookings);
  } catch (err) {
    console.error("GET /api/bookings ERR:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// GET UNAVAILABLE SLOTS FOR A COURT
// ----------------------------
// GET /api/bookings/unavailable?courtId=<id>&date=2025-01-01
router.get("/unavailable", async (req, res) => {
  try {
    const { courtId, date } = req.query;
    if (!courtId) return res.status(400).json({ error: "courtId required" });

    // date string in YYYY-MM-DD; fallback to 2025-01-01 (your frontend uses this)
    const day = date || "2025-01-01";

    // start and end of day in UTC
    const start = new Date(`${day}T00:00:00.000Z`);
    const end = new Date(`${day}T23:59:59.999Z`);

    // find confirmed bookings overlapping the day for the court
    const bookings = await Booking.find({
      court: courtId,
      status: "confirmed",
      startTime: { $gte: start, $lte: end },
    });

    // map to hour string (HH:MM) using UTC hours so it matches frontend times like "09:00"
    const slots = bookings.map((b) => {
      const d = new Date(b.startTime);
      const hh = String(d.getUTCHours()).padStart(2, "0");
      return `${hh}:00`;
    });

    // unique
    const unique = Array.from(new Set(slots));

    return res.json({ unavailable: unique });
  } catch (err) {
    console.error("UNAVAILABLE SLOTS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});



// ----------------------------
// QUICK PRICE CALCULATION
// frontend expects POST /api/bookings/calculate
// ----------------------------
router.post("/calculate", async (req, res) => {
  try {
    let { courtId, startTime, endTime, equipment, coachId } = req.body;

    const start = parseFlexibleTime(startTime);
    const end = parseFlexibleTime(endTime) || (start ? new Date(start.getTime() + 60 * 60 * 1000) : null);

    if (!start || !end || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid start/end format. Send ISO or HH:MM." });
    }

    const pricing = await calculatePrice({
      courtId,
      start,
      end,
      equipment,
      coachId
    });

    return res.json(pricing);
  } catch (err) {
    console.error("PRICE ERROR:", err);
    return res.status(500).json({ error: err.message || "Price calc error" });
  }
});

// ----------------------------
// CHECK AVAILABILITY (court, coach, equipment)
// ----------------------------
async function checkAvailability({ courtId, start, end, equipment, coachId }) {
  // Court conflict
  const courtConflict = await Booking.findOne({
    court: courtId,
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: "confirmed",
  });

  if (courtConflict) return { ok: false, reason: "Court not available" };

  // Coach conflict
  if (coachId) {
    const coachConflict = await Booking.findOne({
      coach: coachId,
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: "confirmed",
    });

    if (coachConflict) return { ok: false, reason: "Coach not available" };
  }

  // Equipment conflict counts
  if (Array.isArray(equipment) && equipment.length > 0) {
    const overlapping = await Booking.find({
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: "confirmed",
    });

    for (const req of equipment) {
      const eqDoc = await Equipment.findById(req.equipmentId);
      if (!eqDoc) return { ok: false, reason: "Invalid equipment" };

      let alreadyBooked = 0;

      overlapping.forEach((b) => {
        if (!Array.isArray(b.equipment)) return;
        b.equipment.forEach((it) => {
          if (String(it.equipmentId) === String(req.equipmentId)) {
            alreadyBooked += it.quantity || 1;
          }
        });
      });

      if (alreadyBooked + (req.quantity || 1) > (eqDoc.totalStock || 0)) {
        return {
          ok: false,
          reason: `${eqDoc.name} is not available`
        };
      }
    }
  }

  return { ok: true };
}

// ----------------------------
// CREATE BOOKING (NO TRANSACTIONS for dev)
// ----------------------------
router.post("/", async (req, res) => {
  try {
    let { courtId, startTime, endTime, equipment, coachId, userId } = req.body;

    const start = parseFlexibleTime(startTime);
    const end = parseFlexibleTime(endTime) || (start ? new Date(start.getTime() + 60 * 60 * 1000) : null);

    if (!start || !end || isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid start/end times. Send ISO or HH:MM." });
    }

    // PRE CHECK AVAILABILITY
    const available = await checkAvailability({
      courtId,
      start,
      end,
      equipment,
      coachId
    });

    if (!available.ok) return res.status(400).json({ message: available.reason });

    // PRICE CALCULATION
    const price = await calculatePrice({
      courtId,
      start,
      end,
      equipment,
      coachId
    });

    // SIMPLE SAVE (no transaction) - safer for local dev
    const booking = await Booking.create({
      user: userId || null,
      court: courtId,
      startTime: start,
      endTime: end,
      coach: coachId || null,
      equipment: Array.isArray(equipment) ? equipment : (equipment ? [equipment] : []),
      pricingBreakdown: price,
      status: "confirmed",
    });

    // Return saved document populated
    const full = await Booking.findById(booking._id)
      .populate("court")
      .populate("coach")
      .populate("equipment.equipmentId");

    return res.json(full);
  } catch (err) {
    console.error("BOOKING ERROR:", err);
    return res.status(500).json({ error: err.message || "Booking failed" });
  }
});

module.exports = router;

