import mongoose from "mongoose";

const importantDaySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  date: { type: Date, required: true, index: true },
  month: Number,
  description: String,
  importance: String,
  relatedSpecies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Species" }],
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  officialUrl: String,
  image: String,
  status: { type: String, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"], default: "DRAFT", index: true },
}, { timestamps: true });
export default mongoose.model("ImportantDay", importantDaySchema);
