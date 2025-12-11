const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  equipment: [{
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" },
    quantity: { type: Number, default: 1 }
  }],
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "Coach" },
  pricingBreakdown: Object,
  status: { type: String, default: "confirmed" }
}, {
  timestamps: true
});

module.exports = mongoose.model("Booking", BookingSchema);
