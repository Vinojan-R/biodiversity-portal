import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const birds = [
  ["Sri Lanka Spurfowl", "Galloperdix bicalcarata"],
  ["Sri Lanka Junglefowl", "Gallus lafayettii"],
  ["Sri Lanka Woodpigeon", "Columba torringtoniae"],
  ["Sri Lanka Green-pigeon", "Treron pompadora"],
  ["Green-billed Coucal", "Centropus chlororhynchos"],
  ["Red-faced Malkoha", "Phaenicophaeus pyrrhocephalus"],
  ["Chestnut-backed Owlet", "Glaucidium castanotum"],
  ["Serendib Scops-owl", "Otus thilohoffmanni"],
  ["Sri Lanka Grey Hornbill", "Ocyceros gingalensis"],
  ["Sri Lanka Barbet", "Psilopogon rubricapillus"],
  ["Yellow-fronted Barbet", "Psilopogon flavifrons"],
  ["Greater Sri Lanka Flameback", "Chrysocolaptes stricklandi"],
  ["Lesser Sri Lanka Flameback", "Dinopium psarodes"],
  ["Sri Lanka Hanging-parrot", "Loriculus beryllinus"],
  ["Emerald-collared Parakeet", "Nicopsitta calthrapae"],
  ["Sri Lanka Woodshrike", "Tephrodornis affinis"],
  ["Sri Lanka Drongo", "Dicrurus lophorinus"],
  ["Sri Lanka Blue Magpie", "Urocissa ornata"],
  ["Sri Lanka Warbler", "Elaphrornis palliseri"],
  ["Sri Lanka Swallow", "Cecropis hyperythra"],
  ["Black-capped Bulbul", "Rubigula melanictera"],
  ["Yellow-eared Bulbul", "Pycnonotus penicillatus"],
  ["Sri Lanka White-eye", "Zosterops ceylonensis"],
  ["Sri Lanka Scimitar-babbler", "Pomatorhinus melanurus"],
  ["Brown-capped Babbler", "Pellorneum fuscocapillus"],
  ["Ashy-fronted Babbler", "Argya cinereifrons"],
  ["Orange-billed Babbler", "Argya rufescens"],
  ["White-faced Starling", "Sturnornis albofrontatus"],
  ["Sri Lanka Hill Myna", "Gracula ptilogenys"],
  ["Spot-winged Thrush", "Geokichla spiloptera"],
  ["Dull-blue Flycatcher", "Eumyias sordidus"],
  ["Sri Lanka Whistling-thrush", "Myophonus blighi"],
  ["White-throated Flowerpecker", "Dicaeum vincens"],
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function findTaxon(scientificName) {
  const response = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}`);
  if (!response.ok) throw new Error(`iNaturalist returned ${response.status} for ${scientificName}`);
  const body = await response.json();
  return body.results.find((taxon) => taxon.name.toLowerCase() === scientificName.toLowerCase()) || body.results.find((taxon) => taxon.rank === "species");
}

try {
  await connectDatabase();
  let withImages = 0;
  for (const [commonName, scientificName] of birds) {
    const taxon = await findTaxon(scientificName);
    const photo = taxon?.default_photo;
    const image = photo?.medium_url;
    if (image) withImages += 1;
    const conservationStatus = taxon?.conservation_status?.status_name;
    const reference = {
      title: `${scientificName} taxon record and image source`,
      url: `https://www.inaturalist.org/taxa/${taxon?.id || encodeURIComponent(scientificName)}`,
      source: photo?.attribution ? `iNaturalist; image attribution: ${photo.attribution}${photo.license_code ? `; ${photo.license_code}` : ""}` : "iNaturalist taxon lookup; no default photo available",
    };

    await Species.findOneAndUpdate(
      { slug: slugify(commonName) },
      {
        slug: slugify(commonName),
        commonName,
        scientificName,
        category: "birds",
        endemic: true,
        endemicStatus: "Endemic to Sri Lanka",
        conservationStatus: conservationStatus ? conservationStatus.replace(/^./, (letter) => letter.toUpperCase()) : "Verify with current Red List",
        description: "Catalogue record added for administrator review. Scientific and conservation details should be verified against current authoritative sources before publication.",
        image,
        habitat: "Information not yet added",
        distribution: { region: "Sri Lanka", sriLanka: "Sri Lanka" },
        references: [reference],
        isPublished: true,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
  }
  console.log(`Seeded ${birds.length} bird records. ${withImages} include an iNaturalist image URL; ${birds.length - withImages} require image review.`);
} catch (error) {
  console.error(`Bird seed failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
