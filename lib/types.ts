export interface Match {
  id: number
  utcDate: string
  status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "CANCELLED"
  matchday: number
  homeTeam: {
    id: number
    name: string
    shortName: string
    crest: string
  }
  awayTeam: {
    id: number
    name: string
    shortName: string
    crest: string
  }
  competition: {
    id: number
    name: string
    code: string
    emblem: string
  }
  score: {
    fullTime: {
      home: number | null
      away: number | null
    }
  }
}

export interface League {
  id: string
  name: string
  code: string
  country: string
  emblem: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  home_team: string
  away_team: string
  league: string
  match_date: string
  market: string
  prediction: string
  confidence: number
  implied_probability: string
  value_rating: string
  risk: "niskie" | "srednie" | "wysokie"
  analysis: string
  key_factors: string[]
  social_caption: string
  result: "win" | "loss" | "void" | null
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SavedMatch {
  id: string
  user_id: string
  match_id: string
  home_team: string
  away_team: string
  league: string
  match_date: string
  created_at: string
}

export const LEAGUES: League[] = [
  { id: "PL", name: "Premier League", code: "PL", country: "England", emblem: "" },
  { id: "PD", name: "La Liga", code: "PD", country: "Spain", emblem: "" },
  { id: "SA", name: "Serie A", code: "SA", country: "Italy", emblem: "" },
  { id: "BL1", name: "Bundesliga", code: "BL1", country: "Germany", emblem: "" },
  { id: "FL1", name: "Ligue 1", code: "FL1", country: "France", emblem: "" },
]

export const MARKETS = [
  { id: "1X2", name: "1X2 (Wynik meczu)", description: "Wygrana gospodarzy, remis lub wygrana gości" },
  { id: "BTTS", name: "BTTS", description: "Obie drużyny strzelą gola" },
  { id: "O/U", name: "Over/Under", description: "Liczba goli w meczu" },
  { id: "DC", name: "Double Chance", description: "Podwójna szansa" },
  { id: "HT/FT", name: "HT/FT", description: "Wynik do przerwy / końcowy" },
  { id: "HANDICAP", name: "Handicap", description: "Handicap azjatycki lub europejski" },
]
