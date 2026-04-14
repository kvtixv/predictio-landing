import Link from "next/link"
import { Zap } from "lucide-react"

const FOOTER_LINKS = [
  {
    title: "Produkt",
    links: [
      { label: "Funkcje", href: "#features" },
      { label: "Cennik", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Firma",
    links: [
      { label: "O nas", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Kontakt", href: "/contact" },
    ],
  },
  {
    title: "Prawne",
    links: [
      { label: "Regulamin", href: "/terms" },
      { label: "Prywatnosc", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-4 py-16 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                TipsterAI
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Profesjonalne predykcje meczow pilkarskich napedzane sztuczna
              inteligencja.
            </p>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2024-2026 TipsterAI. Wszystkie prawa zastrzezone.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Typuj odpowiedzialnie. Hazard moze uzalezniac.
          </p>
        </div>
      </div>
    </footer>
  )
}
