// app/(protected)/dashboard/live/page.tsx
import { LiveMatches } from "@/components/dashboard/live-matches";
import { Radio } from "lucide-react";

export default function LivePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <Radio className="w-6 h-6 text-red-500" />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Na żywo</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Mecze aktualnie rozgrywane z top lig Europy. Aktualizacja co minutę.
      </p>
      <LiveMatches />
    </div>
  );
}
