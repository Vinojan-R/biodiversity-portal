import mongoose from "mongoose";

const speciesSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    commonName: { type: String, required: true, trim: true, maxlength: 120, index: true },
    scientificName: { type: String, required: true, trim: true, maxlength: 160, index: true },
    localNames: [{ type: String, trim: true, maxlength: 80 }],
    speciesCode: { type: String, trim: true, uppercase: true, maxlength: 40, index: true },
    image: { type: String, trim: true, maxlength: 500 },
    category: { type: String, required: true, trim: true, lowercase: true, index: true },
    endemic: { type: Boolean, default: true, index: true },
    endemicStatus: { type: String, trim: true, maxlength: 120 },
    conservationStatus: { type: String, trim: true, maxlength: 120, index: true },
    populationStatus: { type: String, trim: true, maxlength: 240 },
    description: { type: String, trim: true, maxlength: 2000 },
    taxonomy: {
      kingdom: String, phylum: String, className: String, order: String,
      family: String, genus: String, species: String, subspecies: String,
    },
    physicalCharacteristics: { appearance: String, size: String, weight: String, identificationFeatures: String },
    diet: { type: String, trim: true },
    foodTypes: [{ type: String, trim: true }],
    feedingBehavior: { type: String, trim: true },
    habitat: { type: String, trim: true },
    habitatTypes: [{ type: String, trim: true }],
    distribution: { region: String, sriLanka: String, elevationRange: String },
    behavior: { type: String, trim: true },
    reproduction: { type: String, trim: true },
    breedingSeason: { type: String, trim: true },
    lifespan: { type: String, trim: true },
    threats: [{ type: String, trim: true }],
    conservationMeasures: { type: String, trim: true },
    ecologicalImportance: { type: String, trim: true },
    similarSpecies: [{ type: String, trim: true }],
    references: [{ title: String, url: String, source: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

speciesSchema.index({ commonName: "text", scientificName: "text", description: "text", "distribution.region": "text" });

export default mongoose.model("Species", speciesSchema);