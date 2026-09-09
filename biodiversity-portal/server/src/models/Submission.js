import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["SPECIES", "NEWS", "SIGHTING", "CONSERVATION"], required: true },
  title: String,
  content: String,
  speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species" },
  imageUrl: String,
  status: { type: String, enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "NEEDS_CORRECTION"], default: "PENDING", index: true },
  reviewNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
export default mongoose.model("Submission", submissionSchema);
