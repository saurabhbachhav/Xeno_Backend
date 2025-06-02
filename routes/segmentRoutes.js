// routes/segmentRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const Segment = require("../models/Segment.js");
const { getAudienceSize } = require("../lib/audienceUtils.js");

const router = express.Router();

// GET /api/segments
// — Return all segments (most recent first)
router.get("/", async (req, res) => {
  try {
    const segments = await Segment.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ segments });
  } catch (err) {
    console.error("GET /api/segments error:", err);
    return res.status(500).json({ error: "Failed to fetch segments" });
  }
});

// POST /api/segments
// — Create a new segment
// body: { name: string, rules: array }
router.post("/", async (req, res) => {
  try {
    const { name, rules } = req.body;
    if (!name || !Array.isArray(rules)) {
      return res.status(400).json({ error: "Name and rules are required" });
    }
    const newSegment = new Segment({
      name: name.trim(),
      rules,
    });
    await newSegment.save();
    return res.status(201).json({ segment: newSegment });
  } catch (err) {
    console.error("POST /api/segments error:", err);
    return res.status(500).json({ error: "Failed to create segment" });
  }
});

// GET /api/segments/:id
// — Fetch one segment by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid segment ID" });
  }
  try {
    const segment = await Segment.findById(id).lean();
    if (!segment) {
      return res.status(404).json({ error: "Segment not found" });
    }
    return res.status(200).json({ segment });
  } catch (err) {
    console.error("GET /api/segments/:id error:", err);
    return res.status(500).json({ error: "Failed to fetch segment" });
  }
});

// POST /api/segments/preview
// — Return a “preview” audience size for given rules
// body: { rules: array }
router.post("/preview", async (req, res) => {
  try {
    const { rules } = req.body;
    if (!Array.isArray(rules)) {
      return res.status(400).json({ error: "Rules must be an array" });
    }
    const size = await getAudienceSize(rules);
    return res.status(200).json({ audienceSize: size });
  } catch (err) {
    console.error("POST /api/segments/preview error:", err);
    return res.status(500).json({ error: "Failed to compute audience size" });
  }
});

module.exports = router;
