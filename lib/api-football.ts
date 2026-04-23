// lib/api-football.ts
import { createClient } from "@/lib/supabase/server";

const API_KEY = process.env.API_FOOTBALL_KEY!;
const BASE = "https://v3.football.api-sports.io";

// Top ligi (żeby nie pobierać wszystkich meczów świata)
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
  "Liga Portuguesa": 94,
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
    next: { revalidate: 300 }, // cache 5 min
  });
  if (!res.ok) throw new Error(`API-Football ${res.status}`);
  return res.json();
}

// Pobierz mecze na konkretny dzień z top lig
export async function fetchFixturesByDate(date: string): Promise<ApiFixture[]> {
  const allFixtures: ApiFixture[] = [];
  for (const leagueId of Object.values(TOP_LEAGUES)) {
    try {
      const data = await apiCall(`/fixtures?league=${leagueId}&date=${date}&season=${getCurrentSeason(date)}`);
      if (data.response) allFixtures.push(...data.response);
    } catch {
      // ignore single league fail
    }
  }
  return allFixtures;
}

// Pobierz wszystkie mecze LIVE
export async function fetchLiveFixtures(): Promise<ApiFixture[]> {
  const data = await apiCall("/fixtures?live=all");
  return (data.response || []).filter((f: ApiFixture) =>
    Object.values(TOP_LEAGUES).includes(f.league.id)
  );
}

// Sezon zależy od miesiąca (sierpień-maj = nowy sezon)
function getCurrentSeason(dateStr: string): number {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return month >= 7 ? year : year - 1;
}

// Mapowanie statusu API na nasz format
export function mapStatus(short: string): "upcoming" | "live" | "finished" {
  if (["NS", "TBD", "PST"].includes(short)) return "upcoming";
  if (["FT", "AET", "PEN", "CANC", "ABD", "AWD", "WO"].includes(short)) return "finished";
  return "live"; // 1H, 2H, HT, ET, BT, P, LIVE
}

// Cache meczów do Supabase
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
