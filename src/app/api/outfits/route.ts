import { NextResponse } from "next/server";
import { generateOutfitRecommendations, outfitRequestSchema } from "@/lib/outfitRecommendations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });
  }

  const parsedRequest = outfitRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsedRequest.error.flatten() },
      { status: 400 },
    );
  }

  const result = await generateOutfitRecommendations(parsedRequest.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data);
}
