"use client"

import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./fade-in"
import { LandingBadge } from "./badge"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    tier: "Starter",
    price: "0 zl",
    period: "miesiąc",
    features: [
      "5 analiz dziennie",
      "Top 5 lig Europy",
      "Podstawowe statystyki",
      "Historia typow",
    ],
    cta: "Zacznij za darmo",
    highlighted: false,
  },
  {
    tier: "Pro",
    price: "49 zl",
    period: "miesiąc",
    features: [
      "Nieograniczone analizy",
      "Wszystkie ligi swiata",
      "Value bet detector",
      "Gotowe posty na social media",
      "Zaawansowane statystyki",
      "Priorytetowe wsparcie",
    ],
    cta: "Wybierz Pro",
    highlighted: true,
  },
  {
    tier: "Team",
    price: "149 zl",
    period: "miesiąc",
    features: [
      "Wszystko z Pro",
      "Do 5 uzytkownikow",
      "Panel zespolu",
      "Eksport danych CSV",
      "API dostep",
      "Dedykowany opiekun",
    ],
    cta: "Skontaktuj sie",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24 md:px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <LandingBadge>Cennik</LandingBadge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Wybierz plan dla siebie
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Zacznij za darmo i przeskaluj w miare potrzeb. Anuluj w dowolnym
              momencie.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.tier} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-8 transition-all",
                  plan.highlighted
                    ? "border-primary/30 bg-gradient-to-b from-primary/10 to-transparent shadow-[0_0_40px_oklch(0.85_0.25_155/0.1)]"
                    : "border-border/50 bg-card/50 hover:border-border"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-primary/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    Najpopularniejszy
                  </div>
                )}

                <div
                  className={cn(
                    "mb-3 text-sm font-bold uppercase tracking-wider",
                    plan.highlighted ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {plan.tier}
                </div>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>

                <div className="my-6 h-px bg-border/50" />

                <div className="mb-8 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href="/login">
                  <Button
                    className={cn(
                      "w-full",
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
