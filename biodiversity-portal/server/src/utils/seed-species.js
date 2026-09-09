import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { speciesData } from "../../../src/data/species.js";
import { connectDatabase } from "../config/database.js";

try {
  await connectDatabase();
  for (const item of speciesData) {
    await Species.findOneAndUpdate(
      { slug: item.id },
      {
        slug: item.id,
        commonName: item.commonName,
        scientificName: item.scientificName,
        category: item.category,
        endemic: item.endemic,
        endemicStatus: item.endemic ? "Endemic to Sri Lanka" : "Native or recorded in Sri Lanka",
        conservationStatus: item.conservationStatus,
        description: item.description,
        image: item.image,
        habitat: item.habitat,
        distribution: { region: item.region, sriLanka: item.region },
        isPublished: true,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${speciesData.length} species records.`);
} catch (error) {
  console.error(`Species seed failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}