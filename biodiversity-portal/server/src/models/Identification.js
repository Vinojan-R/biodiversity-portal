import mongoose from "mongoose";

const identificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String },
    predictedSpeciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species" },
    provider: { type: String, trim: true },
    modelVersion: { type: String, trim: true },
    result: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.model("Identification", identificationSchema);