"use client"

import { Search, Brain, Coins } from "lucide-react"
import { FadeIn } from "./fade-in"
import { LandingBadge } from "./badge"

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Wybierz mecz",
    description:
      "Wybierasz ligę oraz drużyny. AI automatycznie przeszukuje internet - zbiera H2H, formę, kontuzje, przewidywane składy i aktualne kursy bukmacherskie.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI analizuje",
    description:
      "Sztuczna inteligencja przetwarza zebrane dane, porównuje z kursami bukmacherów i szuka value betow - zakladów, gdzie kurs jest wyższy niz realne prawdopodobieństwo.",
  },
  {
    step: "03",
    icon: Coins,
    title: "Dostajesz typ",
    description:
      "Otrzymujesz konkretną predykcję z oceną pewności, analizą ryzyka oraz prawdopodobieństwem. Śledzisz wyniki i budujesz historię.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-24 md:px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <LandingBadge>Jak to działa</LandingBadge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Trzy kroki do lepszych typów
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((item, i) => (
            <FadeIn key={item.step} delay={i * 0.15}>
              <div className="group relative h-full rounded-2xl border border-border/50 bg-card/50 p-8 transition-colors hover:border-primary/20 hover:bg-card">
                <div className="absolute right-6 top-5 font-mono text-6xl font-extrabold text-muted/10">
                  {item.step}
                </div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
