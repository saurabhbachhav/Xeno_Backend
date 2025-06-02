// routes/order.js
const express = require("express");
const router = express.Router();
const redis = require("../redisPublisher"); // or wherever you're publishing

router.post("/", async (req, res) => {
  const { items, total, customerId, } = req.body;

  if (!items || !total || !customerId) {
    return res
      .status(400)
      .json({ error: "Items and total,customerId are required" });
  }

  const orderData = JSON.stringify({ items, total,customerId, createdAt: new Date() });

  try {
    await redis.xadd("stream:orders", "*", "data", orderData);
    res.status(202).json({ message: "Order accepted for processing" });
  } catch (err) {
    console.error("Error publishing order:", err);
    res.status(500).json({ error: "Failed to publish order" });
  }
});

module.exports = router;
