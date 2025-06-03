// consumer.js
require("dotenv").config();
const redis = require("../redisPublisher");
const connectDB = require("../config/db");
const Customer = require("../models/Customer");

(async () => {
  // 1. MongoDB से जुड़ जाओ
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");
  } catch (dbErr) {
    console.error("MongoDB connection error:", dbErr);
    process.exit(1);
  }

  // 2. अब स्ट्रीम से केवल नए संदेश पढ़ो (पुराने skip हो जाएँ)
  while (true) {
    try {
      const response = await redis.xread(
        "BLOCK",
        0, // infinite wait till new message arrives
        "STREAMS",
        "stream:customers",
        "$" // "$" → पुराने सब skip, सिर्फ नए पर ब्लॉक
      );

      if (!response) continue; // safety check

      // response format: [ [ 'stream:customers', [ [ '<id>', [ 'data', '<JSON>' ] ], ... ] ] ]
      const [_, messages] = response[0];
      for (const [id, fields] of messages) {
        // fields => ['data', '{"name":"Alice","email":"alice@example.com"}']
        const dataObj = {};
        for (let i = 0; i < fields.length; i += 2) {
          dataObj[fields[i]] = fields[i + 1];
        }

        let customer;
        try {
          customer = JSON.parse(dataObj.data);
        } catch (parseErr) {
          console.error("Invalid JSON in stream entry:", dataObj.data);
          continue;
        }

        // MongoDB में सेव करना
        try {
          const saved = await Customer.create(customer);
          console.log(`✅ Saved to MongoDB (ID:${saved._id})`, customer);
        } catch (mongoErr) {
          console.error("MongoDB save error:", mongoErr);
        }
      }
    } catch (err) {
      console.error("Consumer error:", err);
      
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
})();
