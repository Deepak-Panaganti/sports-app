const express = require("express");
const router = express.Router();
const Court = require("../models/Court");

router.get("/", async (req,res) => {
  const courts = await Court.find();
  res.json(courts);
});

router.post("/", async (req,res) => {
  const c = await Court.create(req.body);
  res.json(c);
});

router.put("/:id", async (req,res) => {
  const updated = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.patch("/:id/disable", async (req,res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ error: "Not found" });
    court.enabled = !!req.body.enabled;
    await court.save();
    res.json(court);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req,res) => {
  await Court.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
