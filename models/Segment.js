// models/Segment.js
const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const SegmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rules: { type: [RuleSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    audienceSize: { type: Number, default: null }, // optional cache field
  },
  { collection: "segments" }
);

module.exports =
  mongoose.models.Segment || mongoose.model("Segment", SegmentSchema);
