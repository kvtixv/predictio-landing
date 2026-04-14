import { NextRequest, NextResponse } from "next/server"

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY

const LEAGUE_CODES = ["PL", "PD", "SA", "BL1", "FL1"]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const league = searchParams.get("league") || "PL"
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")

  if (!FOOTBALL_DATA_API_KEY) {
    // Return mock data if no API key is set
    return NextResponse.json({
      matches: getMockMatches(league),
      source: "mock"
    })
  }

  try {
    let url = `https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED`
    
    if (dateFrom && dateTo) {
      url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`
    }

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": FOOTBALL_DATA_API_KEY,
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Football API error: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      matches: data.matches || [],
      source: "api"
    })
  } catch (error) {
    console.error("Error fetching matches:", error)
    return NextResponse.json({
      matches: getMockMatches(league),
      source: "mock"
    })
  }
}

function getMockMatches(league: string) {
  const now = new Date()
  const leagues: Record<string, { name: string; teams: string[][] }> = {
    PL: {
      name: "Premier League",
      teams: [
        ["Manchester City", "Manchester United"],
        ["Liverpool", "Arsenal"],
        ["Chelsea", "Tottenham"],
        ["Newcastle", "Aston Villa"],
        ["Brighton", "West Ham"],
      ]
    },
    PD: {
      name: "La Liga",
      teams: [
        ["Real Madrid", "Barcelona"],
        ["Atletico Madrid", "Sevilla"],
        ["Real Sociedad", "Athletic Bilbao"],
        ["Villarreal", "Valencia"],
        ["Real Betis", "Girona"],
      ]
    },
    SA: {
      name: "Serie A",
      teams: [
        ["Inter", "AC Milan"],
        ["Juventus", "Napoli"],
        ["Roma", "Lazio"],
        ["Atalanta", "Fiorentina"],
        ["Bologna", "Torino"],
      ]
    },
    BL1: {
      name: "Bundesliga",
      teams: [
        ["Bayern Munich", "Borussia Dortmund"],
        ["RB Leipzig", "Bayer Leverkusen"],
        ["Eintracht Frankfurt", "Wolfsburg"],
        ["Borussia Monchengladbach", "Freiburg"],
        ["Union Berlin", "Stuttgart"],
      ]
    },
    FL1: {
      name: "Ligue 1",
      teams: [
        ["PSG", "Marseille"],
        ["Lyon", "Monaco"],
        ["Lille", "Nice"],
        ["Lens", "Rennes"],
        ["Toulouse", "Strasbourg"],
      ]
    }
  }

  const leagueData = leagues[league] || leagues.PL
  
  return leagueData.teams.map((match, index) => {
    const matchDate = new Date(now)
    matchDate.setDate(matchDate.getDate() + index + 1)
    matchDate.setHours(15 + (index % 4), index % 2 === 0 ? 0 : 30)

    return {
      id: parseInt(`${league.charCodeAt(0)}${index}${Date.now()}`.slice(0, 10)),
      utcDate: matchDate.toISOString(),
      status: "SCHEDULED",
      matchday: Math.floor(index / 2) + 1,
      homeTeam: {
        id: index * 2 + 1,
        name: match[0],
        shortName: match[0].split(" ")[0],
        crest: ""
      },
      awayTeam: {
        id: index * 2 + 2,
        name: match[1],
        shortName: match[1].split(" ")[0],
        crest: ""
      },
      competition: {
        id: LEAGUE_CODES.indexOf(league) + 1,
        name: leagueData.name,
        code: league,
        emblem: ""
      },
      score: {
        fullTime: {
          home: null,
          away: null
        }
      }
    }
  })
}
