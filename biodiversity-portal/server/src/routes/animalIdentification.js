import express from "express";
import multer from "multer";
import Identification from "../models/Identification.js";
import Species from "../models/Species.js";
import { requireAuth } from "../middleware/auth.js";
import { identifyAnimal } from "../services/animalIdentification.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const identificationLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, message: { success: false, message: "Too many identification requests. Please try again later." } });
const maxBytes = Number(globalThis.process.env.IDENTIFICATION_MAX_BYTES) || 8 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxBytes, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});

function exactPattern(value) {
  return new RegExp(`^${String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
}

async function findSpecies(result) {
  const names = [result.scientific_name, result.common_name, ...result.possible_species].filter(Boolean);
  if (!names.length) return { species: null, matchStatus: "no_match" };
  const records = await Species.find({ isPublished: true, $or: names.flatMap((name) => [{ scientificName: exactPattern(name) }, { commonName: exactPattern(name) }, { localNames: exactPattern(name) }]) }).lean();
  const scientificMatches = records.filter((record) => names.some((name) => exactPattern(name).test(record.scientificName)));
  if (scientificMatches.length === 1) return { species: scientificMatches[0], matchStatus: "matched" };
  if (scientificMatches.length > 1) return { species: null, matchStatus: "ambiguous" };
  const nameMatches = records.filter((record) => names.some((name) => exactPattern(name).test(record.commonName) || record.localNames?.some((alias) => exactPattern(name).test(alias))));
  return nameMatches.length === 1 ? { species: nameMatches[0], matchStatus: "matched" } : { species: null, matchStatus: nameMatches.length ? "ambiguous" : "no_match" };
}

router.post("/identify", requireAuth, identificationLimit, (req, res, next) => upload.single("image")(req, res, (error) => {
  if (error) return res.status(400).json({ success: false, message: error.code === "LIMIT_FILE_SIZE" ? `Image must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller.` : "Upload a JPEG, PNG or WebP image." });
  return next();
}), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "An image is required." });
    const { provider, model, result } = await identifyAnimal(req.file);
    const { species, matchStatus } = await findSpecies(result);
    const identification = await Identification.create({ userId: req.user._id, predictedSpeciesId: species?._id, provider, modelVersion: model, result });
    return res.json({ success: true, data: { identificationId: identification._id, provider, model, suggestion: result, matchStatus, species, identification: { animalDetected: result.animal_detected, commonName: result.common_name, scientificName: result.scientific_name, confidence: result.confidence, description: result.visual_evidence.join(" "), identificationNotes: result.limitations.join(" ") }, databaseMatch: { found: matchStatus === "matched", species } } });
  } catch (error) { return next(error); }
});

router.post("/", requireAuth, identificationLimit, (req, res, next) => upload.single("image")(req, res, next), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "An image is required." });
    const { provider, model, result } = await identifyAnimal(req.file);
    const { species, matchStatus } = await findSpecies(result);
    const identification = await Identification.create({ userId: req.user._id, predictedSpeciesId: species?._id, provider, modelVersion: model, result });
    return res.json({ success: true, identification: { ...result, confidence: result.confidence }, databaseMatch: { found: matchStatus === "matched", species }, data: { identificationId: identification._id, provider, model, suggestion: result, matchStatus, species } });
  } catch (error) { return next(error); }
});

export default router;