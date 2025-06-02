const connectDB = require("../config/db"); // your connectDB file
const Order = require("../models/Order");
require("dotenv").config();
const redis = require("../redisPublisher");



connectDB();
// const redis = new Redis({
//   port: 6379,
//   host: "warm-basilisk-22649.upstash.io",
//   username: "default",
//   password: process.env.UPSTASH_REDIS_PASSWORD,
//   tls: {},
// });

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// Constants
const STREAM_KEY = "stream:orders";
const GROUP_NAME = "order-consumer-group";
const CONSUMER_NAME = "order-consumer-1";

// Ensure the consumer group exists
async function ensureConsumerGroup() {
  try {
    await redis.xgroup("CREATE", STREAM_KEY, GROUP_NAME, "0", "MKSTREAM");
    console.log(`Consumer group '${GROUP_NAME}' created.`);
  } catch (err) {
    if (err.message.includes("BUSYGROUP")) {
      console.log(`Consumer group '${GROUP_NAME}' already exists.`);
    } else {
      console.error("Error creating consumer group:", err);
    }
  }
}

async function startOrderConsumer() {
  await ensureConsumerGroup();

  while (true) {
    try {
      const response = await redis.xreadgroup(
        "GROUP",
        GROUP_NAME,
        CONSUMER_NAME,
        "BLOCK",
        5000, // wait for 5 seconds
        "COUNT",
        10,
        "STREAMS",
        STREAM_KEY,
        ">"
      );


      if (!response) continue;

      const [_, messages] = response[0];
      console.log(messages); 
      for (const [id, entries] of messages) {
        const orderData = {};
        for (let i = 0; i < entries.length; i += 2) {
          orderData[entries[i]] = entries[i + 1];
        }

        const order = JSON.parse(orderData.data);
        await Order.create(order);
        console.log("Saved order:", order);

        // Acknowledge the message
        await redis.xack(STREAM_KEY, GROUP_NAME, id);
      }
    } catch (err) {
      console.error("Order Consumer error:", err);
    }
  }
}

startOrderConsumer();
