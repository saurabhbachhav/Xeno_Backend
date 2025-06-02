const express = require("express");
const router = express.Router();
const redis = require("../redisPublisher");




// const customerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phone: String,
//   totalSpend: { type: Number, default: 0 },
//   visitCount: { type: Number, default: 0 },
//   lastVisit: Date,
//   createdAt: { type: Date, default: Date.now },
// });



router.post("/", async (req, res) => {
  const { name, email, phone,totalSpend,visitCount} = req.body;
  // console.log(customerId);
  if (!name || !email) {
    return res.status(400).json({ error: "name and email required" });
  }

  try {
    const orderData = JSON.stringify({
      name,
      email,
      phone,
      totalSpend,
      visitCount,
      createdAt: new Date(),
    });

    await redis.xadd("stream:customers", "*", "data", orderData); // ✅ correct stream
    
    res.status(202).json({ message: "Customers Data is Now for processing" });
  } catch (err) {
    console.error("Error publishing Customer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
