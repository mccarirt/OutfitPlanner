import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

export const outfitRequestSchema = z.object({
  age: z.coerce.number().int().min(1).max(120),
  sex: z.enum(["Male", "Female"]),
  location: z.string().trim().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  occasion: z.string().trim().min(1),
  weather: z.object({
    temperatureMaxF: z.number(),
    temperatureMinF: z.number(),
    condition: z.string().trim().min(1),
  }),
});

export type OutfitRequest = z.infer<typeof outfitRequestSchema>;

export const OUTFIT_CATEGORIES = ["Outerwear", "Top", "Bottoms", "Footwear", "Accessory"] as const;

const outfitItemSchema = z.object({
  category: z.enum(OUTFIT_CATEGORIES),
  description: z.string().trim().min(1),
  searchQuery: z.string().trim().min(1),
});

const outfitSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  matchScore: z.number().int().min(0).max(100),
  items: z.array(outfitItemSchema).min(3).max(5),
});

export const outfitResponseSchema = z.object({
  outfits: z.array(outfitSchema).min(1).max(3),
});

export type OutfitRecommendation = z.infer<typeof outfitSchema>;
export type OutfitRecommendationResponse = z.infer<typeof outfitResponseSchema>;

/** Gemini response schema used to force the reply into the shape above. */
const OUTFIT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    outfits: {
      type: Type.ARRAY,
      minItems: "1",
      maxItems: "3",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "A short, evocative outfit name, e.g. 'Effortless & Warm'.",
          },
          description: {
            type: Type.STRING,
            description: "One sentence tying the outfit to the weather and occasion.",
          },
          matchScore: {
            type: Type.INTEGER,
            minimum: 0,
            maximum: 100,
            description: "How well this outfit fits the weather and occasion, 0-100.",
          },
          items: {
            type: Type.ARRAY,
            minItems: "3",
            maxItems: "5",
            items: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  format: "enum",
                  enum: OUTFIT_CATEGORIES as unknown as string[],
                },
                description: {
                  type: Type.STRING,
                  description: "A specific garment description, e.g. 'charcoal wool overcoat'.",
                },
                searchQuery: {
                  type: Type.STRING,
                  description: "A concise shopping search query for finding this item.",
                },
              },
              required: ["category", "description", "searchQuery"],
              propertyOrdering: ["category", "description", "searchQuery"],
            },
          },
        },
        required: ["name", "description", "matchScore", "items"],
        propertyOrdering: ["name", "description", "matchScore", "items"],
      },
    },
  },
  required: ["outfits"],
};

export function buildOutfitSystemPrompt(): string {
  return [
    "You are a personal stylist for an outfit-planning app.",
    "Given a person's age, sex, location, date, occasion, and the day's weather, recommend exactly 3 complete outfits.",
    "Each outfit must have 3 to 5 items covering practical categories (Outerwear, Top, Bottoms, Footwear, Accessory) appropriate for the weather.",
    "Only include Outerwear when the weather calls for it. Rank outfits by matchScore, highest first.",
    "Respond with JSON matching the provided schema only. Do not include any text outside the JSON.",
  ].join(" ");
}

export function buildOutfitUserPrompt(request: OutfitRequest): string {
  const { age, sex, location, date, occasion, weather } = request;
  return [
    `Person: ${age}-year-old ${sex}.`,
    `Location: ${location}.`,
    `Date: ${date}.`,
    `Occasion: ${occasion}.`,
    `Weather: high ${weather.temperatureMaxF}°F, low ${weather.temperatureMinF}°F, ${weather.condition}.`,
  ].join(" ");
}

export type OutfitGenerationResult =
  | { ok: true; data: OutfitRecommendationResponse }
  | { ok: false; status: number; error: string; details?: unknown };

/**
 * Calls Gemini with a forced JSON response schema so the reply is guaranteed
 * structured JSON, then validates it against outfitResponseSchema. Shared by
 * the /api/outfits route and any server-side code (e.g. the results page)
 * that wants recommendations without a self-referential HTTP round trip.
 */
export async function generateOutfitRecommendations(
  request: OutfitRequest,
): Promise<OutfitGenerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, error: "Server is missing GEMINI_API_KEY" };
  }

  const ai = new GoogleGenAI({ apiKey });

  let responseText: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
      contents: buildOutfitUserPrompt(request),
      config: {
        systemInstruction: buildOutfitSystemPrompt(),
        responseMimeType: "application/json",
        responseSchema: OUTFIT_RESPONSE_SCHEMA,
      },
    });
    responseText = response.text;
  } catch (error) {
    console.error("Gemini request failed", error);
    return { ok: false, status: 502, error: "Failed to reach Gemini" };
  }

  if (!responseText) {
    return { ok: false, status: 502, error: "Gemini did not return any content" };
  }

  let json: unknown;
  try {
    json = JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini response was not valid JSON", error, responseText);
    return { ok: false, status: 502, error: "Gemini did not return valid JSON" };
  }

  const parsed = outfitResponseSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      status: 502,
      error: "Gemini response did not match the expected schema",
      details: parsed.error.flatten(),
    };
  }

  return { ok: true, data: parsed.data };
}
