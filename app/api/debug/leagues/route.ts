// app/api/debug/leagues/route.ts
//
// DEBUG: pokaże listę unikalnych nazw lig jakie API-Football zwraca na dziś
// To pomoże zweryfikować czy nasz filtr TOP_LEAGUE_NAMES łapie prawdziwe nazwy
//
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.API_FOOTBALL_KEY;
  if (!key) return NextResponse.json({ error: "No key" }, { status: 500 });

  const today = new Date().toISOString().split("T")[0];

  const res = await fetch(`https://v3.football.api-sports.io/fixtures?date=${today}`, {
    headers: { "x-apisports-key": key },
  });
  const data = await res.json();

  const all: any[] = data.response || [];

  // Zbierz unikalne ligi - country + league name
  const leagueMap = new Map<string, { country: string; name: string; count: number; id: number }>();
  for (const f of all) {
    const key = `${f.league.country}::${f.league.name}`;
    const existing = leagueMap.get(key);
    if (existing) existing.count++;
    else leagueMap.set(key, {
      country: f.league.country,
      name: f.league.name,
      id: f.league.id,
      count: 1,
    });
  }

  const leagues = [...leagueMap.values()].sort((a, b) => b.count - a.count);

  // Dodatkowo: top 10 meczów z informacją
  const firstFew = all.slice(0, 10).map((f) => ({
    leagueName: f.league.name,
    country: f.league.country,
    home: f.teams.home.name,
    away: f.teams.away.name,
    kickoff: f.fixture.date,
    status: f.fixture.status.short,
  }));

  // Filtr top-lig wg naszego kodu - zobaczmy ile przepuści
  const TOP = new Set([
    "Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1",
    "Ekstraklasa", "UEFA Champions League", "UEFA Europa League",
    "UEFA Europa Conference League", "Eredivisie", "Primeira Liga", "Championship",
  ]);
  const matched = all.filter((f) => TOP.has(f.league.name));
  const matchedSample = matched.slice(0, 5).map((f) => ({
    league: f.league.name,
    home: f.teams.home.name,
    away: f.teams.away.name,
  }));

  return NextResponse.json({
    today,
    totalMatches: all.length,
    uniqueLeagues: leagues.length,
    topLeaguesByCount: leagues.slice(0, 40),
    sampleFirstFew: firstFew,
    matchedByFilter: matched.length,
    matchedSample,
  });
}
