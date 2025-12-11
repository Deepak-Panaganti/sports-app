const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["indoor", "outdoor"], required: true },
  basePrice: { type: Number, required: true },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model("Court", CourtSchema);
