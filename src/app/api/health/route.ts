import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    checkedAt: new Date().toISOString(),
    cache: "memory",
    upstreamConfigured: Boolean(process.env.WEATHERAI_API_KEY),
  });
}
