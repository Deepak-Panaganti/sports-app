const express = require("express");
const router = express.Router();
const Coach = require("../models/Coach");

router.get("/", async (req,res) => res.json(await Coach.find()));
router.post("/", async (req,res) => res.json(await Coach.create(req.body)));
router.put("/:id", async (req,res) => res.json(await Coach.findByIdAndUpdate(req.params.id, req.body, { new:true })));
router.delete("/:id", async (req,res) => { await Coach.findByIdAndDelete(req.params.id); res.json({ ok:true }); });

module.exports = router;