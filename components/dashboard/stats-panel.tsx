// components/dashboard/stats-panel.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import type { PredictionRow } from "@/lib/types";

export function StatsPanel({ predictions }: { predictions: PredictionRow[] }) {
  const resolved = predictions.filter((p) => p.result && p.result !== "void");
  const wins = resolved.filter((p) => p.result === "win").length;
  const losses = resolved.filter((p) => p.result === "loss").length;
  const total = resolved.length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "—";
  // Prosta estymacja ROI przy średnim kursie 1.85
  const roi = total > 0 ? (((wins * 1.85 - total) / total) * 100).toFixed(1) : "—";

  const stats = [
    { label: "Wszystkie typy", value: predictions.length, color: "text-foreground" },
    { label: "Rozstrzygnięte", value: total, color: "text-purple-400" },
    { label: "Wygrane", value: wins, color: "text-green-500" },
    { label: "Przegrane", value: losses, color: "text-red-500" },
    { label: "Win rate", value: total > 0 ? `${winRate}%` : "—", color: "text-yellow-500" },
    {
      label: "ROI (est.)",
      value: total > 0 ? `${roi}%` : "—",
      color: parseFloat(roi) > 0 ? "text-green-500" : "text-red-500",
    },
  ];

  if (predictions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Dodaj analizy, żeby zobaczyć statystyki.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</div>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider">Ostatnie wyniki</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1.5 flex-wrap">
            {predictions.slice(0, 30).map((p) => (
              <div
                key={p.id}
                title={`${p.home_team} vs ${p.away_team} - ${p.prediction}`}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold border
                  ${p.result === "win" ? "bg-green-500/15 text-green-500 border-green-500/30" : ""}
                  ${p.result === "loss" ? "bg-red-500/15 text-red-500 border-red-500/30" : ""}
                  ${p.result === "void" ? "bg-yellow-500/15 text-yellow-500 border-yellow-500/30" : ""}
                  ${!p.result ? "bg-muted/30 text-muted-foreground border-border" : ""}
                `}
              >
                {p.result === "win" ? "W" : p.result === "loss" ? "L" : p.result === "void" ? "V" : "?"}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
