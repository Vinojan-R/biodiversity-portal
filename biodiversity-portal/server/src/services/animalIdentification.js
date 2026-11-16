import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { z } from "zod";

const identificationSchema = z.object({
  animal_detected: z.boolean(),
  animal_group: z.enum(["snake", "lizard", "gecko", "frog", "unknown"]),
  animal_category: z.string().trim().max(80),
  common_name: z.string().trim().max(160),
  scientific_name: z.string().trim().max(200),
  possible_family: z.string().trim().max(120),
  confidence: z.number().min(0).max(1),
  possible_species: z.array(z.string().trim().max(200)).max(5),
  is_sri_lankan_endemic: z.enum(["yes", "no", "unknown"]),
  identification_status: z.enum(["possible_match", "uncertain", "unidentified"]),
  visual_evidence: z.array(z.string().trim().max(300)).max(8),
  limitations: z.array(z.string().trim().max(300)).max(8),
});

const responseSchema = {
  type: "object",
  properties: {
    animal_detected: { type: "boolean" },
    animal_group: { type: "string", enum: ["snake", "lizard", "gecko", "frog", "unknown"] },
    animal_category: { type: "string" },
    common_name: { type: "string" },
    scientific_name: { type: "string" },
    possible_family: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    possible_species: { type: "array", items: { type: "string" }, maxItems: 5 },
    is_sri_lankan_endemic: { type: "string", enum: ["yes", "no", "unknown"] },
    identification_status: { type: "string", enum: ["possible_match", "uncertain", "unidentified"] },
    visual_evidence: { type: "array", items: { type: "string" }, maxItems: 8 },
    limitations: { type: "array", items: { type: "string" }, maxItems: 8 },
  },
  required: ["animal_detected", "animal_group", "animal_category", "common_name", "scientific_name", "possible_family", "confidence", "possible_species", "is_sri_lankan_endemic", "identification_status", "visual_evidence", "limitations"],
  additionalProperties: false,
};

const prompt = `You are an assistant for a Sri Lankan biodiversity education portal. Analyse the wildlife photograph conservatively.
Return only JSON matching the supplied schema. Set animal_detected false for non-animal images and leave names empty. Identify only when visible evidence supports a possible identification. Otherwise use unknown or unidentified and empty names. Never invent a species, scientific name, endemic status, conservation status, or confidence score. Confidence is an uncalibrated visual estimate and must be low when uncertain. Do not claim scientific confirmation. The supported groups are snake, lizard, gecko, frog, and unknown. Mention uncertainty or image limitations in limitations. Never advise approaching or handling the animal.`;

function parseProviderJson(value) {
  const text = String(value || "").replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
  return identificationSchema.parse(JSON.parse(text));
}

async function identifyWithGemini(image) {
  if (!globalThis.process.env.GEMINI_API_KEY) throw Object.assign(new Error("Gemini is not configured."), { statusCode: 503 });
  const client = new GoogleGenAI({ apiKey: globalThis.process.env.GEMINI_API_KEY });
  const response = await client.models.generateContent({
    model: globalThis.process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: image.mimetype, data: image.buffer.toString("base64") } }] }],
    config: { responseMimeType: "application/json", responseSchema },
  });
  return { result: parseProviderJson(response.text), model: globalThis.process.env.GEMINI_MODEL || "gemini-2.5-flash" };
}

async function identifyWithOpenAI(image) {
  if (!globalThis.process.env.OPENAI_API_KEY) throw Object.assign(new Error("OpenAI is not configured."), { statusCode: 503 });
  const client = new OpenAI({ apiKey: globalThis.process.env.OPENAI_API_KEY, timeout: Number(globalThis.process.env.AI_TIMEOUT_MS) || 30000 });
  const response = await client.chat.completions.create({
    model: globalThis.process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_schema", json_schema: { name: "animal_identification", strict: true, schema: responseSchema } },
    messages: [{ role: "system", content: prompt }, { role: "user", content: [{ type: "text", text: "Identify this animal photograph." }, { type: "image_url", image_url: { url: `data:${image.mimetype};base64,${image.buffer.toString("base64")}` } }] }],
  });
  return { result: parseProviderJson(response.choices[0]?.message?.content), model: globalThis.process.env.OPENAI_MODEL || "gpt-4o-mini" };
}

export async function identifyAnimal(image) {
  const provider = String(globalThis.process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider === "gemini") return { provider, ...(await identifyWithGemini(image)) };
  if (provider === "openai") return { provider, ...(await identifyWithOpenAI(image)) };
  throw Object.assign(new Error("AI_PROVIDER must be gemini or openai."), { statusCode: 500 });
}