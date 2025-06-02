const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  customerId: String,
  message: String,
  status: { type: String, enum: ["SENT", "FAILED", "PENDING"] },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunicationLog", logSchema);
