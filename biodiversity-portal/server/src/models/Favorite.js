import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species", required: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, speciesId: 1 }, { unique: true });
export default mongoose.model("Favorite", favoriteSchema);