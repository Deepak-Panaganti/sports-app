const Booking = require("../models/Booking");
const Equipment = require("../models/Equipment");

module.exports = async function checkAvailability({ courtId, start, end, equipmentList, coachId }) {
  if (!courtId || !start || !end) return { ok:false, reason: "Missing courtId/start/end" };

  // court overlap
  const courtConflict = await Booking.findOne({
    court: courtId,
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: "confirmed"
  });
  if (courtConflict) return { ok: false, reason: "Court not available" };

  // coach overlap
  if (coachId) {
    const coachConflict = await Booking.findOne({
      coach: coachId,
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: "confirmed"
    });
    if (coachConflict) return { ok: false, reason: "Coach not available for this slot" };
  }

  // equipment
  const equipmentNormalized = Array.isArray(equipmentList) ? equipmentList.map(it=>{
    if (typeof it === "string") return { equipmentId: it, quantity: 1 };
    return { equipmentId: it.equipmentId || it.id || it._id, quantity: it.quantity || 1 };
  }) : [];

  if (equipmentNormalized.length > 0) {
    const overlapping = await Booking.find({
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: "confirmed"
    });

    for (const reqEq of equipmentNormalized) {
      const eqDoc = await Equipment.findById(reqEq.equipmentId);
      if (!eqDoc) return { ok:false, reason: `Equipment ${reqEq.equipmentId} not found` };

      let alreadyBooked = 0;
      for (const b of overlapping) {
        if (!Array.isArray(b.equipment)) continue;
        for (const be of b.equipment) {
          if (!be || !be.equipmentId) continue;
          if (be.equipmentId.toString() === reqEq.equipmentId.toString()) {
            alreadyBooked += (be.quantity || 1);
          }
        }
      }
      const remaining = (eqDoc.totalStock || 0) - alreadyBooked;
      if (remaining < reqEq.quantity) {
        return { ok:false, reason: `${eqDoc.name} not available. Only ${remaining} left.` };
      }
    }
  }

  return { ok:true };
};
