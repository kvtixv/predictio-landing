// components/dashboard/matches-list.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Match {
  id: string;
  fixture_id: number;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  league: string;
  league_logo: string | null;
  kickoff_time: string;
  status: "upcoming" | "live" | "finished";
  score_home: number | null;
  score_away: number | null;
  minute: number | null;
}

function formatDateLabel(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Dziś";
  if (diff === 1) return "Jutro";
  if (diff === -1) return "Wczoraj";
  return d.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });
}

export function MatchesList() {
  const [date, setDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dateStr = date.toISOString().split("T")[0];
    fetch(`/api/matches?date=${dateStr}`)
      .then((r) => r.json())
      .then((d) => setMatches(d.matches || []))
      .finally(() => setLoading(false));
  }, [date]);

  const changeDate = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  };

  // Grupuj po lidze
  const byLeague = matches.reduce<Record<string, Match[]>>((acc, m) => {
    if (!acc[m.league]) acc[m.league] = [];
    acc[m.league].push(m);
    return acc;
  }, {});

  return (
    <div>
      {/* Date switcher */}
      <div className="flex items-center justify-between mb-6 bg-card/40 border border-border/40 rounded-xl px-4 py-3">
        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-accent/40 rounded-lg transition">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold capitalize">{formatDateLabel(date)}</div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {date.toLocaleDateString("pl-PL")}
          </div>
        </div>
        <button onClick={() => changeDate(1)} className="p-2 hover:bg-accent/40 rounded-lg transition">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-xl">
          <p className="text-sm text-muted-foreground">Brak meczów w tym dniu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byLeague).map(([league, leagueMatches]) => (
            <div key={league}>
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-2 px-1">
                {league}
              </h3>
              <div className="space-y-1.5">
                {leagueMatches.map((m) => <MatchRow key={m.id} m={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRow({ m }: { m: Match }) {
  const time = new Date(m.kickoff_time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const isLive = m.status === "live";
  const isFinished = m.status === "finished";

  return (
    <div className={`rounded-lg border px-4 py-3 flex items-center gap-3 transition hover:border-primary/20
      ${isLive ? "border-red-500/20 bg-red-500/5" : "border-border/40 bg-card/30"}`}>
      {/* Time / Status */}
      <div className="w-12 shrink-0 text-center">
        {isLive ? (
          <div>
            <div className="text-[10px] font-bold text-red-500 animate-pulse">LIVE</div>
            {m.minute && <div className="text-xs font-mono text-red-500">{m.minute}'</div>}
          </div>
        ) : isFinished ? (
          <div className="text-[10px] font-bold text-muted-foreground">FT</div>
        ) : (
          <div className="text-sm font-mono font-bold">{time}</div>
        )}
      </div>

      {/* Teams */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {m.home_logo && <img src={m.home_logo} alt="" className="w-4 h-4 shrink-0" />}
          <span className="text-sm font-medium truncate">{m.home_team}</span>
        </div>

        {(isLive || isFinished) && (m.score_home !== null || m.score_away !== null) ? (
          <div className={`text-sm font-black font-mono shrink-0 px-2 ${isLive ? "text-red-500" : ""}`}>
            {m.score_home ?? 0}–{m.score_away ?? 0}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground shrink-0">vs</div>
        )}

        <div className="flex-1 min-w-0 flex items-center gap-2 justify-end">
          <span className="text-sm font-medium truncate text-right">{m.away_team}</span>
          {m.away_logo && <img src={m.away_logo} alt="" className="w-4 h-4 shrink-0" />}
        </div>
      </div>
    </div>
  );
}
