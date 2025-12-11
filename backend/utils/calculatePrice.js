const PricingRule = require("../models/PricingRule");
const Court = require("../models/Court");
const Equipment = require("../models/Equipment");
const Coach = require("../models/Coach");

module.exports = async function calculatePrice(data) {
  const { courtId, start, end, equipment, coachId } = data;

  const s = start instanceof Date ? start : (start ? new Date(start) : null);
  const e = end instanceof Date ? end : (end ? new Date(end) : (s ? new Date(s.getTime() + 60*60*1000) : null));
  if (!s || !e) throw new Error("Invalid start/end");

  const hours = Math.max(1, (e - s) / (1000 * 60 * 60));

  const court = await Court.findById(courtId);
  if (!court) throw new Error("Court not found");
  const basePrice = Number(court.basePrice || 0);

  const rules = await PricingRule.find({ enabled: true });

  let peak = 0, weekend = 0, indoor = 0;
  let total = basePrice * hours;

  const startHour = s.getUTCHours ? s.getUTCHours() : s.getHours();
  const day = s.getUTCDay ? s.getUTCDay() : s.getDay();

  for (const rule of rules) {
    if (rule.condition === "weekend" && (day === 0 || day === 6)) {
      if (rule.type === "fixed") {
        weekend += rule.value;
        total += rule.value;
      } else { // multiplier
        const extra = basePrice * hours * (rule.value - 1);
        weekend += extra; total += extra;
      }
    }

    if (rule.condition === "peak") {
      if (rule.metadata && typeof rule.metadata.start === "number") {
        for (let h=0; h<hours; h++) {
          const hh = (startHour + h) % 24;
          if (hh >= rule.metadata.start && hh < rule.metadata.end) {
            const extra = basePrice * (rule.type === "multiplier" ? (rule.value - 1) : (rule.value || 0));
            peak += extra; total += extra;
          }
        }
      }
    }

    if (rule.condition === "indoor" && court.type === "indoor") {
      if (rule.type === "fixed") {
        indoor += rule.value; total += rule.value;
      } else {
        const extra = basePrice * hours * (rule.value - 1);
        indoor += extra; total += extra;
      }
    }
  }

  // equipment fees — rentalPrice * qty * hours
  let equipmentFee = 0;
  if (Array.isArray(equipment)) {
    for (const eqRaw of equipment) {
      const eqId = (typeof eqRaw === "string") ? eqRaw : (eqRaw.equipmentId || eqRaw.id || eqRaw._id);
      const qty = (typeof eqRaw === "object" && eqRaw.quantity) ? eqRaw.quantity : 1;
      const item = await Equipment.findById(eqId);
      if (item) equipmentFee += Number(item.rentalPrice || 0) * qty * hours;
    }
  }

  let coachFee = 0;
  if (coachId) {
    const coach = await Coach.findById(coachId);
    if (coach) coachFee = Number(coach.hourlyFee || 0) * hours;
  }

  total += equipmentFee + coachFee;

  const round = (n)=> Number(Number(n||0).toFixed(2));
  return {
    base: round(basePrice * hours),
    peak: round(peak),
    weekend: round(weekend),
    indoor: round(indoor),
    equipment: round(equipmentFee),
    coach: round(coachFee),
    total: round(total)
  };
};
