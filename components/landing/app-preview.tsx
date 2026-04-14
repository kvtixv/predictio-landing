"use client"

import { FadeIn } from "./fade-in"

const TEAMS = [
  {
    team: "Liverpool",
    form: "WWDWW",
    injuries: "2 zawodnikow",
    color: "text-primary",
  },
  {
    team: "Arsenal",
    form: "WLDWW",
    injuries: "1 zawodnik",
    color: "text-chart-2",
  },
]

function FormBadge({ result }: { result: string }) {
  const colors = {
    W: "bg-primary/15 text-primary",
    D: "bg-warning/15 text-warning",
    L: "bg-destructive/15 text-destructive",
  }
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-extrabold ${colors[result as keyof typeof colors] || ""}`}
    >
      {result}
    </span>
  )
}

export function AppPreview() {
  return (
    <section className="px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card to-secondary/30 p-8">
            {/* Top gradient bar */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary to-chart-2" />

            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Podglad analizy - Premier League - 2026-04-15
            </div>

            <div className="mb-6 text-2xl font-bold">
              Liverpool{" "}
              <span className="mx-2.5 text-muted-foreground/30">vs</span> Arsenal
            </div>

            {/* Team Stats */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              {TEAMS.map((t) => (
                <div
                  key={t.team}
                  className="rounded-xl bg-secondary/50 p-4"
                >
                  <div className={`mb-2 text-sm font-bold ${t.color}`}>
                    {t.team}
                  </div>
                  <div className="mb-2 flex gap-1">
                    {t.form.split("").map((r, j) => (
                      <FormBadge key={j} result={r} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.injuries}
                  </div>
                </div>
              ))}
            </div>

            {/* Prediction Box */}
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div>
                <div className="mb-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                  TYP AI
                </div>
                <div className="text-lg font-bold text-primary">
                  Over 2.5 goli
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                  PEWNOSC
                </div>
                <div className="font-mono text-2xl font-extrabold text-primary">
                  8/10
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Prawdop.", value: "72%" },
                { label: "Value", value: "TAK", valueColor: "text-primary" },
                { label: "Ryzyko", value: "srednie", valueColor: "text-warning" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-secondary/30 p-3 text-center"
                >
                  <div className="mb-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className={`text-sm font-bold ${stat.valueColor || ""}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Liverpool gra u siebie z bardzo dobra forma. Arsenal rowniez w
              wysokiej dyspozycji - spodziewam sie otwartego meczu z wieloma
              bramkami.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
