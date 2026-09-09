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

router.use(requireAuth);
router.get("/mine", async (req, res) => res.json({ success: true, data: { observations: await Observation.find({ userId: req.user._id }).populate("speciesId", "slug commonName scientificName").sort({ createdAt: -1 }).lean() } }));
router.post("/", async (req, res) => {
  const parsed = observationInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Provide valid observation details." });
  if (parsed.data.speciesId && !(await Species.exists({ _id: parsed.data.speciesId, isPublished: true }))) return res.status(400).json({ success: false, message: "Species was not found." });
  const observation = await Observation.create({ ...parsed.data, userId: req.user._id });
  return res.status(201).json({ success: true, data: { observation } });
});

export default router;