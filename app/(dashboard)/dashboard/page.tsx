"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  ArrowRight,
  Zap,
  Target,
  Clock
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Prediction } from "@/lib/types"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    winRate: 0,
    thisMonth: 0,
    streak: 0
  })
  const [recentPredictions, setRecentPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: predictions } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (predictions) {
        setRecentPredictions(predictions as Prediction[])
        
        const total = predictions.length
        const wins = predictions.filter(p => p.result === "win").length
        const winRate = total > 0 ? Math.round((wins / total) * 100) : 0
        
        const thisMonth = predictions.filter(p => {
          const date = new Date(p.created_at)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length

        setStats({
          totalPredictions: total,
          winRate,
          thisMonth,
          streak: 0
        })
      }
      
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const statCards = [
    { 
      label: "Wszystkie predykcje", 
      value: stats.totalPredictions.toString(), 
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/20"
    },
    { 
      label: "Win Rate", 
      value: `${stats.winRate}%`, 
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/20"
    },
    { 
      label: "W tym miesiącu", 
      value: stats.thisMonth.toString(), 
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20"
    },
    { 
      label: "Aktualna passa", 
      value: stats.streak.toString(), 
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Witaj! Oto przegląd Twoich predykcji.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div 
            key={stat.label}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold font-mono">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link 
          href="/dashboard/matches"
          className="group bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6 hover:border-primary/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Przeglądaj mecze</h3>
          <p className="text-sm text-muted-foreground">
            Zobacz nadchodzące mecze z top 5 lig Europy
          </p>
        </Link>

        <Link 
          href="/dashboard/predictions"
          className="group bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Nowa predykcja</h3>
          <p className="text-sm text-muted-foreground">
            Wygeneruj predykcję AI dla wybranego meczu
          </p>
        </Link>
      </div>

      {/* Recent Predictions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Ostatnie predykcje</h2>
          <Link 
            href="/dashboard/history"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Zobacz wszystkie <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-muted-foreground">Ładowanie...</p>
          </div>
        ) : recentPredictions.length > 0 ? (
          <div className="space-y-3">
            {recentPredictions.map((prediction) => (
              <div 
                key={prediction.id}
                className="bg-card/50 border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {prediction.home_team} vs {prediction.away_team}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {new Date(prediction.created_at).toLocaleDateString("pl-PL")}
                      <span className="text-primary">•</span>
                      {prediction.market}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.result === "win" 
                        ? "bg-green-500/20 text-green-500"
                        : prediction.result === "loss"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {prediction.result === "win" ? "Trafione" : prediction.result === "loss" ? "Pudło" : "Oczekuje"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pewność: {prediction.confidence}/10
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card/50 border border-border/50 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">Nie masz jeszcze żadnych predykcji</p>
            <Link 
              href="/dashboard/matches"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Wygeneruj pierwszą predykcję
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
