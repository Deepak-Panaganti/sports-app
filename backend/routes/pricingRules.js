const express = require("express");
const router = express.Router();
const PricingRule = require("../models/PricingRule");

router.get("/", async (req,res) => res.json(await PricingRule.find()));
router.post("/", async (req,res) => res.json(await PricingRule.create(req.body)));
router.put("/:id", async (req,res) => res.json(await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new:true })));
router.patch("/:id/toggle", async (req,res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);
    if (!rule) return res.status(404).json({ error: "Not found" });
    rule.enabled = !!req.body.enabled;
    await rule.save();
    res.json(rule);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.delete("/:id", async (req,res) => { await PricingRule.findByIdAndDelete(req.params.id); res.json({ ok:true }); });

module.exports = router;















