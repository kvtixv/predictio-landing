"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Filter,
  ChevronDown,
  Search
} from "lucide-react"
import type { Prediction } from "@/lib/types"

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "win" | "loss" | "pending">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchPredictions = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setPredictions(data as Prediction[])
      }
      setLoading(false)
    }

    fetchPredictions()
  }, [supabase])

  const filteredPredictions = predictions.filter(p => {
    const matchesFilter = filter === "all" 
      || (filter === "pending" && !p.result)
      || p.result === filter
    
    const matchesSearch = searchQuery === "" 
      || p.home_team.toLowerCase().includes(searchQuery.toLowerCase())
      || p.away_team.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: predictions.length,
    wins: predictions.filter(p => p.result === "win").length,
    losses: predictions.filter(p => p.result === "loss").length,
    pending: predictions.filter(p => !p.result).length,
    winRate: predictions.length > 0 
      ? Math.round((predictions.filter(p => p.result === "win").length / predictions.filter(p => p.result).length) * 100) || 0
      : 0
  }

  const updateResult = async (id: string, result: "win" | "loss" | "void") => {
    const { error } = await supabase
      .from("predictions")
      .update({ result })
      .eq("id", id)

    if (!error) {
      setPredictions(prev => 
        prev.map(p => p.id === id ? { ...p, result } : p)
      )
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "niskie": return "text-green-500 bg-green-500/20"
      case "srednie": return "text-yellow-500 bg-yellow-500/20"
      case "wysokie": return "text-red-500 bg-red-500/20"
      default: return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono">Historia predykcji</h1>
        <p className="text-muted-foreground mt-1">
          Przeglądaj i zarządzaj wszystkimi swoimi predykcjami
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card/50 border border-border/50 rounded-xl p-4">
          <p className="text-2xl font-bold font-mono">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Wszystkie</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <p className="text-2xl font-bold font-mono text-green-500">{stats.wins}</p>
          <p className="text-sm text-green-500/70">Trafione</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-2xl font-bold font-mono text-red-500">{stats.losses}</p>
          <p className="text-sm text-red-500/70">Pudła</p>
        </div>
        <div className="bg-muted/50 border border-border/50 rounded-xl p-4">
          <p className="text-2xl font-bold font-mono">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Oczekuje</p>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
          <p className="text-2xl font-bold font-mono text-primary">{stats.winRate}%</p>
          <p className="text-sm text-primary/70">Win Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Szukaj drużyny..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card/50 border border-border/50 rounded-xl focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "win", "loss", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 border border-border/50 text-muted-foreground hover:border-primary/30"
              }`}
            >
              {f === "all" ? "Wszystkie" : f === "win" ? "Trafione" : f === "loss" ? "Pudła" : "Oczekuje"}
            </button>
          ))}
        </div>
      </div>

      {/* Predictions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div className="bg-card/50 border border-border/50 rounded-2xl p-8 text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {predictions.length === 0 
              ? "Nie masz jeszcze żadnych predykcji"
              : "Brak predykcji pasujących do filtrów"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPredictions.map((prediction) => (
            <div 
              key={prediction.id}
              className="bg-card/50 border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Match Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                      {prediction.league}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(prediction.created_at).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  <p className="font-semibold text-lg">
                    {prediction.home_team} vs {prediction.away_team}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {prediction.market}: <span className="text-primary font-medium">{prediction.prediction}</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold font-mono">{prediction.confidence}/10</p>
                    <p className="text-xs text-muted-foreground">Pewność</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(prediction.risk)}`}>
                    {prediction.risk}
                  </div>
                </div>

                {/* Result */}
                <div className="flex items-center gap-2">
                  {prediction.result ? (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                      prediction.result === "win" 
                        ? "bg-green-500/20 text-green-500"
                        : prediction.result === "loss"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {prediction.result === "win" ? (
                        <><CheckCircle className="w-4 h-4" /> Trafione</>
                      ) : prediction.result === "loss" ? (
                        <><XCircle className="w-4 h-4" /> Pudło</>
                      ) : (
                        "Anulowane"
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateResult(prediction.id, "win")}
                        className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                        title="Oznacz jako trafione"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => updateResult(prediction.id, "loss")}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        title="Oznacz jako pudło"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Analysis */}
              <details className="mt-4 group">
                <summary className="cursor-pointer text-sm text-primary flex items-center gap-1 hover:underline">
                  Zobacz analizę
                  <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">{prediction.analysis}</p>
                  {prediction.key_factors && prediction.key_factors.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {prediction.key_factors.map((factor, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
