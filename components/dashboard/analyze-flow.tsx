// components/dashboard/analyze-flow.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, Sparkles, ArrowLeft } from "lucide-react";
import { LEAGUES, MARKETS, type League, type Market, type ResearchData, type PredictionAnalysis, type PredictionRow } from "@/lib/types";
import { MatchReview } from "./match-review";

type Phase = "input" | "review" | "done";

const LOADING_MSGS = [
  "Przeszukuję dane meczowe...",
  "Sprawdzam H2H i formę drużyn...",
  "Szukam kontuzji i składów...",
  "Pobieram kursy bukmacherskie...",
];

export function AnalyzeFlow({ onSaved }: { onSaved: (p: PredictionRow) => void }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    homeTeam: "",
    awayTeam: "",
    league: "Premier League" as League,
    matchDate: new Date().toISOString().split("T")[0],
    market: "Wynik meczu (1X2)" as Market,
    notes: "",
  });

  const [research, setResearch] = useState<ResearchData | null>(null);
  const [researchRaw, setResearchRaw] = useState("");

  const fetchResearch = async () => {
    if (!form.homeTeam || !form.awayTeam) {
      setError("Podaj nazwy obu drużyn.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingMsg(LOADING_MSGS[0]);
    const iv = setInterval(() => {
      setLoadingMsg((p) => {
        const i = LOADING_MSGS.indexOf(p);
        return LOADING_MSGS[Math.min(i + 1, LOADING_MSGS.length - 1)];
      });
    }, 3000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "research", ...form }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setResearch(json.data as ResearchData);
      setResearchRaw(json.raw);
      setPhase("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd pobierania danych");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setLoading(true);
    setLoadingMsg("Generuję analizę i typ...");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "predict",
          ...form,
          research: researchRaw,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      const analysis = json.data as PredictionAnalysis;

      // Zapisz do bazy
      const saveRes = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...analysis,
          researchData: research,
        }),
      });
      const saved = await saveRes.json();
      if (saved.error) throw new Error(saved.error);

      onSaved(saved.prediction as PredictionRow);

      // Reset
      setPhase("input");
      setResearch(null);
      setResearchRaw("");
      setForm((f) => ({ ...f, homeTeam: "", awayTeam: "", notes: "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Błąd analizy");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "review" && research) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{form.homeTeam} vs {form.awayTeam}</h2>
            <p className="text-sm text-muted-foreground">{form.league} · {form.matchDate}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPhase("input")} disabled={loading}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Wróć
          </Button>
        </div>

        <MatchReview research={research} home={form.homeTeam} away={form.awayTeam} />

        <div className="space-y-2">
          <Label htmlFor="notes">Twoje uwagi (opcjonalne)</Label>
          <Textarea
            id="notes"
            rows={2}
            placeholder="Dodatkowe informacje od Ciebie..."
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          />
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <Button className="w-full" size="lg" onClick={runPrediction} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingMsg}</> : <><Sparkles className="w-4 h-4 mr-2" /> Generuj analizę i typ</>}
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nowa analiza</CardTitle>
        <CardDescription>
          Wpisz drużyny — AI automatycznie wyszuka H2H, formę, kontuzje, składy i kursy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="home">Gospodarz</Label>
            <Input id="home" placeholder="np. Liverpool" value={form.homeTeam} onChange={(e) => setForm((p) => ({ ...p, homeTeam: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="away">Gość</Label>
            <Input id="away" placeholder="np. Arsenal" value={form.awayTeam} onChange={(e) => setForm((p) => ({ ...p, awayTeam: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Liga</Label>
            <Select value={form.league} onValueChange={(v) => setForm((p) => ({ ...p, league: v as League }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEAGUES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" value={form.matchDate} onChange={(e) => setForm((p) => ({ ...p, matchDate: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Rynek</Label>
            <Select value={form.market} onValueChange={(v) => setForm((p) => ({ ...p, market: v as Market }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MARKETS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <Button className="w-full" size="lg" onClick={fetchResearch} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {loadingMsg}</> : <><Search className="w-4 h-4 mr-2" /> Zbierz dane o meczu</>}
        </Button>
      </CardContent>
    </Card>
  );
}
