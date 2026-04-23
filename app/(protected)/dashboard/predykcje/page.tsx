// app/(protected)/dashboard/predykcje/page.tsx
import { createClient } from "@/lib/supabase/server";
import { HistoryListWrapper } from "@/components/dashboard/history-list-wrapper";
import { TrendingUp } from "lucide-react";
import type { PredictionRow } from "@/lib/types";

export default async function PredykcjePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Moje predykcje</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Historia Twoich analiz. Oznaczaj wyniki, żeby AI mogło śledzić skuteczność.
      </p>
      <HistoryListWrapper initialPredictions={(data ?? []) as PredictionRow[]} />
    </div>
  );
}
