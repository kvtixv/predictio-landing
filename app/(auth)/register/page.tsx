"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Zap, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Hasla nie sa takie same")
      return
    }

    if (password.length < 6) {
      setError("Haslo musi miec co najmniej 6 znakow")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Wystapil blad")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="pointer-events-none fixed inset-0 bg-radial-primary" />
        <div className="pointer-events-none fixed inset-0 bg-radial-accent" />

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-border/50 bg-card/80 p-8 text-center backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-2xl font-bold">Sprawdz swoja skrzynke</h1>
            <p className="mb-6 text-muted-foreground">
              Wyslalismy link aktywacyjny na adres{" "}
              <span className="font-medium text-foreground">{email}</span>.
              Kliknij w link, aby aktywowac swoje konto.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Wróc do logowania
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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

          <h1 className="mb-2 text-center text-2xl font-bold">
            Stworz konto
          </h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Dolacz do TipsterAI i zacznij typowac z AI
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="Min. 6 znakow"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-border/50 bg-secondary/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Potwierdz haslo
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Powtórz haslo"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Tworzenie konta...
                </>
              ) : (
                "Zarejestruj sie"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Masz juz konto?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Zaloguj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
