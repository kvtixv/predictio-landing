"use client"

import { useEffect, useState } from "react"
import { Calendar, Filter, Zap, Clock, ChevronRight } from "lucide-react"
import { LEAGUES, type Match, type League } from "@/lib/types"
import Link from "next/link"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLeague, setSelectedLeague] = useState<string>("PL")

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/matches?league=${selectedLeague}`)
        const data = await response.json()
        setMatches(data.matches || [])
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [selectedLeague])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pl-PL", {
      weekday: "short",
      day: "numeric",
      month: "short"
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Group matches by date
  const groupedMatches = matches.reduce((groups, match) => {
    const date = new Date(match.utcDate).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(match)
    return groups
  }, {} as Record<string, Match[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono">Nadchodzące mecze</h1>
        <p className="text-muted-foreground mt-1">
          Wybierz mecz i wygeneruj predykcję AI
        </p>
      </div>

      {/* League Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedLeague === league.id
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-muted-foreground">Ładowanie meczów...</p>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-card/50 border border-border/50 rounded-2xl p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Brak nadchodzących meczów w tej lidze
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMatches).map(([date, dateMatches]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(dateMatches[0].utcDate)}
              </h3>
              <div className="space-y-3">
                {dateMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/dashboard/predictions/new?matchId=${match.id}&home=${encodeURIComponent(match.homeTeam.name)}&away=${encodeURIComponent(match.awayTeam.name)}&league=${match.competition.code}&date=${match.utcDate}`}
                    className="group block bg-card/50 border border-border/50 rounded-2xl p-5 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                            {match.competition.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(match.utcDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Home Team */}
                          <div className="flex-1 text-right">
                            <p className="font-semibold text-lg">{match.homeTeam.name}</p>
                            <p className="text-xs text-muted-foreground">Gospodarze</p>
                          </div>
                          
                          {/* VS Badge */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-mono font-bold text-muted-foreground">
                              VS
                            </div>
                          </div>
                          
                          {/* Away Team */}
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{match.awayTeam.name}</p>
                            <p className="text-xs text-muted-foreground">Goście</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="ml-6 flex items-center gap-2">
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Zap className="w-4 h-4" />
                          <span className="hidden sm:inline">Analizuj</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
