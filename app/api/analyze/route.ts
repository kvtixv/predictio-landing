// app/api/analyze/route.ts
export async function GET() {
  const response = await fetch(
    "https://v3.football.api-sports.io/teams?search=psg",
    {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY!,
      },
    }
  )

  const data = await response.json()

  return Response.json(data)
}
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { researchPrompt, analysisPrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  // Sprawdź czy użytkownik jest zalogowany
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { mode } = body;

    let prompt: string;
    const useSearch = mode === "research";

    if (mode === "research") {
      const { homeTeam, awayTeam, league, matchDate } = body;
      if (!homeTeam || !awayTeam) {
        return NextResponse.json({ error: "Missing team names" }, { status: 400 });
      }
      prompt = researchPrompt(homeTeam, awayTeam, league, matchDate);
    } else if (mode === "predict") {
      const { homeTeam, awayTeam, league, matchDate, market, research, notes } = body;
      prompt = analysisPrompt(homeTeam, awayTeam, league, matchDate, market, research, notes);
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
      ...(useSearch && {
        tools: [{ type: "web_search_20250305", name: "web_search" } as never],
      }),
    });

    // Zbierz tekst z bloków
    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    // Wyciągnij JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "No JSON in response", raw: text }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ data: parsed, raw: text });
    } catch {
      return NextResponse.json(
        { error: "Failed to parse JSON", raw: text },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
