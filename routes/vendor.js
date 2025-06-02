// routes/vendor.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/send", async (req, res) => {
  const { campaignId, customerId, message } = req.body;

  // Simulate 90% success
  const status = Math.random() < 0.9 ? "SENT" : "FAILED";

  // Simulate async delay
  setTimeout(async () => {
    try {
      await axios.post("http://localhost:5000/api/receipts", {
        campaignId,
        customerId,
        status,
      });
    } catch (err) {
      console.error("Failed to send receipt:", err.message);
    }
  }, 1000 + Math.random() * 2000); // 1–3s delay

  res.json({ status: "processing", simulatedStatus: status });
});

module.exports = router;
