const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");

router.get("/", async (req,res) => res.json(await Equipment.find()));
router.post("/", async (req,res) => res.json(await Equipment.create(req.body)));
router.put("/:id", async (req,res) => res.json(await Equipment.findByIdAndUpdate(req.params.id, req.body, { new:true })));
router.delete("/:id", async (req,res) => { await Equipment.findByIdAndDelete(req.params.id); res.json({ ok:true }); });

module.exports = router;