// app/(protected)/dashboard/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Sparkles, Radio, TrendingUp, Zap } from "lucide-react";

// Polskie dni tygodnia
const DAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
const MONTHS = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];
  const nickname = user!.email?.split("@")[0] ?? "Tipster";

  // Pobierz dzisiejsze predykcje
  const { data: predictions } = await supabase
    .from("daily_predictions")
    .select("*")
    .eq("match_date", today)
    .order("confidence", { ascending: false });

  // Pobierz live
  const { data: liveMatches } = await supabase
    .from("matches_cache")
    .select("*")
    .eq("status", "live")
    .limit(4);

  // Top prediction (featured)
  const topPick = predictions?.find((p) => p.is_featured) ?? predictions?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Hero greeting */}
      <section className="mb-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
              Cześć, <span className="text-primary">{nickname}</span>! <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base capitalize">
              {formatDate(new Date())}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">System AI aktywny</span>
          </div>
        </div>

        {/* Motto */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <div>
              <div className="font-bold">Mądre obstawianie</div>
              <div className="text-muted-foreground text-xs">Dane, nie emocje</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top featured pick */}
      {topPick ? (
        <FeaturedPick pick={topPick} />
      ) : (
        <EmptyFeatured />
      )}

      {/* Quick stats grid */}
      <section className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickCard
          icon={Sparkles}
          label="Typy na dziś"
          value={predictions?.length ?? 0}
          href="/dashboard/predykcje-ai"
          color="text-primary"
        />
        <QuickCard
          icon={Radio}
          label="Mecze LIVE"
          value={liveMatches?.length ?? 0}
          href="/dashboard/live"
          color="text-red-500"
          pulse
        />
        <QuickCard
          icon={TrendingUp}
          label="Wysokie pewności"
          value={predictions?.filter((p) => p.confidence >= 7).length ?? 0}
          href="/dashboard/predykcje-ai"
          color="text-yellow-500"
        />
        <QuickCard
          icon={Zap}
          label="Nowa analiza"
          value="+"
          href="/dashboard/analiza"
          color="text-purple-400"
        />
      </section>

      {/* All today's predictions */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Hity Dnia</h2>
            <p className="text-xs text-muted-foreground">Najlepsze typy AI na dziś</p>
          </div>
          <Link
            href="/dashboard/predykcje-ai"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            Zobacz wszystkie <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {predictions && predictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {predictions.slice(0, 6).map((p) => (
              <PredictionMini key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-xl">
            <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Dzisiejsze typy pojawią się rano. AI generuje je codziennie o 7:00.
            </p>
          </div>
        )}
      </section>

      {/* Live matches strip */}
      {liveMatches && liveMatches.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-bold">Teraz na żywo</h2>
              <span className="text-xs text-muted-foreground">({liveMatches.length})</span>
            </div>
            <Link href="/dashboard/live" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              Zobacz wszystkie <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveMatches.slice(0, 4).map((m) => (
              <LiveMatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @keyframes wave { 0%,60%,100% { transform: rotate(0); } 10%,30% { transform: rotate(14deg); } 20% { transform: rotate(-8deg); } 40% { transform: rotate(-4deg); } 50% { transform: rotate(10deg); } }
        .animate-wave { display: inline-block; animation: wave 2.5s ease-in-out infinite; transform-origin: 70% 70%; }
      `}</style>
    </div>
  );
}

function FeaturedPick({ pick }: { pick: any }) {
  const kickoff = new Date(pick.kickoff_time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/60 to-purple-500/5 p-6 lg:p-8">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative flex items-start justify-between gap-6 flex-wrap lg:flex-nowrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              <Sparkles className="w-3 h-3" /> Typ dnia
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {pick.league}
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            {pick.home_team}
            <span className="text-muted-foreground font-normal mx-3">vs</span>
            {pick.away_team}
          </h2>
          <div className="text-sm text-muted-foreground mt-1 font-mono">Początek: {kickoff}</div>

          <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-2xl">{pick.analysis}</p>

          {pick.key_factors && pick.key_factors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {pick.key_factors.slice(0, 4).map((f: string, i: number) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-muted/40 border border-border/40 text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pick box */}
        <div className="w-full lg:w-auto lg:min-w-[220px] shrink-0 bg-background/60 backdrop-blur rounded-xl border border-primary/30 p-5">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rekomendacja AI</div>
          <div className="text-2xl font-black text-primary leading-tight">{pick.prediction}</div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pewność</div>
              <div className="text-3xl font-black font-mono text-primary">
                {pick.confidence}<span className="text-sm text-muted-foreground">/10</span>
              </div>
            </div>
            {pick.odds && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Kurs</div>
                <div className="text-2xl font-black font-mono">{pick.odds}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyFeatured() {
  return (
    <section className="rounded-2xl border border-dashed border-border/40 bg-card/40 p-12 text-center">
      <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
      <h2 className="text-lg font-bold">Dzisiaj jeszcze nie mamy typu dnia</h2>
      <p className="text-sm text-muted-foreground mt-2">
        AI generuje typy codziennie o 7:00. Zajrzyj później albo wygeneruj własną analizę.
      </p>
      <Link
        href="/dashboard/analiza"
        className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition"
      >
        <Zap className="w-4 h-4" /> Wygeneruj analizę
      </Link>
    </section>
  );
}

function QuickCard({
  icon: Icon,
  label,
  value,
  href,
  color,
  pulse,
}: {
  icon: any;
  label: string;
  value: number | string;
  href: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border/40 bg-card/40 p-4 hover:border-primary/30 hover:bg-card/60 transition relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <Icon className={`w-5 h-5 ${color} ${pulse ? "animate-pulse" : ""}`} />
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition" />
      </div>
      <div className={`text-3xl font-black mt-3 font-mono ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </Link>
  );
}

function PredictionMini({ p }: { p: any }) {
  const kickoff = new Date(p.kickoff_time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  const confColor = p.confidence >= 8 ? "text-primary" : p.confidence >= 6 ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="rounded-xl border border-border/40 bg-card/40 p-4 hover:border-primary/30 transition">
      <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-mono mb-2">
        <span>{p.league}</span>
        <span>{kickoff}</span>
      </div>
      <div className="text-sm font-bold leading-tight mb-3">
        {p.home_team} <span className="text-muted-foreground font-normal">vs</span> {p.away_team}
      </div>
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40">
        <div className="min-w-0">
          <div className="text-[9px] uppercase text-muted-foreground tracking-wider">Typ</div>
          <div className="text-sm font-bold text-primary truncate">{p.prediction}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[9px] uppercase text-muted-foreground tracking-wider">Pewność</div>
          <div className={`text-lg font-black font-mono ${confColor}`}>{p.confidence}/10</div>
        </div>
      </div>
    </div>
  );
}

function LiveMatchCard({ match }: { match: any }) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider font-mono">LIVE {match.minute}'</span>
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{match.league}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold truncate">{match.home_team}</div>
        <div className="text-xl font-black font-mono text-red-500 mx-3 shrink-0">
          {match.score_home}–{match.score_away}
        </div>
        <div className="text-sm font-bold truncate text-right">{match.away_team}</div>
      </div>
    </div>
  );
}
