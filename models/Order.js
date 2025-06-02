// Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: String, required: true }, // <-- Fix here
  items: [{ type: String }],
  total: { type: Number },
  createdAt: { type: Date, default: Date.now },
  // Add other fields as needed
});

module.exports = mongoose.model("Order", orderSchema);
