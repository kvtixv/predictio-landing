// app/(protected)/dashboard/statystyki/page.tsx
import { createClient } from "@/lib/supabase/server";
import { StatsPanel } from "@/components/dashboard/stats-panel";
import { BarChart3 } from "lucide-react";
import type { PredictionRow } from "@/lib/types";

export default async function StatystykiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Statystyki</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Twoja skuteczność — win rate, ROI, historia wyników.
      </p>
      <StatsPanel predictions={(data ?? []) as PredictionRow[]} />
    </div>
  );
}
