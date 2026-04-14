"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  TrendingUp, 
  Shield, 
  Copy, 
  Check,
  Save,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { MARKETS } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface PredictionResult {
  prediction: string
  confidence: number
  impliedProbability: string
  valueRating: string
  risk: "niskie" | "srednie" | "wysokie"
  analysis: string
  keyFactors: string[]
  socialCaption: string
}

function NewPredictionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  const homeTeam = searchParams.get("home") || ""
  const awayTeam = searchParams.get("away") || ""
  const league = searchParams.get("league") || ""
  const matchDate = searchParams.get("date") || ""
  const matchId = searchParams.get("matchId") || ""
  
  const [selectedMarket, setSelectedMarket] = useState("1X2")
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const generatePrediction = async () => {
    setLoading(true)
    setPrediction(null)
    
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeTeam,
          awayTeam,
          league,
          matchDate,
          market: selectedMarket
        })
      })

      if (!response.ok) throw new Error("Failed to generate prediction")

      const data = await response.json()
      setPrediction(data)
    } catch (error) {
      console.error("Error generating prediction:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (prediction) {
      navigator.clipboard.writeText(prediction.socialCaption)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const savePrediction = async () => {
    if (!prediction) return
    
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { error } = await supabase.from("predictions").insert({
        user_id: user.id,
        match_id: matchId,
        home_team: homeTeam,
        away_team: awayTeam,
        league,
        match_date: matchDate,
        market: selectedMarket,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        implied_probability: prediction.impliedProbability,
        value_rating: prediction.valueRating,
        risk: prediction.risk,
        analysis: prediction.analysis,
        key_factors: prediction.keyFactors,
        social_caption: prediction.socialCaption
      })

      if (error) throw error
      
      setSaved(true)
      setTimeout(() => {
        router.push("/dashboard/history")
      }, 1500)
    } catch (error) {
      console.error("Error saving prediction:", error)
    } finally {
      setSaving(false)
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 8) return "text-green-500"
    if (confidence >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/matches"
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-mono">Nowa predykcja</h1>
          <p className="text-muted-foreground">
            Wygeneruj analizę AI dla wybranego meczu
          </p>
        </div>
      </div>

      {/* Match Info */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-xl font-bold">{homeTeam}</p>
            <p className="text-sm text-muted-foreground">Gospodarze</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center font-mono font-bold text-2xl text-muted-foreground">
            VS
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{awayTeam}</p>
            <p className="text-sm text-muted-foreground">Goście</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span>{league}</span>
          <span>•</span>
          <span>{matchDate ? new Date(matchDate).toLocaleDateString("pl-PL") : "TBD"}</span>
        </div>
      </div>

      {/* Market Selection */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Wybierz rynek</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MARKETS.map((market) => (
            <button
              key={market.id}
              onClick={() => setSelectedMarket(market.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMarket === market.id
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-card/50 hover:border-primary/30"
              }`}
            >
              <p className="font-medium">{market.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{market.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePrediction}
        disabled={loading}
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generowanie analizy...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Generuj predykcję
          </>
        )}
      </button>

      {/* Prediction Result */}
      {prediction && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Prediction Card */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rekomendacja AI</p>
                <p className="text-3xl font-bold font-mono text-primary">{prediction.prediction}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.risk)}`}>
                Ryzyko: {prediction.risk}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <Target className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className={`text-2xl font-bold font-mono ${getConfidenceColor(prediction.confidence)}`}>
                  {prediction.confidence}/10
                </p>
                <p className="text-xs text-muted-foreground">Pewność</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold font-mono">{prediction.impliedProbability}</p>
                <p className="text-xs text-muted-foreground">Prawdopod.</p>
              </div>
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{prediction.valueRating}</p>
                <p className="text-xs text-muted-foreground">Value</p>
              </div>
            </div>
          </div>

          {/* Analysis */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Analiza</h3>
            <p className="text-muted-foreground leading-relaxed">{prediction.analysis}</p>
            
            <h4 className="font-semibold mt-4 mb-2">Kluczowe czynniki</h4>
            <ul className="space-y-2">
              {prediction.keyFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Caption */}
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Social Media</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Skopiowano!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Kopiuj
                  </>
                )}
              </button>
            </div>
            <p className="text-muted-foreground bg-muted/50 p-4 rounded-xl font-mono text-sm">
              {prediction.socialCaption}
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={savePrediction}
            disabled={saving || saved}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Zapisano!
              </>
            ) : saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz predykcję
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default function NewPredictionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <NewPredictionContent />
    </Suspense>
  )
}
