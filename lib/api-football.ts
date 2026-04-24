// lib/api-football.ts
import { createClient } from "@/lib/supabase/server";

const API_KEY = process.env.API_FOOTBALL_KEY!;
const BASE = "https://v3.football.api-sports.io";

// Nazwy top lig (po nazwie z API-Football). Filtrujemy PO STRONIE KLIENTA,
// bo plan Free API-Football nie pozwala filtrować po `league` + `season` dla sezonu 2025+.
export const TOP_LEAGUE_NAMES = new Set([
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Ekstraklasa",
  "UEFA Champions League",
  "UEFA Europa League",
  "UEFA Europa Conference League",
  "Eredivisie",
  "Primeira Liga",
  "Championship",
]);

// Nadal eksportujemy ID dla kompatybilności z innymi plikami
export const TOP_LEAGUES: Record<string, number> = {
  "Premier League": 39,
  "La Liga": 140,
  "Serie A": 135,
  "Bundesliga": 78,
  "Ligue 1": 61,
  "Ekstraklasa": 106,
  "Champions League": 2,
  "Europa League": 3,
  "Eredivisie": 88,
};

export interface ApiFixture {
  fixture: { id: number; date: string; status: { short: string; elapsed: number | null } };
  league: { id: number; name: string; country: string; logo: string };
  teams: { home: { name: string; logo: string }; away: { name: string; logo: string } };
  goals: { home: number | null; away: number | null };
}

async function apiCall(endpoint: string): Promise<any> {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { "x-apisports-key": API_KEY },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API-Football ${res.status}`);
  return res.json();
}

// Pobierz WSZYSTKIE mecze na dany dzień (bez filtra ligi/sezonu - działa na Free planie),
// a następnie filtruj po nazwach top lig po naszej stronie.
export async function fetchFixturesByDate(date: string): Promise<ApiFixture[]> {
  try {
    const data = await apiCall(`/fixtures?date=${date}`);
    const all: ApiFixture[] = data.response || [];
    return all.filter((f) => TOP_LEAGUE_NAMES.has(f.league.name));
  } catch (e) {
    console.error("fetchFixturesByDate failed:", e);
    return [];
  }
}

// Mecze LIVE - endpoint live=all też jest dostępny bez sezonu
export async function fetchLiveFixtures(): Promise<ApiFixture[]> {
  try {
    const data = await apiCall("/fixtures?live=all");
    const all: ApiFixture[] = data.response || [];
    return all.filter((f) => TOP_LEAGUE_NAMES.has(f.league.name));
  } catch (e) {
    console.error("fetchLiveFixtures failed:", e);
    return [];
  }
}

// Mapowanie statusu
export function mapStatus(short: string): "upcoming" | "live" | "finished" {
  if (["NS", "TBD", "PST"].includes(short)) return "upcoming";
  if (["FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO"].includes(short)) return "finished";
  return "live";
}

// Cache do Supabase
export async function cacheFixtures(fixtures: ApiFixture[]) {
  if (fixtures.length === 0) return;
  const supabase = await createClient();
  const rows = fixtures.map((f) => ({
    fixture_id: f.fixture.id,
    home_team: f.teams.home.name,
    away_team: f.teams.away.name,
    home_logo: f.teams.home.logo,
    away_logo: f.teams.away.logo,
    league: f.league.name,
    league_logo: f.league.logo,
    country: f.league.country,
    match_date: f.fixture.date.split("T")[0],
    kickoff_time: f.fixture.date,
    status: mapStatus(f.fixture.status.short),
    score_home: f.goals.home,
    score_away: f.goals.away,
    minute: f.fixture.status.elapsed,
    cached_at: new Date().toISOString(),
  }));
  await supabase.from("matches_cache").upsert(rows, { onConflict: "fixture_id" });
}
