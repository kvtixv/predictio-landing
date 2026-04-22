// components/dashboard/history-list.tsx
"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Copy, Inbox } from "lucide-react";
import { toast } from "sonner";
import type { PredictionRow } from "@/lib/types";

function ResultBadge({ result }: { result: PredictionRow["result"] }) {
  if (!result) return null;
  const styles = {
    win: "bg-green-500 text-black",
    loss: "bg-red-500 text-white",
    void: "bg-yellow-500 text-black",
  };
  const labels = { win: "✓ WYGRANA", loss: "✗ PRZEGRANA", void: "— VOID" };
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${styles[result]}`}>{labels[result]}</span>;
}

export function HistoryList({
  predictions,
  onUpdateResult,
}: {
  predictions: PredictionRow[];
  onUpdateResult: (id: string, result: "win" | "loss" | "void") => void;
}) {
  if (predictions.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Brak analiz. Zacznij od zakładki Analiza.</p>
        </CardContent>
      </Card>
    );
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Skopiowano do schowka");
  };

  return (
    <div className="space-y-3">
      {predictions.map((p) => {
        const confColor =
          p.confidence >= 7 ? "text-green-500" : p.confidence >= 5 ? "text-yellow-500" : "text-red-500";

        return (
          <Card key={p.id} className="relative">
            {p.result && (
              <div className="absolute top-3 right-3">
                <ResultBadge result={p.result} />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                {p.league} · {p.match_date}
              </div>
              <div className="text-xl font-bold tracking-tight">
                {p.home_team} <span className="text-muted-foreground font-normal">vs</span> {p.away_team}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Typ AI</div>
                  <div className="text-base font-bold text-primary">{p.prediction}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Pewność</div>
                  <div className={`text-2xl font-bold font-mono ${confColor}`}>{p.confidence}/10</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {p.implied_probability && (
                  <div className="bg-muted/30 rounded-md px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Prawdop.</div>
                    <div className="text-sm font-bold">{p.implied_probability}</div>
                  </div>
                )}
                {p.value_rating && (
                  <div className="bg-muted/30 rounded-md px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Value</div>
                    <div className={`text-sm font-bold ${p.value_rating === "TAK" ? "text-green-500" : "text-red-500"}`}>
                      {p.value_rating}
                    </div>
                  </div>
                )}
                {p.risk && (
                  <div className="bg-muted/30 rounded-md px-3 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Ryzyko</div>
                    <div className="text-sm font-bold capitalize">{p.risk}</div>
                  </div>
                )}
              </div>

              {p.analysis && <p className="text-sm text-muted-foreground leading-relaxed">{p.analysis}</p>}

              {p.key_factors && p.key_factors.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.key_factors.map((f, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                  ))}
                </div>
              )}

              {(p.social_caption || p.social_caption_long) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.social_caption && (
                    <div className="border border-border rounded-md p-3">
                      <div className="text-[10px] uppercase tracking-wider text-purple-400 font-bold mb-1">📱 Post FREE (IG/TG)</div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{p.social_caption}</p>
                      <Button variant="outline" size="sm" onClick={() => copy(p.social_caption!)}>
                        <Copy className="w-3 h-3 mr-1" /> Kopiuj
                      </Button>
                    </div>
                  )}
                  {p.social_caption_long && (
                    <div className="border border-border rounded-md p-3">
                      <div className="text-[10px] uppercase tracking-wider text-yellow-400 font-bold mb-1">👑 Post VIP</div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{p.social_caption_long}</p>
                      <Button variant="outline" size="sm" onClick={() => copy(p.social_caption_long!)}>
                        <Copy className="w-3 h-3 mr-1" /> Kopiuj
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!p.result && (
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 text-green-500" onClick={() => onUpdateResult(p.id, "win")}>
                    <Check className="w-4 h-4 mr-1" /> Wygrana
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-500" onClick={() => onUpdateResult(p.id, "loss")}>
                    <X className="w-4 h-4 mr-1" /> Przegrana
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-yellow-500" onClick={() => onUpdateResult(p.id, "void")}>
                    <Minus className="w-4 h-4 mr-1" /> Void
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
