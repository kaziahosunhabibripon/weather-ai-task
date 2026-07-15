import { NextResponse } from "next/server";

type GeocodeResult = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 502 });
  }

  const data = await response.json();
  const results: GeocodeResult[] = (data.results ?? []).map((item: Record<string, unknown>) => ({
    id: String(item.id ?? `${item.name}-${item.latitude}-${item.longitude}`),
    name: String(item.name ?? "Unknown"),
    country: [item.admin1, item.country].filter(Boolean).join(", ") || "Unknown",
    lat: Number(item.latitude),
    lon: Number(item.longitude),
  }));

  return NextResponse.json({ results });
}
