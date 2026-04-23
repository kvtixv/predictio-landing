// app/api/cron/daily-predictions/route.ts
//
// CRON JOB: codziennie rano o 7:00 generuje 5 darmowych typów AI
// Uruchamiany przez Vercel Cron (vercel.json) lub ręcznie
// Zabezpieczony header'em CRON_SECRET
//
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchFixturesByDate, cacheFixtures, type ApiFixture } from "@/lib/api-football";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const maxDuration = 300; // 5 min limit dla cron

export async function GET(req: Request) {
  // Autoryzacja: Vercel Cron wysyła header "Authorization: Bearer $CRON_SECRET"
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    // 1. Pobierz mecze z top lig na dziś
    const fixtures = await fetchFixturesByDate(today);

    if (fixtures.length === 0) {
      return NextResponse.json({ ok: true, message: "Brak meczów na dziś" });
    }

    // Cache do bazy
    await cacheFixtures(fixtures);

    // 2. Wybierz 5 najciekawszych (upcoming, prestiżowe ligi)
    const prioritized = fixtures
      .filter((f) => f.fixture.status.short === "NS")
      .sort((a, b) => leaguePriority(b.league.name) - leaguePriority(a.league.name))
      .slice(0, 5);

    if (prioritized.length === 0) {
      return NextResponse.json({ ok: true, message: "Brak nadchodzących meczów" });
    }

    // 3. Generuj typ AI dla każdego
    const supabase = await createServiceClient();
    const results = [];

    for (const fixture of prioritized) {
      try {
        const analysis = await generatePrediction(fixture);
        if (!analysis) continue;

        const { data, error } = await supabase
          .from("daily_predictions")
          .upsert(
            {
              fixture_id: fixture.fixture.id,
              home_team: fixture.teams.home.name,
              away_team: fixture.teams.away.name,
              home_logo: fixture.teams.home.logo,
              away_logo: fixture.teams.away.logo,
              league: fixture.league.name,
              league_logo: fixture.league.logo,
              match_date: fixture.fixture.date.split("T")[0],
              kickoff_time: fixture.fixture.date,
              prediction: analysis.prediction,
              confidence: analysis.confidence,
              implied_probability: analysis.impliedProbability,
              value_rating: analysis.valueRating,
              analysis: analysis.analysis,
              key_factors: analysis.keyFactors,
              risk: analysis.risk,
              odds: analysis.odds,
              is_featured: analysis.confidence >= 8,
              generated_at: new Date().toISOString(),
            },
            { onConflict: "fixture_id" }
          )
          .select();

        if (!error) results.push(data);
      } catch (e) {
        console.error("Failed to generate prediction", e);
      }
    }

    return NextResponse.json({
      ok: true,
      generated: results.length,
      date: today,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

function leaguePriority(name: string): number {
  const priorities: Record<string, number> = {
    "Premier League": 10,
    "La Liga": 9,
    "Champions League": 10,
    "Serie A": 8,
    "Bundesliga": 8,
    "Ligue 1": 7,
    "Europa League": 7,
    "Eredivisie": 5,
    "Ekstraklasa": 6,
    "Liga Portuguesa": 5,
  };
  return priorities[name] ?? 1;
}

async function generatePrediction(fixture: ApiFixture) {
  const prompt = `Jesteś profesjonalnym analitykiem sportowym. Przeanalizuj nadchodzący mecz i daj typ bukmacherski.

MECZ: ${fixture.teams.home.name} vs ${fixture.teams.away.name}
LIGA: ${fixture.league.name}
DATA: ${fixture.fixture.date}

Wyszukaj aktualne informacje o tym meczu (forma drużyn, H2H, kontuzje, kursy bukmacherskie) i na tej podstawie wybierz NAJBARDZIEJ PRAWDOPODOBNY typ z dobrym value.

Odpowiedz WYŁĄCZNIE JSON (bez markdown):
{
  "prediction": "konkretny typ np. Over 2.5 goli / Wygrana gospodarzy / BTTS Tak",
  "confidence": 7,
  "impliedProbability": "65%",
  "valueRating": "TAK/NIE/BRAK DANYCH",
  "analysis": "2-3 zdania zwięzłej analizy",
  "keyFactors": ["czynnik 1", "czynnik 2", "czynnik 3"],
  "risk": "niskie/średnie/wysokie",
  "odds": 1.85
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
    tools: [{ type: "web_search_20250305", name: "web_search" } as never],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const match = text.replace(/```json|```/g, "").match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
