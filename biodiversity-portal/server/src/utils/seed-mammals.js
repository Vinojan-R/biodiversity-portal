import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const mammals = [
  {
    commonName: "Yellow-striped Chevrotain",
    scientificName: "Moschiola kathygre",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/11474125/medium.jpg",
    photographer: "[2] via iNaturalist",
    license: "CC BY",
  },
  {
    commonName: "White-spotted Chevrotain",
    scientificName: "Moschiola meminna",
    image: "https://static.inaturalist.org/photos/25271943/medium.jpg",
    photographer: "Yu Ching Tam via iNaturalist",
  },
  {
    commonName: "Golden Palm Civet",
    scientificName: "Paradoxurus zeylonensis",
    image: "https://static.inaturalist.org/photos/717363228/medium.jpg",
    photographer: "Bhanuka Ranasinghe via iNaturalist",
  },
  { commonName: "Sri Lankan Woolly Bat", scientificName: "Kerivoula malpasi" },
  {
    commonName: "Sinharaja White-toothed Shrew",
    scientificName: "Crocidura hikmiya",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/496863562/medium.jpeg",
    photographer: "Sakuntha Shehara via iNaturalist",
    license: "CC BY-NC",
    conservationStatus: "Endangered",
  },
  { commonName: "Sri Lankan White-toothed Shrew", scientificName: "Crocidura miya", conservationStatus: "Endangered" },
  {
    commonName: "Pearson's Long-clawed Shrew",
    scientificName: "Solisorex pearsoni",
    image: "https://static.inaturalist.org/photos/628350269/medium.jpg",
    photographer: "Amila P Sumanapala via iNaturalist",
    conservationStatus: "Endangered",
  },
  { commonName: "Sri Lankan Shrew", scientificName: "Suncus fellowesgordoni", conservationStatus: "Endangered" },
  {
    commonName: "Sri Lankan Highland Shrew",
    scientificName: "Suncus montanus",
    image: "https://static.inaturalist.org/photos/726212832/medium.jpg",
    photographer: "Nuwan Chathuranga via iNaturalist",
  },
  { commonName: "Jungle Shrew", scientificName: "Suncus zeylanicus" },
  {
    commonName: "Toque Macaque",
    scientificName: "Macaca sinica",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/4227050/medium.jpg",
    photographer: "trboot via iNaturalist",
    license: "CC BY-NC",
    conservationStatus: "Endangered",
  },
  {
    commonName: "Purple-faced Langur",
    scientificName: "Semnopithecus vetulus",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/14546074/medium.jpg",
    photographer: "Christian Artuso via iNaturalist",
    license: "CC BY-NC-ND",
    conservationStatus: "Endangered",
  },
  {
    commonName: "Red Slender Loris",
    scientificName: "Loris tardigradus",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/427488035/medium.jpeg",
    photographer: "Chaminda Jayaratne via iNaturalist",
    license: "CC BY-NC",
    conservationStatus: "Endangered",
  },
  {
    commonName: "Ceylon Spiny Mouse",
    scientificName: "Mus fernandoni",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/395196476/medium.jpg",
    photographer: "My World of Bird Photography via iNaturalist",
    license: "CC BY-NC",
    conservationStatus: "Endangered",
  },
  {
    commonName: "Mayor's Mouse",
    scientificName: "Mus mayori",
    image: "https://static.inaturalist.org/photos/668736223/medium.jpg",
    photographer: "Nuwan Chathuranga via iNaturalist",
    conservationStatus: "Vulnerable",
  },
  {
    commonName: "Sri Lankan Mountain Rat",
    scientificName: "Rattus montanus",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/449100821/medium.jpeg",
    photographer: "Stuart via iNaturalist",
    license: "CC0",
    conservationStatus: "Endangered",
  },
  { commonName: "Ohiya Rat", scientificName: "Srilankamys ohiensis", conservationStatus: "Vulnerable" },
  { commonName: "Sri Lankan Long-tailed Climbing Mouse", scientificName: "Vandeleuria nolthenii", conservationStatus: "Endangered" },
  {
    commonName: "Layard's Palm Squirrel",
    scientificName: "Funambulus layardi",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/478590177/medium.jpg",
    photographer: "Keith Martin-Smith via iNaturalist",
    license: "CC BY-NC-SA",
    conservationStatus: "Vulnerable",
  },
  {
    commonName: "Dusky Palm Squirrel",
    scientificName: "Funambulus obscurus",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/58180241/medium.jpg",
    photographer: "Kinmatsu Lin via iNaturalist",
    license: "CC BY-NC",
    conservationStatus: "Vulnerable",
  },
  {
    commonName: "Sri Lankan Round-leaf Bat",
    scientificName: "Hipposideros srilankaensis",
    image: "https://static.inaturalist.org/photos/534787510/medium.jpg",
    photographer: "Nuwan Chathuranga via iNaturalist",
  },
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

try {
  await connectDatabase();
  for (const item of mammals) {
    const reference = {
      title: `${item.scientificName} taxon record and image source`,
      url: `https://www.inaturalist.org/taxa/${encodeURIComponent(item.scientificName)}`,
      source: item.photographer ? `iNaturalist; image attribution: ${item.photographer}${item.license ? `; ${item.license}` : ""}` : "iNaturalist taxon lookup; no default photo available",
    };
    await Species.findOneAndUpdate(
      { slug: slugify(item.commonName) },
      {
        slug: slugify(item.commonName),
        commonName: item.commonName,
        scientificName: item.scientificName,
        category: "mammals",
        endemic: true,
        endemicStatus: "Endemic to Sri Lanka",
        conservationStatus: item.conservationStatus || "Verify with current Red List",
        description: "Catalogue record added for administrator review. Scientific and conservation details should be verified against current authoritative sources before publication.",
        image: item.image,
        habitat: "Information not yet added",
        distribution: { region: "Sri Lanka", sriLanka: "Sri Lanka" },
        references: [reference],
        isPublished: true,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${mammals.length} mammal records. ${mammals.filter((item) => item.image).length} include an iNaturalist image URL; ${mammals.filter((item) => !item.image).length} require image review.`);
} catch (error) {
  console.error(`Mammal seed failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
