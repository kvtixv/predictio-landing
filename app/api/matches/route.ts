// app/api/matches/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchFixturesByDate, fetchLiveFixtures, cacheFixtures, mapStatus } from "@/lib/api-football";

// GET /api/matches?date=2026-04-22&status=upcoming|live|all
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
  const status = searchParams.get("status") || "all";

  try {
    // Najpierw spróbuj z cache (jeśli świeży - do 10 min)
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    let query = supabase
      .from("matches_cache")
      .select("*")
      .eq("match_date", date)
      .gte("cached_at", tenMinAgo)
      .order("kickoff_time", { ascending: true });

    if (status === "live") query = query.eq("status", "live");
    else if (status === "upcoming") query = query.eq("status", "upcoming");

    const { data: cached } = await query;

    if (cached && cached.length > 0) {
      return NextResponse.json({ matches: cached, source: "cache" });
    }

    // Cache pusty - pobierz z API
    const fixtures = status === "live"
      ? await fetchLiveFixtures()
      : await fetchFixturesByDate(date);

    await cacheFixtures(fixtures);

    // Zwróć po dodaniu do cache
    const { data: fresh } = await supabase
      .from("matches_cache")
      .select("*")
      .eq("match_date", date)
      .order("kickoff_time", { ascending: true });

    return NextResponse.json({ matches: fresh || [], source: "api" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
