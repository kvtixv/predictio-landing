// lib/prompts.ts

export function researchPrompt(home: string, away: string, league: string, date: string) {
  return `Jesteś ekspertem od analizy piłkarskiej. Znajdź AKTUALNE dane o meczu:

${home} vs ${away}
Liga: ${league}
Data: ${date}

Wyszukaj i podaj WYŁĄCZNIE JSON (bez markdown, bez backticks):
{
  "h2h": {
    "lastMatches": [{"date":"...","score":"...","competition":"..."}],
    "summary": "krótkie podsumowanie H2H"
  },
  "homeTeam": {
    "recentForm": "np. WWDLW (od najnowszego, 5 meczów)",
    "injuries": ["zawodnik - rodzaj kontuzji"],
    "suspensions": ["zawodnik - powód"],
    "probableLineup": "przewidywany skład",
    "keyStats": "xG, pozycja w tabeli, seria"
  },
  "awayTeam": {
    "recentForm": "np. LDWWL",
    "injuries": ["zawodnik - kontuzja"],
    "suspensions": ["zawodnik - powód"],
    "probableLineup": "przewidywany skład",
    "keyStats": "xG, pozycja w tabeli, seria"
  },
  "odds": {
    "home": "kurs 1",
    "draw": "kurs X",
    "away": "kurs 2",
    "overUnder": "kurs Over 2.5",
    "btts": "kurs BTTS Tak"
  },
  "context": "pozycja w tabeli, motywacja, derby, pogoda",
  "dataQuality": "wysoka/średnia/niska"
}

Jeśli nie znajdziesz informacji, wpisz "brak danych". Odpowiedz TYLKO JSON.`;
}

export function analysisPrompt(
  home: string,
  away: string,
  league: string,
  date: string,
  market: string,
  research: string,
  notes?: string
) {
  return `Jesteś profesjonalnym analitykiem sportowym. Na podstawie zebranych danych przeanalizuj mecz.

MECZ: ${home} vs ${away}
LIGA: ${league}
DATA: ${date}
RYNEK: ${market}

ZEBRANE DANE:
${research}

UWAGI UŻYTKOWNIKA:
${notes || "Brak"}

Odpowiedz WYŁĄCZNIE JSON (bez markdown, bez backticks):
{
  "prediction": "konkretny typ np. Over 2.5 goli",
  "confidence": 7,
  "impliedProbability": "55%",
  "valueRating": "TAK/NIE/BRAK DANYCH",
  "valueExplanation": "dlaczego jest/nie ma value",
  "analysis": "3-4 zdania analizy po polsku",
  "keyFactors": ["czynnik 1", "czynnik 2", "czynnik 3", "czynnik 4"],
  "risk": "niskie/średnie/wysokie",
  "alternativeBets": [{"bet": "typ alternatywny", "reason": "dlaczego"}],
  "socialCaption": "gotowy post po polsku na IG/Telegram max 280 znaków z emoji",
  "socialCaptionLong": "dłuższy post z analizą na Telegram VIP 2-3 zdania z emoji"
}`;
}
