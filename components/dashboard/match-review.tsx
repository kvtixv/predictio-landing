// components/dashboard/match-review.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResearchData, TeamResearch } from "@/lib/types";

function TeamBox({ label, team }: { label: string; team?: TeamResearch }) {
  if (!team) return null;
  const form = team.recentForm?.replace(/[^WDLWDL]/gi, "").split("").slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {form.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Forma</div>
            <div className="flex gap-1">
              {form.map((r, i) => (
                <span
                  key={i}
                  className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold font-mono
                    ${r === "W" ? "bg-green-500/15 text-green-500 border border-green-500/30" : ""}
                    ${r === "D" ? "bg-yellow-500/15 text-yellow-500 border border-yellow-500/30" : ""}
                    ${r === "L" ? "bg-red-500/15 text-red-500 border border-red-500/30" : ""}
                  `}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
        {team.injuries && team.injuries.length > 0 && team.injuries[0] !== "brak danych" && (
          <div>
            <div className="text-xs text-red-400 uppercase tracking-wider mb-1">🚑 Kontuzje</div>
            <ul className="space-y-0.5">
              {team.injuries.slice(0, 4).map((inj, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {inj}</li>
              ))}
            </ul>
          </div>
        )}
        {team.suspensions && team.suspensions.length > 0 && team.suspensions[0] !== "brak danych" && (
          <div>
            <div className="text-xs text-yellow-400 uppercase tracking-wider mb-1">🟨 Zawieszeni</div>
            <ul className="space-y-0.5">
              {team.suspensions.slice(0, 3).map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {team.keyStats && team.keyStats !== "brak danych" && (
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Statystyki</div>
            <div className="text-xs text-muted-foreground">{team.keyStats}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function MatchReview({ research, home, away }: { research: ResearchData; home: string; away: string }) {
  const odds = research.odds;
  const oddsItems = odds
    ? [
        { l: "1", v: odds.home },
        { l: "X", v: odds.draw },
        { l: "2", v: odds.away },
        { l: "O2.5", v: odds.overUnder },
        { l: "BTTS", v: odds.btts },
      ].filter((o) => o.v && o.v !== "brak danych")
    : [];

  return (
    <div className="space-y-4">
      {research.dataQuality && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Jakość danych:</span>
          <Badge variant={research.dataQuality === "wysoka" ? "default" : "secondary"}>
            {research.dataQuality}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TeamBox label={home} team={research.homeTeam} />
        <TeamBox label={away} team={research.awayTeam} />
      </div>

      {research.h2h?.summary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-yellow-400">⚔️ Head to Head</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground mb-2">{research.h2h.summary}</p>
            {research.h2h.lastMatches?.slice(0, 3).map((m, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                {m.date} — <span className="text-foreground font-medium">{m.score}</span>{" "}
                <span className="opacity-60">({m.competition})</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {oddsItems.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">💰 Kursy bukmacherskie</div>
          <div className="flex gap-2 flex-wrap">
            {oddsItems.map((o, i) => (
              <div key={i} className="bg-muted/50 border border-border rounded-md px-3 py-2 text-center min-w-[60px]">
                <div className="text-[10px] text-muted-foreground font-mono">{o.l}</div>
                <div className="text-sm font-bold font-mono">{o.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {research.context && research.context !== "brak danych" && (
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            📋 {research.context}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
