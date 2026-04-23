// components/dashboard/analyze-page-client.tsx
"use client";

import { useRouter } from "next/navigation";
import { AnalyzeFlow } from "./analyze-flow";

export function AnalyzePageClient() {
  const router = useRouter();

  const handleSaved = () => {
    router.push("/dashboard/predykcje");
    router.refresh();
  };

  return <AnalyzeFlow onSaved={handleSaved} />;
}
