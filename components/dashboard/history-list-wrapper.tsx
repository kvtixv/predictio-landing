// components/dashboard/history-list-wrapper.tsx
"use client";

import { useState } from "react";
import { HistoryList } from "./history-list";
import type { PredictionRow } from "@/lib/types";

export function HistoryListWrapper({ initialPredictions }: { initialPredictions: PredictionRow[] }) {
  const [predictions, setPredictions] = useState(initialPredictions);

  const updateResult = async (id: string, result: "win" | "loss" | "void") => {
    await fetch("/api/predictions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result }),
    });
    setPredictions((prev) => prev.map((p) => (p.id === id ? { ...p, result } : p)));
  };

  return <HistoryList predictions={predictions} onUpdateResult={updateResult} />;
}
