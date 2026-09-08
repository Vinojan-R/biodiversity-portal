import express from "express";
import { z } from "zod";
import Animal from "../models/Animal.js";
import User from "../models/User.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();
const animalInput = z.object({
  commonName: z.string().trim().min(2).max(120),
  scientificName: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  habitat: z.string().trim().max(240).optional(),
  image: z.string().trim().max(500).optional(),
  description: z.string().trim().max(1000).optional(),
  endemic: z.boolean().optional(),
});

router.use(requireAuth, requireAdmin);
router.get("/users", async (_req, res) => res.json({ users: await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean() }));
router.patch("/users/:id/status", async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json({ user });
});
router.get("/animals", async (_req, res) => res.json({ animals: await Animal.find().sort({ createdAt: -1 }).lean() }));
router.post("/animals", async (req, res) => {
  const parsed = animalInput.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Provide a valid animal record." });
  return res.status(201).json({ animal: await Animal.create(parsed.data) });
});
router.patch("/animals/:id", async (req, res) => {
  const parsed = animalInput.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Provide a valid animal record." });
  const animal = await Animal.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
  if (!animal) return res.status(404).json({ message: "Animal not found." });
  return res.json({ animal });
});
router.delete("/animals/:id", async (req, res) => {
  const animal = await Animal.findByIdAndDelete(req.params.id);
  if (!animal) return res.status(404).json({ message: "Animal not found." });
  return res.status(204).end();
});

export default router;