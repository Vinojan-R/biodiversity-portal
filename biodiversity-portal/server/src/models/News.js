import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, unique: true, index: true },
  summary: { type: String, required: true, maxlength: 500 },
  content: String,
  image: String,
  category: { type: String, index: true },
  tags: [String],
  relatedSpecies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Species" }],
  location: String,
  source: { type: String, required: true },
  sourceUrl: { type: String, required: true },
  publishedDate: Date,
  status: { type: String, enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true },
  featured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
newsSchema.index({ title: "text", summary: "text", tags: "text" });
export default mongoose.model("News", newsSchema);
