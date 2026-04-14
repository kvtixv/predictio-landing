"use client"

import { BarChart3, Target, Zap, Share2, TrendingUp, Lock } from "lucide-react"
import { FadeIn } from "./fade-in"
import { LandingBadge } from "./badge"

const FEATURES = [
  {
    icon: BarChart3,
    title: "Auto-research danych",
    description:
      "AI przeszukuje internet i zbiera H2H, forme, kontuzje, sklady i kursy automatycznie.",
  },
  {
    icon: Target,
    title: "Value bet detector",
    description:
      "Porownuje prawdopodobienstwo modelu z kursami bukmachera i wskazuje zaklady z przewaga.",
  },
  {
    icon: Zap,
    title: "Analiza w 30 sekund",
    description:
      "Pelna analiza meczu z danymi, typem i ocena ryzyka gotowa w pol minuty.",
  },
  {
    icon: Share2,
    title: "Gotowe posty na social media",
    description:
      "Generuje gotowe teksty do wklejenia na Instagram i Telegram - free i VIP.",
  },
  {
    icon: TrendingUp,
    title: "Sledzenie wynikow",
    description:
      "Automatycznie liczy win rate, ROI i prowadzi historie wszystkich typow.",
  },
  {
    icon: Lock,
    title: "Tylko dla Ciebie",
    description:
      "Prywatne narzedzie - nikt inny nie widzi Twoich analiz ani strategii.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-secondary/30 px-4 py-24 md:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <LandingBadge>Funkcje</LandingBadge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Wszystko, czego potrzebujesz
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.08}>
              <div className="group rounded-2xl border border-border/50 bg-card/50 p-7 transition-all hover:border-primary/20 hover:bg-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
