import mongoose from "mongoose";

const expertApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  personal: { fullName: String, professionalEmail: String, institution: String, country: String, city: String },
  qualifications: [{ title: String, institution: String, year: Number, evidenceUrl: String }],
  experience: [{ role: String, organization: String, years: Number, description: String }],
  specializations: [{ type: String, trim: true, maxlength: 120 }],
  publications: [{ title: String, url: String, year: Number }],
  professionalLinks: [{ label: String, url: String }],
  statement: { type: String, maxlength: 3000 },
  supportingDocuments: [{ name: String, url: String }],
  status: { type: String, enum: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ADDITIONAL_INFORMATION_REQUIRED", "APPROVED", "REJECTED", "SUSPENDED"], default: "DRAFT", index: true },
  reviewNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("ExpertApplication", expertApplicationSchema);