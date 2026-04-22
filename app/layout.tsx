import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, Syne } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-syne',
  weight: ['700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tipster AI - Predykcje meczow pilkarskich napedzane AI',
  description: 'Sztuczna inteligencja analizuje dane meczowe, H2H, kontuzje i sklady w czasie rzeczywistym. Otrzymuj gotowe typy z analiza value i ocena ryzyka dla Top 5 lig Europy.',
  keywords: ['tipster', 'AI', 'predykcje', 'pilka nozna', 'bukmacher', 'typy', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'],
  authors: [{ name: 'Tipster AI' }],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Tipster AI - Predykcje meczow pilkarskich',
    description: 'AI analizuje mecze i dostarcza profesjonalne typy bukmacherskie',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#060a12',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
 return (
  <html lang="pl">
    <head />
    <body
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${syne.variable} bg-background`}
    >
      {children}
      {process.env.NODE_ENV === "production" && <Analytics />}
    </body>
  </html>
)
