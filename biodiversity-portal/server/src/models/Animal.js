import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    commonName: { type: String, required: true, trim: true, maxlength: 120 },
    scientificName: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    habitat: { type: String, trim: true, maxlength: 240 },
    image: { type: String, trim: true, maxlength: 500 },
    description: { type: String, trim: true, maxlength: 1000 },
    endemic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Animal", animalSchema);