const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
  host: "warm-basilisk-22649.upstash.io",
  username: "default",
  password: process.env.UPSTASH_REDIS_PASSWORD, // put your actual Upstash Redis password here
  tls: {}, // Required for Upstash SSL
});
redis
  .ping()
  .then((res) => console.log("Redis ping response:", res))
  .catch((err) => console.error("Redis connection error:", err));

module.exports = redis;
