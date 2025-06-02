const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: String,
  rules: [{ field: String, operator: String, value: String }],
  message: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
