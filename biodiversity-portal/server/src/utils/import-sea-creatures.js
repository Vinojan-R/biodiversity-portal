import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const names = [
  "Sri Lankan Giant Snakehead", "Ceylon Snakehead", "Sri Lanka Combtail", "Ornate Paradise Fish", "Sri Lankan Sea Bass", "Jonklaas' Loach", "Blotched Filamented Barb", "Sri Lanka Stone Sucker", "Phillips' Garra", "Mountain Labeo", "Sri Lanka Labeo", "Redfin Labeo", "Bandula Barb", "Cuming's Barb", "Tic Tac Barb", "Black Ruby Barb", "Sri Lanka Redfinned Barb", "Kamalica's Barb", "Sri Lanka Redeye Barb", "Layard's Barb", "Swamp Barb", "Cherry Barb", "Asoka Barb", "Martenstyn's Barb", "Black-lined Barb",
  "Sri Lanka Silver Carplet", "Aranayake Danio", "Kitulgala Danio", "Agra Danio", "Barred Danio", "Green Carplet", "Gal Oya Blue Laubuka", "Sri Lanka Blue Laubuka", "Varuna Laubuka", "Gal Oya Striped Rasbora", "Armitagi Rasbora", "Naggasi Rasbora", "Wilpita Rasbora", "Pallaides Rasbora", "Pearly Rasbora", "Banded Mountain Zipper Loach", "Rakwana Mountain Loach", "Spotback Loach", "Scriptic Mountain Loach", "Day's Killifish", "Werner's Killifish", "Lipstick Goby", "Martenstyn's Goby", "Sri Lanka Dwarf Catfish", "Striped Dwarf Catfish", "Sri Lanka Yellow Catfish",
  "Sri Lanka Walking Catfish", "Wet Zone Butter Catfish", "Dry Zone Butter Catfish", "Sri Lanka Five-eyed Spiny Eel", "Lesser Swamp Eel",
];

const scientificNames = [
  "Channa ara", "Channa orientalis", "Belontia signata", "Malpulutta kretseri", "Lates lakdiva", "Lepidocephalichthys jonklaasi", "Dawkinsia srilankensis", "Garra ceylonensis", "Garra phillipsi", "Labeo fisheri", "Labeo heladiva", "Labeo lankae", "Pethia bandula", "Pethia cumingii", "Pethia melanomaculata", "Pethia nigrofasciata", "Pethia reval", "Puntius kamalika", "Puntius kelumi", "Puntius layardi", "Puntius thermalis", "Puntius titteya", "Systomus asoka", "Systomus martenstyni", "Systomus pleurotaenia",
  "Amblypharyngodon grandisquamis", "Devario memorialis", "Devario micronema", "Devario monticola", "Devario pathirana", "Horadandia atukorali", "Laubuka hema", "Laubuka lankensis", "Laubuka varuna", "Rasbora adisi", "Rasbora armitagei", "Rasbora naggsi", "Rasbora wilpita", "Rasboroides pallidus", "Rasboroides vaterifloris", "Paracanthocobitis urophthalma", "Schistura madhavai", "Schistura notostigma", "Schistura scripta", "Aplocheilus dayi", "Aplocheilus werneri", "Sicyopus jonklaasi", "Stiphodon martenstyni", "Mystus ankutta", "Mystus nanus", "Mystus zeylanicus",
  "Clarias brachysoma", "Ompok argestes", "Ompok ceylonensis", "Macrognathus pentophthalmos", "Ophichthys desilvai",
];

const habitats = [
  "Freshwater rivers, deep pools and reservoirs", "Freshwater streams, rivers, marshes and pools", "Shallow, slow-flowing clear-water streams with pebble or sand bottoms", "Small, shallow, slow-flowing forest streams with leaf debris and dense vegetation", "Freshwater and brackish waters", "Shallow, slow-flowing, heavily shaded rivulets with leaf debris", "Rapidly flowing streams with pebbly substrates", "Slow to moderately flowing rivers and streams with rocky substrates", "Fast-flowing, clear hill streams with rocky substrates", "Rocky, fast-flowing mountain streams", "Rivers, lowland floodplains, reservoirs and estuarine-influenced waters", "Moderately flowing streams with rocks and boulders near riparian vegetation", "Small shallow rocky streams with marginal vegetation", "Flowing streams, marshes and slow-flowing waters with sand, silt or gravel", "Freshwater streams and small rivers", "Clear streams and rivers, including quiet pools with marginal vegetation", "Freshwater streams and pools", "Freshwater streams and rivers", "Clear-water streams with granite, pebble or sand substrates", "Freshwater streams and rivers", "Freshwater streams, pools and wetland-associated habitats", "Shallow, slow-flowing, shaded streams with silt and leaf debris", "Deep, fast-flowing waters with gravel or sand substrates", "Freshwater rivers and streams", "Large, clear, deep and shaded streams with flowing water",
  "Freshwater streams, pools and wetlands", "Freshwater streams and rivers", "Well-shaded shallow, slow-flowing streams", "Freshwater mountain streams", "Still pools to swift-flowing streams with pebble or boulder substrates", "Still or slow-moving water, swamps, rice fields, ponds and canals", "Freshwater streams and rivers", "Rivers and streams with gravel, pebbles and fast-flowing water", "Rainforest streams", "Lotic and lentic freshwater habitats, usually near stream and river banks", "Shaded freshwater streams in inland rainforests", "Freshwater streams and rivers", "Shallow, slow-flowing, heavily shaded streams", "Shallow, slow-flowing, densely shaded rainforest streams with sandy-silt bottoms", "Shallow, shaded, slow-flowing clear streams with leaf debris", "Fast-flowing freshwater mountain streams", "Fast-flowing rocky and gravel-bottomed mountain streams", "Fast-flowing streams with rock and pebble substrates", "Fast-flowing stream sections with small boulders and pebbles", "Shallow shaded forest streams and brackish mangrove swamps", "Small, shallow, slow-flowing shaded streams with silt or clay substrates", "Fast-flowing rocky mid-hill streams", "Fast-flowing freshwater streams", "Rivers with mud or sand substrates", "Freshwater rivers and streams", "Freshwater rivers and streams",
  "Rainforest streams and lowland rivers", "Freshwater rivers and streams", "Freshwater rivers, streams and inland waters", "Freshwater rivers, streams and slow-flowing habitats", "Freshwater, demersal swamp and wetland habitats",
];

