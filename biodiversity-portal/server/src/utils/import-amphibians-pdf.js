import "dotenv/config";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import mongoose from "mongoose";
import Species from "../models/Species.js";
import { connectDatabase } from "../config/database.js";

const pdfPath = globalThis.process.argv[2] || "C:\\Users\\USER\\Desktop\\sri_lankan_endemic_amphibians_107.pdf";
const statusLabels = ["Critically Endangered", "Data Deficient", "Least Concern", "Near Threatened", "Endangered", "Vulnerable", "Extinct"];
const scientificCorrections = new Map([
  ["MiCritically Endangeredohyla", "Microhyla"],
  ["Polypedates Critically Endangereduciger", "Polypedates cruciger"],
  ["Pseudophilautus maCritically Endangeredopus", "Pseudophilautus macropus"],
  ["Pseudophilautus maLeast Concernolmsmithi", "Pseudophilautus malcolmsmithi"],
  ["Pseudophilautus miCritically Endangeredotympanum", "Pseudophilautus minutympanum"],
]);

function findPdfToText() {
  if (globalThis.process.env.PDFTOTEXT_PATH) return globalThis.process.env.PDFTOTEXT_PATH;
  if (globalThis.process.platform === "win32") {
    const gitPath = "C:\\Program Files\\Git\\mingw64\\bin\\pdftotext.exe";
    if (fs.existsSync(gitPath)) return gitPath;
  }
  return "pdftotext";
}

function extractText() {
  const outputPath = path.join(os.tmpdir(), `amphibians-${globalThis.process.pid}.txt`);
  execFileSync(findPdfToText(), ["-raw", pdfPath, outputPath], { stdio: "pipe" });
  try {
    return fs.readFileSync(outputPath, "utf8").replace(/\r/g, "");
  } finally {
    fs.rmSync(outputPath, { force: true });
  }
}

function section(text, header, nextHeader) {
  const start = text.indexOf(header);
  const end = nextHeader ? text.indexOf(nextHeader, start + header.length) : text.length;
  if (start < 0 || end < 0) throw new Error(`Could not find PDF section: ${header}`);
  return text
    .slice(start + header.length, end)
    .split("\n")
    .map((line) => line.replace(/\f/g, "").trim())
    .filter(Boolean);
}

function cleanScientificName(value) {
  const cleaned = value.replace(/(?:Critically Endangered|Data Deficient|Least Concern|Near Threatened|Endangered|Vulnerable|Extinct)/g, "").replace(/\s+/g, " ").trim();
  return scientificCorrections.get(value) || cleaned;
}

function cleanCommonName(value) {
  const midpoint = Math.floor(value.length / 2);
  if (value.slice(0, midpoint) === value.slice(midpoint).trim()) return value.slice(0, midpoint).trim();
  return value;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseRecords(text) {
  const headers = ["Slug Common name", "Scientific name", "Image URL", "Habitat", "Distribution", "Conservation status Category", "DesCritically Endangerediption"];
  const blocks = headers.map((header, index) => section(text, header, headers[index + 1]));
  const [commonNames, scientificNames, imageUrls, habitats, distributions, statuses] = blocks;
  const count = commonNames.length;
  if (![scientificNames, imageUrls, habitats, distributions, statuses].every((block) => block.length === count) || count !== 107) {
    throw new Error(`Expected 107 aligned records, found ${count} common names and mismatched detail columns.`);
  }

  const usedSlugs = new Set();
  return commonNames.map((rawCommonName, index) => {
    const commonName = cleanCommonName(rawCommonName);
    const scientificName = cleanScientificName(scientificNames[index]);
    const status = statuses[index].replace(/\s+amphibians$/, "").trim();
    const baseSlug = slugify(commonName);
    const slug = usedSlugs.has(baseSlug) ? `${baseSlug}-${slugify(scientificName.split(" ").slice(-1)[0])}` : baseSlug;
    usedSlugs.add(slug);
    return {
      slug,
      commonName,
      scientificName,
      category: "amphibians",
      endemic: true,
      endemicStatus: "Endemic to Sri Lanka",
      conservationStatus: statusLabels.includes(status) ? status : "Verify with source PDF",
      description: `${commonName} is a Sri Lankan endemic amphibian. ${habitats[index]}. Distribution: ${distributions[index]}.`,
      image: `https://commons.wikimedia.org/wiki/Special:FilePath/${scientificName.replace(/\s+/g, "_")}.jpg`,
      habitat: habitats[index],
      distribution: { region: distributions[index], sriLanka: distributions[index] },
      references: [{ title: "Sri Lankan endemic amphibians source PDF", source: path.basename(pdfPath) }],
      isPublished: true,
    };
  });
}

try {
  if (!fs.existsSync(pdfPath)) throw new Error(`PDF not found: ${pdfPath}`);
  const records = parseRecords(extractText());
  await connectDatabase();
  for (const record of records) {
    await Species.findOneAndUpdate({ scientificName: record.scientificName }, record, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  }
  console.log(`Imported ${records.length} amphibian records from ${path.basename(pdfPath)}.`);
} catch (error) {
  console.error(`Amphibian import failed: ${error.message}`);
  globalThis.process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}