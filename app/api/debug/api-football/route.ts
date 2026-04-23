// app/api/debug/api-football/route.ts
//
// DEBUG endpoint - usuń po naprawieniu problemu!
// Sprawdza czy API-Football klucz jest widoczny i co zwraca surowe API.
//
// Użycie (po zalogowaniu):
//   https://predictio.pl/api/debug/api-football
//
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // Wymagamy zalogowania żeby nikt obcy tego nie widział
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.API_FOOTBALL_KEY;
  const today = new Date().toISOString().split("T")[0];

  const diagnostics: any = {
    keyConfigured: !!key,
    keyLength: key?.length ?? 0,
    keyFirst4: key?.slice(0, 4) ?? null,
    keyLast4: key?.slice(-4) ?? null,
    today,
  };

  if (!key) {
    return NextResponse.json({ ...diagnostics, error: "API_FOOTBALL_KEY is NOT set in environment" });
  }

  // Test 1: Status endpoint - sprawdza limit i czy klucz działa
  try {
    const statusRes = await fetch("https://v3.football.api-sports.io/status", {
      headers: { "x-apisports-key": key },
    });
    diagnostics.statusEndpoint = {
      httpStatus: statusRes.status,
      body: await statusRes.json(),
    };
  } catch (e) {
    diagnostics.statusEndpoint = { error: e instanceof Error ? e.message : "fail" };
  }

  // Test 2: Fixtures na dziś - Premier League
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const season = month >= 7 ? year : year - 1;

    const url = `https://v3.football.api-sports.io/fixtures?league=39&date=${today}&season=${season}`;
    diagnostics.fixturesTest = { url, season };

    const fixRes = await fetch(url, {
      headers: { "x-apisports-key": key },
    });
    const fixData = await fixRes.json();
    diagnostics.fixturesTest.httpStatus = fixRes.status;
    diagnostics.fixturesTest.errors = fixData.errors;
    diagnostics.fixturesTest.results = fixData.results;
    diagnostics.fixturesTest.responseLength = fixData.response?.length ?? 0;
    diagnostics.fixturesTest.firstMatch = fixData.response?.[0] ?? null;
  } catch (e) {
    diagnostics.fixturesTest = { error: e instanceof Error ? e.message : "fail" };
  }

  // Test 3: Spróbuj BEZ parametru season
  try {
    const url = `https://v3.football.api-sports.io/fixtures?league=39&date=${today}`;
    const fixRes = await fetch(url, {
      headers: { "x-apisports-key": key },
    });
    const fixData = await fixRes.json();
    diagnostics.fixturesNoSeason = {
      url,
      httpStatus: fixRes.status,
      errors: fixData.errors,
      results: fixData.results,
      responseLength: fixData.response?.length ?? 0,
    };
  } catch (e) {
    diagnostics.fixturesNoSeason = { error: e instanceof Error ? e.message : "fail" };
  }

  // Test 4: Wszystkie mecze na dziś (bez filtra ligi)
  try {
    const url = `https://v3.football.api-sports.io/fixtures?date=${today}`;
    const fixRes = await fetch(url, {
      headers: { "x-apisports-key": key },
    });
    const fixData = await fixRes.json();
    diagnostics.allFixturesToday = {
      httpStatus: fixRes.status,
      errors: fixData.errors,
      results: fixData.results,
    };
  } catch (e) {
    diagnostics.allFixturesToday = { error: e instanceof Error ? e.message : "fail" };
  }

  return NextResponse.json(diagnostics);
}
