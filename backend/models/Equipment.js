const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalStock: { type: Number, required: true, default: 0 },
  rentalPrice: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model("Equipment", EquipmentSchema);
