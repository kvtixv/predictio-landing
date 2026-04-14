"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, ArrowLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Wystapil blad")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 bg-radial-primary" />
      <div className="pointer-events-none fixed inset-0 bg-radial-accent" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróc na strone glowna
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              TipsterAI
            </span>
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold">Witaj ponownie</h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Zaloguj sie, aby kontynuowac
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-border/50 bg-secondary/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Haslo
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Twoje haslo"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-border/50 bg-secondary/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-to-r from-primary to-primary/80 text-base font-bold text-primary-foreground hover:from-primary/90 hover:to-primary/70"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj sie"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Nie masz jeszcze konta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Zarejestruj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
