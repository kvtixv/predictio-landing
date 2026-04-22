"use client"

import { FadeIn } from "./fade-in"
import { LandingBadge } from "./badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    question: "Jak działa sztuczna inteligencja w Predictio",
    answer:
      "Nasz model AI analizuj dane historyczne meczów, aktualną formę drużyn, kontuzje, przewidywane sklady oraz kursy bukmacherów. Na podstawie tych danych generuję predykcje z oceną pewności i analizę ryzyka.",
  },
  {
    question: "Czy mogę korzystać z Predictio na telefonie?",
    answer:
      "Tak! Aplikacja jest w pełni responsywna i działa równie dobrze na telefonach, tabletach i komputerach. Możesz analizować mecze gdziekolwiek jesteś.",
  },
  {
    question: "Jakie ligi sa dostępne?",
    answer:
      "W wersji darmowej masz dostęp do Top 5 lig Europy: Premier League, La Liga, Serie A, Bundesliga i Ligue 1. Plan Pro odblokowuje wszystkie ligi świata, w tym Ekstraklasę, Championship, MLS i wiele innych.",
  },
  {
    question: "Czy mogę anulować subskrypcję w dowolnym momencie?",
    answer:
      "Tak, mozesz anulować subskrypcję w kazdej chwili. Twoje konto zostanie automatycznie przełączone na plan darmowy po zakończeniu okresu rozliczeniowego.",
  },
  {
    question: "Jak dokładne są predykcje AI?",
    answer:
      "Nasz model osiąga średnią skuteczność na poziomie 74%-82% dla typow 1X2. Pamiętaj jednak, że żadne narzędzie nie gwarantuję 100% skutecznosci - zawsze typuj odpowiedzialnie.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="bg-secondary/30 px-4 py-24 md:px-6">
      <div className="mx-auto max-w-3xl">
        <FadeIn>
          <div className="mb-16 text-center">
            <LandingBadge>FAQ</LandingBadge>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Częste pytania
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border/50 bg-card/50 px-6 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="py-5 text-left font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}
