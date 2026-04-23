// app/(protected)/dashboard/analiza/page.tsx
import { AnalyzePageClient } from "@/components/dashboard/analyze-page-client";
import { PenLine } from "lucide-react";

export default function AnalizaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-2">
        <PenLine className="w-6 h-6 text-primary" />
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Nowa analiza</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Wpisz mecz, a AI automatycznie wyszuka dane i wygeneruje szczegółową analizę z typem.
      </p>
      <AnalyzePageClient />
    </div>
  );
}
