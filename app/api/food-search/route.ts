import { NextResponse, type NextRequest } from "next/server";
import { searchFoods } from "@/lib/usda";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchFoods(q);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { results: [], error: "The field guide is unreachable right now." },
      { status: 502 },
    );
  }
}
