// app/(protected)/dashboard/mecze/page.tsx
import { MatchesList } from "@/components/dashboard/matches-list";
import { Calendar } from "lucide-react";

export default async function MeczePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center gap-3 mb-2">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Mecze</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Kalendarz nadchodzących meczów z top lig Europy.
      </p>
      <MatchesList />
    </div>
  );
}
