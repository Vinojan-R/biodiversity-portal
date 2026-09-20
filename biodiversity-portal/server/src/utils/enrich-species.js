import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const category = globalThis.process.argv[2];

async function findTaxon(scientificName) {
  const response = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&rank=species&per_page=10`);
  if (!response.ok) throw new Error(`iNaturalist returned ${response.status}`);
  const body = await response.json();
  return body.results.find((taxon) => taxon.name.toLowerCase() === scientificName.toLowerCase()) || body.results[0];
}

try {
  await connectDatabase();
  const species = await Species.find({ isPublished: true, ...(category ? { category } : {}) }).sort({ category: 1, scientificName: 1 });
  let updatedImages = 0;
  let updatedReferences = 0;
  let failedLookups = 0;

  for (const item of species) {
    try {
      const taxon = await findTaxon(item.scientificName);
      const photo = taxon?.default_photo;
      const update = {};
      if (photo?.medium_url) {
        update.image = photo.medium_url;
        updatedImages += 1;
      }
      if (taxon?.id || photo?.attribution) {
        update.references = [{
          title: `${item.scientificName} taxon record and image source`,
          url: `https://www.inaturalist.org/taxa/${taxon.id}`,
          source: photo?.attribution ? `iNaturalist; image attribution: ${photo.attribution}${photo.license_code ? `; ${photo.license_code}` : ""}` : "iNaturalist taxon record",
        }];
        updatedReferences += 1;
      }
      if (taxon?.conservation_status?.status_name && item.conservationStatus === "Verify with current Red List") {
        update.conservationStatus = taxon.conservation_status.status_name.replace(/^./, (letter) => letter.toUpperCase());
      }
      if (Object.keys(update).length > 0) await Species.updateOne({ _id: item._id }, { $set: update });
    } catch (error) {
      failedLookups += 1;
      console.warn(`Skipped ${item.scientificName}: ${error.message}`);
    }
    await delay(150);
  }

  console.log(`Enriched ${species.length}${category ? ` ${category}` : ""} species. Updated ${updatedImages} images and ${updatedReferences} references; ${failedLookups} lookups failed.`);
} catch (error) {
  console.error(`Species enrichment failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
