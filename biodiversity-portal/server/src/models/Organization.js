import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  type: { type: String, required: true, index: true },
  description: String,
  services: [String],
  phone: String,
  email: String,
  website: String,
  address: String,
  location: String,
  emergencyContact: String,
  relatedTopics: [String],
  verificationStatus: { type: String, enum: ["UNVERIFIED", "VERIFIED", "OUTDATED"], default: "UNVERIFIED" },
  isArchived: { type: Boolean, default: false, index: true },
}, { timestamps: true });
export default mongoose.model("Organization", organizationSchema);
