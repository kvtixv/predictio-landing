// app/api/admin/generate-predictions/route.ts
//
// Ręczny trigger do generowania typów dnia.
// Używaj jeśli chcesz przetestować generację bez czekania na cron o 7:00.
// Dostęp: tylko jeśli podasz ADMIN_SECRET w URL.
//
// Użycie:
//   curl https://predictio.pl/api/admin/generate-predictions?secret=TWOJ_SEKRET
//
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Wywołaj cron endpoint z poprawnym tokenem
  const cronUrl = new URL("/api/cron/daily-predictions", req.url);
  const res = await fetch(cronUrl.toString(), {
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
