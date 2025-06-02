// routes/receipt.js
const express = require("express");
const router = express.Router();
const CommunicationLog = require("../models/CommunicationLog");

router.post("/", async (req, res) => {
  const { campaignId, customerId, status } = req.body;

  try {
    const updated = await CommunicationLog.findOneAndUpdate(
      { campaignId, customerId },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Log entry not found" });
    }

    res.json({ message: "Delivery status updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

module.exports = router;
