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
    question: "Jak dziala sztuczna inteligencja w Tipster AI?",
    answer:
      "Nasz model AI analizuje dane historyczne meczow, aktualna forme druzyn, kontuzje, przewidywane sklady oraz kursy bukmacherow. Na podstawie tych danych generuje predykcje z ocena pewnosci i analize ryzyka.",
  },
  {
    question: "Czy mogę korzystać z Tipster AI na telefonie?",
    answer:
      "Tak! Aplikacja jest w pelni responsywna i dziala rownie dobrze na telefonach, tabletach i komputerach. Mozesz analizowac mecze gdziekolwiek jestes.",
  },
  {
    question: "Jakie ligi sa dostepne?",
    answer:
      "W wersji darmowej masz dostep do Top 5 lig Europy: Premier League, La Liga, Serie A, Bundesliga i Ligue 1. Plan Pro odblokowuje wszystkie ligi swiata, w tym Ekstraklase, Championship, MLS i wiele innych.",
  },
  {
    question: "Czy moge anulować subskrypcje w dowolnym momencie?",
    answer:
      "Tak, mozesz anulowac subskrypcje w kazdej chwili. Twoje konto zostanie automatycznie przelaczone na plan darmowy po zakonczeniu okresu rozliczeniowego.",
  },
  {
    question: "Jak dokładne są predykcje AI?",
    answer:
      "Nasz model osiaga srednia skutecznosc na poziomie 67-72% dla typow 1X2. Pamietaj jednak, ze zadne narzedzie nie gwarantuje 100% skutecznosci - zawsze typuj odpowiedzialnie.",
  },
  {
    question: "Czy oferujecie zwrot pieniedzy?",
    answer:
      "Tak, oferujemy 14-dniowa gwarancje zwrotu pieniedzy. Jesli nie bedziesz zadowolony z uslugi, skontaktuj sie z nami i zwrocimy pelna kwote.",
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
              Czeste pytania
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
