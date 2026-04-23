// app/api/debug/env-vars/route.ts
//
// DEBUG: lista nazw zmiennych środowiskowych (bez wartości)
// Pomoże znaleźć literówkę w nazwie API_FOOTBALL_KEY
//
// USUŃ po diagnostyce!
//
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Filtruj tylko zmienne które mogą dotyczyć naszego problemu
  const allKeys = Object.keys(process.env);

  const relevant = allKeys.filter(k =>
    /FOOTBALL|API|ANTHROPIC|SUPABASE|CRON|ADMIN/i.test(k)
  ).sort();

  // Sprawdzenie: szukaj nazwy podobnej do API_FOOTBALL_KEY
  const similar = allKeys.filter(k =>
    /football/i.test(k)
  );

  // Dla każdej "podobnej" sprawdź długość wartości
  const similarDetails = similar.map(name => ({
    name,
    nameLength: name.length,
    nameBytes: Array.from(name).map(c => c.charCodeAt(0)),
    valueLength: process.env[name]?.length ?? 0,
    hasValue: !!process.env[name],
  }));

  return NextResponse.json({
    totalEnvVars: allKeys.length,
    relevantKeys: relevant,
    footballLikeKeys: similarDetails,
    expectedName: "API_FOOTBALL_KEY",
    expectedNameBytes: Array.from("API_FOOTBALL_KEY").map(c => c.charCodeAt(0)),
  });
}
