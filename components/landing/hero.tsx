"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./fade-in"
import { LandingBadge } from "./badge"
import { StatCounter } from "./stat-counter"

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32 text-center md:px-6">
      {/* Background Effects */}
      <div className="pointer-events-none absolute left-1/2 top-[10%] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.85_0.25_155/0.08)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,oklch(0.70_0.18_300/0.06)_0%,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <FadeIn>
          <LandingBadge glow>Nowa era typowania meczow</LandingBadge>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-balance">Typy bukmacherskie</span>
            <br />
            <span className="text-gradient-primary">napedzane AI</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            Sztuczna inteligencja analizuje dane meczowe, H2H, kontuzje i sklady
            w czasie rzeczywistym. Ty dostajesz gotowe typy z analiza value i
            ocena ryzyka.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="glow-primary bg-gradient-to-r from-primary to-primary/80 px-8 text-base font-bold text-primary-foreground hover:from-primary/90 hover:to-primary/70"
              >
                Zacznij typowac
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 bg-secondary/50 px-8 text-base font-semibold hover:bg-secondary"
              onClick={() => scrollTo("how-it-works")}
            >
              Jak to dziala?
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-16 flex flex-wrap justify-center gap-12 md:gap-16">
            <StatCounter value={87} suffix="%" label="Skutecznosc AI" />
            <StatCounter value={1200} suffix="+" label="Analiz miesiecznie" />
            <StatCounter value={340} suffix="+" label="Zadowolonych klientow" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
