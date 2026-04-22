// lib/types.ts

export type MatchResult = "win" | "loss" | "void" | null;

export type League =
  | "Premier League"
  | "La Liga"
  | "Serie A"
  | "Bundesliga"
  | "Ligue 1"
  | "Ekstraklasa"
  | "Champions League"
  | "Eredivisie";

export const LEAGUES: League[] = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Ekstraklasa",
  "Champions League",
  "Eredivisie",
];

export const MARKETS = [
  "Wynik meczu (1X2)",
  "Over/Under goli",
  "BTTS (Obie strzelą)",
  "Handicap azjatycki",
  "Dokładny wynik",
  "Corners",
  "Kartki",
] as const;

export type Market = (typeof MARKETS)[number];

export interface TeamResearch {
  recentForm?: string;
  lastMatches?: Array<{ date: string; vs: string; score: string }>;
  injuries?: string[];
  suspensions?: string[];
  probableLineup?: string;
  keyStats?: string;
}

export interface ResearchData {
  h2h?: {
    lastMatches?: Array<{ date: string; score: string; competition: string }>;
    summary?: string;
  };
  homeTeam?: TeamResearch;
  awayTeam?: TeamResearch;
  odds?: {
    home?: string;
    draw?: string;
    away?: string;
    overUnder?: string;
    btts?: string;
  };
  context?: string;
  dataQuality?: "wysoka" | "średnia" | "niska";
}

export interface PredictionAnalysis {
  prediction: string;
  confidence: number;
  impliedProbability: string;
  valueRating: "TAK" | "NIE" | "BRAK DANYCH";
  valueExplanation?: string;
  analysis: string;
  keyFactors: string[];
  risk: "niskie" | "średnie" | "wysokie";
  alternativeBets?: Array<{ bet: string; reason: string }>;
  socialCaption: string;
  socialCaptionLong: string;
}

export interface MatchInput {
  homeTeam: string;
  awayTeam: string;
  league: League;
  matchDate: string;
  market: Market;
  notes?: string;
}

// Row z bazy Supabase
export interface PredictionRow {
  id: string;
  user_id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
  market: string;
  research_data: ResearchData | null;
  prediction: string;
  confidence: number;
  implied_probability: string | null;
  value_rating: string | null;
  analysis: string | null;
  key_factors: string[] | null;
  alternative_bets: Array<{ bet: string; reason: string }> | null;
  risk: string | null;
  social_caption: string | null;
  social_caption_long: string | null;
  result: MatchResult;
  odds: number | null;
  created_at: string;
  updated_at: string;
}
