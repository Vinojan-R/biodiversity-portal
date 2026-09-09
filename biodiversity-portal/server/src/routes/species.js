import express from "express";
import Species from "../models/Species.js";
import SpeciesImage from "../models/SpeciesImage.js";

const router = express.Router();

function publicSpecies(species, images = []) {
  return {
    ...species,
    id: species.slug,
    endemic: species.endemic,
    habitat: species.habitat || "Information not yet added",
    region: species.distribution?.region || species.distribution?.sriLanka || "Sri Lanka",
    image: images.find((image) => image.isPrimary)?.imageUrl || images[0]?.imageUrl || species.image,
    images,
  };
}

router.get("/", async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
  const query = { isPublished: true };
  const search = String(req.query.search || "").trim();
  if (search) query.$text = { $search: search };
  if (req.query.category && req.query.category !== "all") query.category = req.query.category;
  if (req.query.endemic === "true") query.endemic = true;
  if (req.query.endemic === "false") query.endemic = false;
  if (req.query.conservationStatus) query.conservationStatus = req.query.conservationStatus;

  const sort = req.query.sort === "scientific-name" ? { scientificName: 1 } : { commonName: 1 };
  const [species, total] = await Promise.all([
    Species.find(query).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Species.countDocuments(query),
  ]);
  return res.json({ success: true, data: { species: species.map((item) => publicSpecies(item)), pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
});

router.get("/:slug", async (req, res) => {
  const species = await Species.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!species) return res.status(404).json({ success: false, message: "Species not found." });
  const images = await SpeciesImage.find({ speciesId: species._id }).sort({ isPrimary: -1, createdAt: 1 }).lean();
  return res.json({ success: true, data: { species: publicSpecies(species, images) } });
});

export default router;