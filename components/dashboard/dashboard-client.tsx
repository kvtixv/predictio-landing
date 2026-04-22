// components/dashboard/dashboard-client.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles, History as HistoryIcon, BarChart3 } from "lucide-react";
import { AnalyzeFlow } from "./analyze-flow";
import { HistoryList } from "./history-list";
import { StatsPanel } from "./stats-panel";
import type { PredictionRow } from "@/lib/types";

export function DashboardClient({
  initialPredictions,
  userEmail,
}: {
  initialPredictions: PredictionRow[];
  userEmail: string;
}) {
  const router = useRouter();
  const [predictions, setPredictions] = useState<PredictionRow[]>(initialPredictions);
  const [tab, setTab] = useState("analyze");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const addPrediction = (p: PredictionRow) => {
    setPredictions((prev) => [p, ...prev]);
    setTab("history");
  };

  const updateResult = async (id: string, result: "win" | "loss" | "void") => {
    await fetch("/api/predictions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result }),
    });
    setPredictions((prev) => prev.map((p) => (p.id === id ? { ...p, result } : p)));
  };

  const resolved = predictions.filter((p) => p.result && p.result !== "void");
  const wins = resolved.filter((p) => p.result === "win").length;
  const winRate = resolved.length > 0 ? ((wins / resolved.length) * 100).toFixed(1) : "—";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-lg font-black tracking-tight text-primary">Predictio</span>
            <span className="text-xs text-muted-foreground ml-2">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground hidden sm:block">
              Win rate: <span className="font-semibold text-primary">{winRate}%</span>
            </div>
            <span className="text-xs text-muted-foreground hidden md:block">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Wyloguj
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="analyze">
              <Sparkles className="w-4 h-4 mr-2" /> Analiza
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon className="w-4 h-4 mr-2" /> Historia ({predictions.length})
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" /> Statystyki
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            <AnalyzeFlow onSaved={addPrediction} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryList predictions={predictions} onUpdateResult={updateResult} />
          </TabsContent>

          <TabsContent value="stats">
            <StatsPanel predictions={predictions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
