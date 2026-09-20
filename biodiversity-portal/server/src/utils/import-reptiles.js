import "dotenv/config";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const groups = {
  agamas: [
    ["Calotes ceylonensis", "Painted-lipped Lizard"],
    ["Calotes desilvai", "Morningside Lizard"],
    ["Calotes liocephalus", "Crestless Lizard"],
    ["Calotes liolepis", "Whistling Lizard"],
    ["Calotes manamendrai", "Manamendra-Arachchi's Whistling Lizard"],
    ["Calotes nigrilabris", "Black-lipped Lizard"],
    ["Calotes pethiyagodai", "Pethiyagoda's Crestless Lizard"],
    ["Ceratophora aspera", "Rough-horned Lizard"],
    ["Ceratophora erdeleni", "Erdelen's Horned Lizard"],
    ["Ceratophora karu", "Karunaratne's Horned Lizard"],
    ["Ceratophora stoddartii", "Rhino-horned Lizard"],
    ["Ceratophora tennentii", "Leaf-nosed Lizard"],
    ["Cophotis ceylanica", "Pygmy Lizard"],
    ["Cophotis dumbara", "Knuckles Pygmy Lizard"],
    ["Lyriocephalus scutatus", "Hump-nosed Lizard"],
    ["Otocryptis nigristigma", "Lowland Kangaroo Lizard"],
    ["Otocryptis wiegmanni", "Sri Lankan Kangaroo Lizard"],
    ["Sitana devakai", "Devaka's Fan-throated Lizard"],
    ["Ceratophora ukuwelai", "Ukuwelas' Rough-horn Lizard"],
  ],
  geckos: [
    ["Calodactylodes illingworthorum", "Sri Lankan Golden Gecko"], ["Cnemaspis alwisi", "Alwis' Day Gecko"], ["Cnemaspis amith", "Amith's Day Gecko"], ["Cnemaspis gemunu", "Gemunu's Day Gecko"], ["Cnemaspis kallima", "Gammaduwa Day Gecko"], ["Cnemaspis kandambyi", "Kandamby's Day Gecko"], ["Cnemaspis kandiana", "Kandyan Day Gecko"], ["Cnemaspis kumarasinghei", "Kumarasinghe's Day Gecko"], ["Cnemaspis latha", "Elegant Day Gecko"], ["Cnemaspis menikay", "Jewel Day Gecko"], ["Cnemaspis molligodai", "Molligoda's Day Gecko"], ["Cnemaspis pava", "Little Day Gecko"], ["Cnemaspis phillipsi", "Phillips' Day Gecko"], ["Cnemaspis podihuna", "Dwarf Day Gecko"], ["Cnemaspis pulchra", "Rakvana Day Gecko"], ["Cnemaspis punctata", "Dotted Day Gecko"], ["Cnemaspis rajakarunai", "Rajakaruna's Day Gecko"], ["Cnemaspis rammalensis", "Rammale Day Gecko"], ["Cnemaspis retigalensis", "Retigala Day Gecko"], ["Cnemaspis samanalensis", "Samanala Day Gecko"], ["Cnemaspis scalpensis", "Gannoruwa Day Gecko"], ["Cnemaspis silvula", "Forest Day Gecko"], ["Cnemaspis tropidogaster", "Rough-bellied Day Gecko"], ["Cnemaspis upendrai", "Upendra's Day Gecko"],
    ["Cyrtodactylus cracens", "Sinharaja Bent-toed Gecko"], ["Cyrtodactylus edwardtaylori", "Taylor's Bent-toed Gecko"], ["Cyrtodactylus fraenatus", "Bridled Bent-toed Gecko"], ["Cyrtodactylus ramboda", "Ramboda Bent-toed Gecko"], ["Cyrtodactylus soba", "Knuckles Bent-toed Gecko"], ["Cyrtodactylus subsolanus", "Rakwana Bent-toed Gecko"], ["Cyrtodactylus triedrus", "Spotted Bent-toed Gecko"], ["Cyrtodactylus yakhuna", "Blotched Bent-toed Gecko"],
    ["Hemidactylus depressus", "Sri Lanka Leaf-toed Gecko"], ["Hemidactylus hunae", "Spotted Giant Gecko"], ["Hemidactylus lankae", "Termite Hill Gecko"], ["Hemidactylus pieresii", "Kandyan Gecko"],
    ["Cnemaspis anslemi", "Anslem's Day Gecko"], ["Cnemaspis butewai", "Butewes' Day Gecko"], ["Cnemaspis dissanayakai", "Dissanayaka's Day Gecko"], ["Cnemaspis godagedarai", "Godagedaras' Day Gecko"], ["Cnemaspis gotaimbarai", "Gotaimbaras' Day Gecko"], ["Cnemaspis gunasekarai", "Gunasekara's Day Gecko"], ["Cnemaspis gunawardanai", "Gunawardana's Day Gecko"], ["Cnemaspis hitihamii", "Hitihamis' Day Gecko"], ["Cnemaspis ingerorum", "Ingers' Day Gecko"], ["Cnemaspis jayaweerai", "Jayaweera's Day Gecko"], ["Cnemaspis kawminiae", "Kawmini's Day Gecko"], ["Cnemaspis kivulegedarai", "Kivulegadaras' Day Gecko"], ["Cnemaspis kohukumburai", "Kohukumbares' Day Gecko"], ["Cnemaspis kotagamai", "Kotagama's Day Gecko"], ["Cnemaspis lokugei", "Lokuge's Day Gecko"], ["Cnemaspis manoae", "Mano's Day Gecko"], ["Cnemaspis nanayakkarai", "Nanayakkara's Day Gecko"], ["Cnemaspis nandimithrai", "Nandimithras' Day Gecko"], ["Cnemaspis nilgala", "Nilgala Day Gecko"], ["Cnemaspis punctatus", "Punctated Day Gecko"], ["Cnemaspis vedda", "Vedda Day Gecko"], ["Hemidactylus kimbulae", "Crocodile Rock Gecko"],
  ],
  skinks: [
    ["Chalcidoseps thwaitesi", "Four-toed Snake Skink"], ["Dasia haliana", "Haly's Tree Skink"], ["Eutropis austini", "Austin's Skink"], ["Eutropis floweri", "Taylor's Skink"], ["Eutropis greeri", "Greer's Skink"], ["Eutropis madaraszi", "Spotted Skink"], ["Eutropis tammanna", "Tammana Skink"], ["Lankascincus deignani", "Deignan's Lanka Skink"], ["Lankascincus dorsicatenatus", "Catenated Lanka Skink"], ["Lankascincus gansi", "Gans' Lanka Skink"], ["Lankascincus megalops", "Annandale's Litter Skink"], ["Lankascincus sripadensis", "Sripada Lanka Skink"], ["Lankascincus taprobanensis", "Smooth Lanka Skink"], ["Lankascincus taylori", "Taylor's Lanka Skink"], ["Lygosoma singha", "Sri Lankan Supple Skink"], ["Nessia bipes", "Smith's Snake Skink"], ["Nessia burtonii", "Three-toed Snake Skink"], ["Nessia deraniyagalai", "Deraniyagala's Snake Skink"], ["Nessia didactyla", "Two-toed Snake Skink"], ["Nessia gansi", "Gans' Snake Skink"], ["Nessia hickanala", "Shark-head Snake Skink"], ["Nessia layardi", "Layard's Snake Skink"], ["Nessia monodactyla", "Toeless Snake Skink"], ["Nessia sarasinorum", "Sarasin's Snake Skink"], ["Eutropis lankae", "Lanka Skink"], ["Eutropis resetarii", "Resetari's Skink"], ["Lankascincus merrill", "Merrill's Lanka Skink"], ["Lankascincus sameerai", "Sameera's Lanka Skink"],
  ],
  snakes: [
    ["Aspidura brachyorrhos", "Boie's Rough-sided Snake"], ["Aspidura ceylonensis", "Black-spined Snake"], ["Aspidura copei", "Cope's Rough-sided Snake"], ["Aspidura deraniyagalae", "Deraniyagala's Rough-sided Snake"], ["Aspidura drummondhayi", "Drummond-Hay's Rough-sided Snake"], ["Aspidura guentheri", "Günther's Rough-sided Snake"], ["Aspidura ravanai", "Ravana's Rough-sided Snake"], ["Aspidura trachyprocta", "Common Rough-sided Snake"], ["Boiga barnesii", "Barnes' Cat Snake"], ["Dendrelaphis bifrenalis", "Boulenger's Bronzeback"], ["Dendrelaphis oliveri", "Oliver's Bronzeback"], ["Dendrelaphis schokari", "Schokar's Bronzeback"], ["Dendrelaphis sinharajensis", "Sinharaja Bronzeback"], ["Fowlea asperrima", "Sri Lankan Keelback"], ["Lycodon carinatus", "Sri Lankan Wolf Snake"], ["Lycodon osmanhilli", "Flowery Wolf Snake"], ["Oligodon calamarius", "Templeton's Kukri Snake"], ["Oligodon sublineatus", "Streaked Kukri Snake"], ["Rhabdophis ceylonensis", "Sri Lankan Blossom Krait"], ["Cylindrophis maculatus", "Sri Lankan Pipe Snake"], ["Bungarus ceylonicus", "Sri Lankan Krait"], ["Calliophis haematoetron", "Red-bellied Coral Snake"], ["Gerrhopilus ceylonicus", "Smith's Blind Snake"], ["Gerrhopilus mirus", "Jan's Blind Snake"], ["Indotyphlops lankaensis", "Lanka Blind Snake"], ["Indotyphlops leucomelas", "Pied Worm Snake"], ["Indotyphlops malcolmi", "Malcolm's Worm Snake"], ["Indotyphlops tenebrarum", "Taylor's Blind Snake"], ["Indotyphlops veddae", "Vedda Blind Snake"], ["Indotyphlops violaceus", "Violet Blind Snake"], ["Rhinophis blythii", "Blyth's Shieldtail"], ["Rhinophis dorsimaculatus", "Orange Shieldtail"], ["Rhinophis drummondhayi", "Drummond-Hay's Shieldtail"], ["Rhinophis erangaviraji", "Eranga Viraj's Shieldtail"], ["Rhinophis homolepis", "Hemprich's Shieldtail"], ["Rhinophis lineatus", "Striped Shieldtail"], ["Rhinophis melanogaster", "Black Shieldtail"], ["Rhinophis oxyrhynchus", "Schneider's Shieldtail"], ["Rhinophis philippinus", "Cuvier's Shieldtail"], ["Rhinophis phillipsi", "Phillipps' Shieldtail"], ["Rhinophis porrectus", "Willey's Shieldtail"], ["Rhinophis punctatus", "Müller's Shieldtail"], ["Rhinophis roshanpererai", "Roshan Perera's Shieldtail"], ["Rhinophis saffragamus", "Large Shieldtail"], ["Rhinophis tricoloratus", "Deraniyagala's Shieldtail"], ["Rhinophis zigzag", "Zigzag Shieldtail"], ["Hypnale nepa", "Highland Hump-nosed Viper"], ["Hypnale zara", "Lowland Hump-nosed Viper"], ["Trimeresurus trigonocephalus", "Sri Lankan Green Pitviper"], ["Ahaetulla nasuta", "Sri Lankan Green Vine Snake"], ["Ahaetulla pulverulenta", "Brown-speckled Whipsnake"], ["Aspidura desilvai", "De Silva's Rough-sided Snake"], ["Boiga ranaqanei", "Ranawana's Cat Snake"], ["Dendrelaphis effrensis", "Sinharaja Tree Snake"], ["Dendrelaphis thasuni", "Thasun's Bronzeback"], ["Dendrelaphis wickrorum", "Wickramasinghes' Bronzeback"], ["Fowlea unicolor", "Tikiri Keelback"], ["Lycodon chithrasekarai", "Chithrasekara's Bridle Snake"], ["Indotyphlops combank", "Combank Blind Snake"], ["Rhinophis dinarzardae", "Dinarzarde's Shieldtail"], ["Rhinophis gunasekarai", "Gunasekara's Shieldtail"], ["Rhinophis martin", "Martin's Shieldtail"], ["Rhinophis mendisi", "Mendis' Shieldtail"],
  ],
  turtles: [["Lissemys ceylonensis", "Sri Lankan Flapshell Turtle"]],
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const records = Object.entries(groups).flatMap(([subcategory, entries]) => entries.map(([scientificName, commonName]) => ({
  slug: slugify(scientificName),
  commonName,
  scientificName,
  category: "reptiles",
  subcategory,
  endemic: true,
  endemicStatus: "Endemic to Sri Lanka",
  conservationStatus: "Verify with current Red List",
  description: `${commonName} is a Sri Lankan reptile documented in the ${subcategory} group. Scientific and conservation details should be verified against the current checklist and Red List.`,
  image: `https://commons.wikimedia.org/wiki/Special:FilePath/${scientificName.replace(/\s+/g, "_")}.jpg`,
  habitat: "Information not yet added",
  distribution: { region: "Sri Lanka", sriLanka: "Sri Lanka" },
  references: [{ title: "Sri Lankan reptile checklist", source: "User-provided checklist" }],
  isPublished: true,
})));

if (records.length !== 169) throw new Error(`Expected 169 reptile records, found ${records.length}.`);

try {
  await connectDatabase();
  for (const record of records) {
    await Species.findOneAndUpdate({ scientificName: record.scientificName }, record, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  }
  console.log(`Imported ${records.length} reptile records across ${Object.keys(groups).length} subcategories.`);
} catch (error) {
  console.error(`Reptile import failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
