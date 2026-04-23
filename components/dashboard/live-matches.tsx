// components/dashboard/live-matches.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  league: string;
  score_home: number | null;
  score_away: number | null;
  minute: number | null;
}

export function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = () => {
      const today = new Date().toISOString().split("T")[0];
      fetch(`/api/matches?date=${today}&status=live`)
        .then((r) => r.json())
        .then((d) => setMatches(d.matches || []))
        .finally(() => setLoading(false));
    };
    fetchLive();
    const iv = setInterval(fetchLive, 60000);
    return () => clearInterval(iv);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border/40 rounded-xl">
        <div className="w-3 h-3 rounded-full bg-muted mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Żaden mecz nie jest obecnie na żywo</h2>
        <p className="text-sm text-muted-foreground">Sprawdź w zakładce Mecze nadchodzące spotkania.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {matches.map((m) => (
        <div key={m.id} className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/60 via-red-500 to-red-500/60 animate-pulse" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.15em] font-mono">
                LIVE {m.minute}'
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.league}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {m.home_logo && <img src={m.home_logo} alt="" className="w-6 h-6 shrink-0" />}
              <span className="text-base font-bold truncate">{m.home_team}</span>
            </div>
            <div className="text-3xl font-black font-mono text-red-500 shrink-0">
              {m.score_home ?? 0}<span className="text-muted-foreground/40 mx-1">–</span>{m.score_away ?? 0}
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-2 justify-end">
              <span className="text-base font-bold truncate text-right">{m.away_team}</span>
              {m.away_logo && <img src={m.away_logo} alt="" className="w-6 h-6 shrink-0" />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
