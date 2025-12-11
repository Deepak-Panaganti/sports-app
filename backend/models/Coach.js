const mongoose = require("mongoose");

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hourlyFee: { type: Number, required: true, default: 0 },
  blockedSlots: [{ start: Date, end: Date }]
});

module.exports = mongoose.model("Coach", CoachSchema);
