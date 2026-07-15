import { NextResponse } from "next/server";

type GeocodeResult = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
};

const localFallbacks: GeocodeResult[] = [
  { id: "dinajpur-bd", name: "Dinajpur", country: "Bangladesh", lat: 25.6279, lon: 88.6332 },
  { id: "dhaka-bd", name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
  { id: "chittagong-bd", name: "Chittagong", country: "Bangladesh", lat: 22.3569, lon: 91.7832 },
  { id: "rajshahi-bd", name: "Rajshahi", country: "Bangladesh", lat: 24.3745, lon: 88.6042 },
  { id: "sylhet-bd", name: "Sylhet", country: "Bangladesh", lat: 24.8949, lon: 91.8687 },
  { id: "khulna-bd", name: "Khulna", country: "Bangladesh", lat: 22.8456, lon: 89.5403 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const fallbackResults = localFallbacks.filter((item) => {
    const haystack = `${item.name} ${item.country}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
  });
  const cityResults = await searchCities(query);
  const addressResults = await searchAddresses(query);
  const merged = [...fallbackResults, ...cityResults, ...addressResults].filter(
    (item, index, list) => list.findIndex((match) => Math.abs(match.lat - item.lat) < 0.001 && Math.abs(match.lon - item.lon) < 0.001) === index,
  );

  return NextResponse.json({ results: merged.slice(0, 8) });
}

async function searchCities(query: string): Promise<GeocodeResult[]> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) return [];

  const data = await response.json();
  return (data.results ?? []).map((item: Record<string, unknown>) => ({
    id: String(item.id ?? `${item.name}-${item.latitude}-${item.longitude}`),
    name: String(item.name ?? "Unknown"),
    country: [item.admin1, item.country].filter(Boolean).join(", ") || "Unknown",
    lat: Number(item.latitude),
    lon: Number(item.longitude),
  }));
}

async function searchAddresses(query: string): Promise<GeocodeResult[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "WeatherOpsDashboard/1.0",
      Accept: "application/json",
    },
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!response.ok) return [];

  const data = await response.json();
  return (data ?? []).map((item: Record<string, unknown>) => {
    const address = (item.address ?? {}) as Record<string, unknown>;
    const name = String(item.name || address.city || address.town || address.village || address.county || item.display_name || "Selected address");
    const country = [address.state, address.country].filter(Boolean).join(", ") || String(item.display_name ?? "Address result");

    return {
      id: String(item.place_id ?? `${item.lat}-${item.lon}`),
      name,
      country,
      lat: Number(item.lat),
      lon: Number(item.lon),
    };
  });
}
