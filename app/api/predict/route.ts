import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { homeTeam, awayTeam, league, matchDate, market } = body

    if (!homeTeam || !awayTeam || !league || !market) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock prediction if no API key
      return NextResponse.json(getMockPrediction(homeTeam, awayTeam, league, market))
    }

    const systemPrompt = `Jesteś ekspertem od analiz piłkarskich i typowania zakładów. Analizujesz mecze z top 5 lig europejskich (Premier League, La Liga, Serie A, Bundesliga, Ligue 1).

Twoja analiza powinna być profesjonalna, oparta na:
- Formie drużyn (ostatnie 5 meczów)
- Bilansie bezpośrednich spotkań (H2H)
- Statystykach ofensywnych i defensywnych
- Kontuzjach i zawieszeniach kluczowych zawodników
- Przewadze własnego boiska
- Motywacji i pozycji w tabeli

Odpowiadaj TYLKO w formacie JSON bez dodatkowego tekstu.`

    const userPrompt = `Przeanalizuj mecz:
${homeTeam} vs ${awayTeam}
Liga: ${league}
Data: ${matchDate || "Najbliższy weekend"}
Rynek: ${market}

Odpowiedz w formacie JSON:
{
  "prediction": "konkretny typ (np. '1', 'X', '2', 'BTTS - Tak', 'Over 2.5' itp.)",
  "confidence": liczba od 1 do 10,
  "impliedProbability": "procent w formacie XX%",
  "valueRating": "ocena value (Niskie/Średnie/Wysokie/Bardzo wysokie)",
  "risk": "niskie" | "srednie" | "wysokie",
  "analysis": "szczegółowa analiza 2-3 zdania",
  "keyFactors": ["czynnik 1", "czynnik 2", "czynnik 3"],
  "socialCaption": "krótki chwytliwy tekst na social media (max 100 znaków)"
}`

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ],
      system: systemPrompt
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    // Parse the JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response")
    }

    const prediction = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      ...prediction,
      homeTeam,
      awayTeam,
      league,
      market,
      matchDate,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Failed to generate prediction" },
      { status: 500 }
    )
  }
}

function getMockPrediction(homeTeam: string, awayTeam: string, league: string, market: string) {
  const predictions: Record<string, string[]> = {
    "1X2": ["1", "X", "2"],
    "BTTS": ["BTTS - Tak", "BTTS - Nie"],
    "O/U": ["Over 2.5", "Under 2.5", "Over 1.5", "Under 3.5"],
    "DC": ["1X", "12", "X2"],
    "HT/FT": ["1/1", "X/1", "2/2", "X/X"],
    "HANDICAP": [`${homeTeam} -1`, `${awayTeam} +1`, `${homeTeam} -0.5`]
  }

  const marketPredictions = predictions[market] || predictions["1X2"]
  const randomPrediction = marketPredictions[Math.floor(Math.random() * marketPredictions.length)]
  const confidence = Math.floor(Math.random() * 4) + 6 // 6-9
  const probability = Math.floor(Math.random() * 30) + 50 // 50-80%

  return {
    prediction: randomPrediction,
    confidence,
    impliedProbability: `${probability}%`,
    valueRating: confidence >= 8 ? "Wysokie" : confidence >= 7 ? "Średnie" : "Niskie",
    risk: confidence >= 8 ? "niskie" : confidence >= 6 ? "srednie" : "wysokie",
    analysis: `Analiza meczu ${homeTeam} vs ${awayTeam} wskazuje na interesującą okazję. Biorąc pod uwagę formę obu drużyn, statystyki H2H oraz przewagę własnego boiska, rekomendowany jest typ: ${randomPrediction}.`,
    keyFactors: [
      `Forma ${homeTeam}: 3W-1D-1L (ostatnie 5)`,
      `H2H: ${homeTeam} wygrywa 60% spotkań`,
      `${awayTeam} traci średnio 1.5 gola na wyjeździe`
    ],
    socialCaption: `${homeTeam} vs ${awayTeam} - Nasz typ: ${randomPrediction} - Pewność: ${confidence}/10`,
    homeTeam,
    awayTeam,
    league,
    market,
    generatedAt: new Date().toISOString()
  }
}
