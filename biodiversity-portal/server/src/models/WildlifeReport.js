import mongoose from "mongoose";

const wildlifeReportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true, index: true },
  description: { type: String, required: true },
  location: String,
  imageUrls: [String],
  status: { type: String, enum: ["NEW", "UNDER_REVIEW", "FORWARDED", "IN_PROGRESS", "RESOLVED", "REJECTED"], default: "NEW", index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String,
}, { timestamps: true });
export default mongoose.model("WildlifeReport", wildlifeReportSchema);
