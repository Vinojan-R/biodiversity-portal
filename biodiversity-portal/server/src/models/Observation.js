import mongoose from "mongoose";

const observationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species", index: true },
    imageUrl: String,
    location: { type: String, trim: true, maxlength: 240 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    observedAt: Date,
    description: { type: String, maxlength: 1000 },
    identificationStatus: { type: String, enum: ["unidentified", "identified"], default: "unidentified" },
    verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Observation", observationSchema);