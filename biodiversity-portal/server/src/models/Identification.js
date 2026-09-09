import mongoose from "mongoose";

const identificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, required: true },
    predictedSpeciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species" },
    confidence: { type: Number, min: 0, max: 1 },
    modelVersion: String,
  },
  { timestamps: true },
);

export default mongoose.model("Identification", identificationSchema);