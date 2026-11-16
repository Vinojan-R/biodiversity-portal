import express from "express";
import { z } from "zod";
import Observation from "../models/Observation.js";
import Species from "../models/Species.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const observationInput = z.object({
  speciesId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  imageUrl: z.string().url().max(500).optional().or(z.literal("")),
  location: z.string().trim().max(240).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  observedAt: z.coerce.date().optional(),
  description: z.string().trim().max(1000).optional(),
});
const mapQuery = z.object({
  speciesId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  search: z.string().trim().max(120).optional(),
  location: z.string().trim().max(120).optional(),
  verificationStatus: z.enum(["all", "verified", "pending", "rejected"]).default("verified"),
  category: z.string().trim().max(60).optional(),
  endemic: z.enum(["all", "true", "false"]).default("all"),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

function publicObservation(item) {
  return {
    id: item._id,
    animal: item.speciesId,
    latitude: Number(item.latitude.toFixed(2)),
    longitude: Number(item.longitude.toFixed(2)),
    location: item.location || "Location withheld",
    observedAt: item.observedAt,
    description: item.description || "No description provided.",
    imageUrl: item.imageUrl || item.speciesId?.image || "",
    verificationStatus: item.verificationStatus,
  };
}

router.get("/map-data", async (req, res) => {
  const parsed = mapQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid map filters." });
  const filters = parsed.data;
  const query = { latitude: { $gte: 5.9, $lte: 9.9 }, longitude: { $gte: 79.4, $lte: 81.9 } };
  if (filters.verificationStatus !== "all") query.verificationStatus = filters.verificationStatus;
  if (filters.speciesId) query.speciesId = filters.speciesId;
  if (filters.location) query.location = { $regex: filters.location, $options: "i" };
  const speciesFilter = { isPublished: true };
  if (filters.category) speciesFilter.category = filters.category;
  if (filters.endemic !== "all") speciesFilter.endemic = filters.endemic === "true";
  if (filters.category || filters.endemic !== "all") {
    const matchingSpecies = await Species.find(speciesFilter).distinct("_id");
    query.speciesId = filters.speciesId ? { $in: matchingSpecies.filter((id) => id.toString() === filters.speciesId) } : { $in: matchingSpecies };
  }
  if (filters.dateFrom || filters.dateTo) {
    query.observedAt = {};
    if (filters.dateFrom) query.observedAt.$gte = filters.dateFrom;
    if (filters.dateTo) query.observedAt.$lte = filters.dateTo;
  }
  const [observations, species] = await Promise.all([
    Observation.find(query).populate("speciesId", "slug commonName scientificName image endemic category").sort({ observedAt: -1 }).limit(2000).lean(),
    Species.find({ isPublished: true }).select("_id slug commonName scientificName image endemic category").sort({ commonName: 1 }).lean(),
  ]);
  const filtered = filters.search ? observations.filter((item) => [item.speciesId?.commonName, item.speciesId?.scientificName, item.speciesId?.category].some((value) => value?.toLowerCase().includes(filters.search.toLowerCase()))) : observations;
  const counts = filtered.reduce((result, item) => {
    const speciesName = item.speciesId?.commonName || "Unidentified";
    result.species[speciesName] = (result.species[speciesName] || 0) + 1;
    const location = item.location || "Unspecified";
    result.locations[location] = (result.locations[location] || 0) + 1;
    return result;
  }, { species: {}, locations: {} });
  const mostFrequent = Object.entries(counts.species).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  const topLocation = Object.entries(counts.locations).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  return res.json({ success: true, data: {
    species,
    observations: filtered.map(publicObservation),
    stats: { total: filtered.length, species: Object.keys(counts.species).length, mostFrequent, topLocation, verified: filtered.filter((item) => item.verificationStatus === "verified").length },
  } });
});

router.use(requireAuth);

router.get("/mine", async (req, res) => res.json({ success: true, data: { observations: await Observation.find({ userId: req.user._id }).populate("speciesId", "slug commonName scientificName").sort({ createdAt: -1 }).lean() } }));

router.get("/:id", async (req, res) => {
  const observation = await Observation.findOne({ _id: req.params.id, $or: [{ userId: req.user._id }, { verificationStatus: "verified" }] }).populate("speciesId", "slug commonName scientificName image endemic category description").lean();
  if (!observation) return res.status(404).json({ success: false, message: "Observation not found." });
  return res.json({ success: true, data: { observation: publicObservation(observation) } });
});

router.post("/", async (req, res) => {
  const parsed = observationInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid observation details." });
  if ((parsed.data.latitude === undefined) !== (parsed.data.longitude === undefined)) return res.status(400).json({ success: false, message: "Latitude and longitude must be provided together." });
  if (parsed.data.latitude !== undefined && parsed.data.longitude !== undefined && (parsed.data.latitude < 5.9 || parsed.data.latitude > 9.9 || parsed.data.longitude < 79.4 || parsed.data.longitude > 81.9)) return res.status(400).json({ success: false, message: "Observation coordinates must be within Sri Lanka." });
  if (parsed.data.speciesId && !(await Species.exists({ _id: parsed.data.speciesId, isPublished: true }))) return res.status(400).json({ success: false, message: "Species was not found." });
  const observation = await Observation.create({ ...parsed.data, userId: req.user._id });
  return res.status(201).json({ success: true, data: { observation } });
});

export default router;
