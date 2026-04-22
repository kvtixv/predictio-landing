// app/api/predictions/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - lista analiz użytkownika
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ predictions: data });
}

// POST - zapisz nową analizę
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        home_team: body.homeTeam,
        away_team: body.awayTeam,
        league: body.league,
        match_date: body.matchDate,
        market: body.market,
        research_data: body.researchData ?? null,
        prediction: body.prediction,
        confidence: body.confidence,
        implied_probability: body.impliedProbability ?? null,
        value_rating: body.valueRating ?? null,
        analysis: body.analysis ?? null,
        key_factors: body.keyFactors ?? null,
        alternative_bets: body.alternativeBets ?? null,
        risk: body.risk ?? null,
        social_caption: body.socialCaption ?? null,
        social_caption_long: body.socialCaptionLong ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ prediction: data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown" },
      { status: 500 }
    );
  }
}

// PATCH - oznacz wynik
export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, result } = await req.json();

  const { error } = await supabase
    .from("predictions")
    .update({ result })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
