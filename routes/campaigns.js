const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Campaign = require("../models/Campaign");
const CommunicationLog = require("../models/CommunicationLog");
const Segment = require("../models/Segment");   

// ✅ Create a new campaign
// ✅ Create a new campaign
router.post("/", async (req, res) => {
  const { name, segmentId, message, imageUrl } = req.body;

  try {
    const segment = await Segment.findById(segmentId).lean();
    if (!segment) {
      return res.status(404).json({ error: "Segment not found" });
    }

    const newCampaign = new Campaign({
      name: name.trim(),
      segmentId,
      rules: segment.rules,
      message,
      imageUrl,
      audienceSize: segment.audienceSize,
    });

    const saved = await newCampaign.save();

    // ✅ Simulate delivery via dummy vendor API
    const dummyCustomers = ["cust1", "cust2", "cust3"];
    const axios = require("axios");

    await Promise.all(
      dummyCustomers.map(async (cid) => {
        const messageText = `Hi ${cid}, ${message || "check out our offer!"}`;

        // 1️⃣ Save initial log with status: PENDING
        await CommunicationLog.create({
          campaignId: saved._id,
          customerId: cid,
          message: messageText,
          status: "PENDING",
        });

        // 2️⃣ Simulate vendor delivery (vendor will later hit delivery receipt API)
        await axios.post("http://localhost:5000/api/vendor/send", {
          campaignId: saved._id,
          customerId: cid,
          message: messageText,
        });
      })
    );

    return res.status(201).json(saved);
  } catch (err) {
    console.error("POST /api/campaigns error:", err);
    return res.status(400).json({ error: err.message });
  }
});

// ✅ Get all campaigns
router.get("/", async (req, res) => {
  console.log(req.body);
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get stats for a campaign
router.get("/:id/stats", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" });
    }

    const logs = await CommunicationLog.find({ campaignId: id });

    const stats = {
      total: logs.length,
      sent: logs.filter((l) => l.status === "SENT").length,
      failed: logs.filter((l) => l.status === "FAILED").length,
    };

    res.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});


// ✅ Get communication logs for a campaign
router.get("/:id/logs", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" });
    }

    const logs = await CommunicationLog.find({ campaignId: id });

    if (!logs || logs.length === 0) {
      return res.status(404).json({ error: "No logs found for this campaign" });
    }

    res.json(logs);
  } catch (err) {
    console.error("GET /api/campaigns/:id/logs error:", err);
    res.status(500).json({ error: "Server error fetching logs." });
  }
});


module.exports = router;