const distributions = [
  "Mahaweli River basin, including Victoria and Randenigala reservoirs", "Sri Lanka, especially wet-zone freshwater habitats", "Kelani and Kalu river basins and the south-western and mid-hill regions", "South-western Sri Lanka, especially the Colombo-Galle-Ratnapura region", "Sri Lanka", "Wet zone of south-western Sri Lanka, including Kalu and Gin river basins", "Kalu River and nearby hill areas of Sri Lanka", "Sri Lanka", "Knuckles mountain streams in the Mahaweli basin", "Mahaweli River basin and a few localized mountain streams", "Lowland dry and wet zones of Sri Lanka", "Mahaweli and Amban river systems of Sri Lanka", "A very small stream near Galapitamada in the Kelani basin", "Sri Lanka, including Kelani Valley and other river systems", "Sri Lanka", "South-western Sri Lanka", "Sri Lanka", "Sri Lanka", "Kelani, Kalu, Bentara, Gin and Nilwala river drainages", "Sri Lanka; historically associated with the south-western wet zone", "Sri Lanka", "Low-country wet zone from Kelani to Nilwala basins", "Upper Sitawaka River, tributaries and Kelani near Kitulgala", "Sri Lanka, including the Mahaweli basin", "Kelani and Nilwala river catchments",
  "Sri Lanka", "Ma Oya basin around Aranayake, Sri Lanka", "Sri Lanka, particularly wet-zone stream habitats", "Agra Oya, a tributary of the Mahaweli River, in the central hills", "Nilwala River basin around Opatha, Sri Lanka", "Coastal plains and lowland wetlands of Sri Lanka", "Eastern Sri Lanka, including the Gal Oya region", "Sri Lanka, including the Kalu River basin", "Sri Lanka", "Eastern Sri Lanka, especially Gal Oya, Kumbukkan Oya and Menik Ganga basins", "South-western Sri Lanka, including the Kalu River basin", "Sri Lanka", "Nilwala, Gin and Kalu river drainages of south-western Sri Lanka", "Kalu, Bentara, Gin, Polathu-Modera and Nilwala river basins", "Kalu River basin, Sri Lanka", "South-western wet zone of Sri Lanka", "Sri Lanka, including high-elevation streams around the Rakwana region", "South-western Sri Lanka and streams descending from the hills", "Gin River basin, including Nakiyadeniya area", "Kelani basin and adjacent coastal areas of Sri Lanka", "Kalu to Nilwala river basins", "Kalu, Kelani and Nilwala river basins", "South-western Sri Lanka, including the Kalu River basin", "Sri Lanka", "Sri Lanka", "Sri Lanka",
  "Wet-zone lowlands and central hill region of the Mahaweli basin", "Wet zone of Sri Lanka", "Sri Lanka", "Sri Lanka", "Sri Lanka",
];

const statuses = [
  "Not Evaluated", "Vulnerable", "Vulnerable", "Endangered", "Not Evaluated", "Endangered", "Endangered", "Near Threatened", "Critically Endangered", "Endangered", "Least Concern", "Endangered", "Critically Endangered", "Endangered", "Least Concern", "Vulnerable", "Endangered", "Endangered", "Endangered", "Data Deficient", "Least Concern", "Vulnerable", "Critically Endangered", "Endangered", "Vulnerable",
  "Not Evaluated", "Not Evaluated", "Endangered", "Critically Endangered", "Endangered", "Vulnerable", "Not Evaluated", "Near Threatened", "Endangered", "Not Evaluated", "Critically Endangered", "Endangered", "Vulnerable", "Endangered", "Critically Endangered", "Near Threatened", "Critically Endangered", "Endangered", "Endangered", "Critically Endangered", "Endangered", "Least Concern", "Least Concern", "Near Threatened", "Not Evaluated", "Least Concern",
  "Critically Endangered", "Critically Endangered", "Critically Endangered", "Critically Endangered", "Critically Endangered",
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

if (![scientificNames, habitats, distributions, statuses].every((values) => values.length === names.length)) {
  throw new Error(`Sea-creature data is misaligned: expected ${names.length} rows.`);
}

const records = names.map((commonName, index) => ({
  slug: slugify(commonName),
  commonName,
  scientificName: scientificNames[index],
  category: "sea-creatures",
  endemic: true,
  endemicStatus: "Endemic to Sri Lanka",
  conservationStatus: statuses[index],
  description: `${commonName} is an endemic Sri Lankan aquatic species associated with ${habitats[index].toLowerCase()} Distribution: ${distributions[index]}.`,
  image: `https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search=${encodeURIComponent(scientificNames[index])}`,
  habitat: habitats[index],
  distribution: { region: distributions[index], sriLanka: distributions[index] },
  references: [{ title: "Sri Lankan endemic sea creatures source collection", source: "User-provided PDF data" }],
  isPublished: true,
}));

try {
  await connectDatabase();
  for (const record of records) {
    await Species.findOneAndUpdate({ scientificName: record.scientificName }, record, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  }
  console.log(`Imported ${records.length} sea-creature records.`);
} catch (error) {
  console.error(`Sea-creature import failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}