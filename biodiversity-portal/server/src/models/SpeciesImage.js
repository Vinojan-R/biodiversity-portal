import mongoose from "mongoose";

const speciesImageSchema = new mongoose.Schema(
  {
    speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species", required: true, index: true },
    imageUrl: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String, trim: true },
    storageProvider: { type: String, default: "external" },
    storageKey: String,
    altText: String,
    caption: String,
    photographer: String,
    source: String,
    license: String,
    isPrimary: { type: Boolean, default: false, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("SpeciesImage", speciesImageSchema);