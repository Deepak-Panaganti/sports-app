const mongoose = require("mongoose");

const PricingRuleSchema = new mongoose.Schema({
  name: String,
  condition: String, // 'peak' | 'weekend' | 'indoor'
  type: String,      // 'multiplier' or 'fixed'
  value: Number,
  metadata: Object,  // e.g. { start: 18, end: 21 }
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model("PricingRule", PricingRuleSchema);
