"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  User, 
  Mail, 
  Calendar, 
  Target, 
  TrendingUp, 
  Trophy,
  Edit2,
  Save,
  Loader2
} from "lucide-react"
import type { Profile, Prediction } from "@/lib/types"

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState({
    totalPredictions: 0,
    winRate: 0,
    avgConfidence: 0,
    bestStreak: 0
  })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState("")
  
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      setUser({ id: user.id, email: user.email || "" })

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileData) {
        setProfile(profileData as Profile)
        setUsername(profileData.username || "")
      }

      // Fetch predictions for stats
      const { data: predictions } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)

      if (predictions) {
        const total = predictions.length
        const wins = predictions.filter((p: Prediction) => p.result === "win").length
        const withResult = predictions.filter((p: Prediction) => p.result).length
        const winRate = withResult > 0 ? Math.round((wins / withResult) * 100) : 0
        const avgConfidence = total > 0 
          ? Math.round(predictions.reduce((acc: number, p: Prediction) => acc + (p.confidence || 0), 0) / total)
          : 0

        setStats({
          totalPredictions: total,
          winRate,
          avgConfidence,
          bestStreak: 0
        })
      }

      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const saveProfile = async () => {
    if (!user) return
    
    setSaving(true)
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        username,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      setProfile(prev => prev ? { ...prev, username } : null)
      setEditing(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-mono">Profil</h1>
        <p className="text-muted-foreground mt-1">
          Zarządzaj swoim kontem i zobacz statystyki
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Nazwa użytkownika</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary/50"
                    placeholder="Twoja nazwa"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Zapisz
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false)
                      setUsername(profile?.username || "")
                    }}
                    className="px-4 py-2 bg-muted rounded-xl font-medium hover:bg-muted/80 transition-colors"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {profile?.username || user?.email?.split("@")[0] || "User"}
                  </h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Dołączył: {profile?.created_at 
                      ? new Date(profile.created_at).toLocaleDateString("pl-PL")
                      : "Niedawno"
                    }
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Twoje statystyki</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold font-mono">{stats.totalPredictions}</p>
            <p className="text-sm text-muted-foreground">Predykcje</p>
          </div>
          
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-green-500">{stats.winRate}%</p>
            <p className="text-sm text-muted-foreground">Win Rate</p>
          </div>
          
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold font-mono">{stats.avgConfidence}/10</p>
            <p className="text-sm text-muted-foreground">Śr. pewność</p>
          </div>
          
          <div className="bg-card/50 border border-border/50 rounded-xl p-5">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold font-mono">{stats.bestStreak}</p>
            <p className="text-sm text-muted-foreground">Najlepsza passa</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Ustawienia konta</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            Zmień hasło
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            Powiadomienia
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
            Usuń konto
          </button>
        </div>
      </div>
    </div>
  )
}
