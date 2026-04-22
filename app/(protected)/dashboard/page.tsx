// app/(protected)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { PredictionRow } from "@/lib/types";

export default async function DashboardPage() {
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

  const predictions = (data ?? []) as PredictionRow[];

  return <DashboardClient initialPredictions={predictions} userEmail={user!.email ?? ""} />;
}
