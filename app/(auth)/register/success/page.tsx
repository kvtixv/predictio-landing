import Link from "next/link"
import { Mail, ArrowRight, Zap } from "lucide-react"

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-mono font-bold text-xl">Tipster AI</span>
        </Link>

        <div className="bg-card/50 border border-border/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Sprawdź swoją skrzynkę</h1>
          <p className="text-muted-foreground mb-6">
            Wysłaliśmy link aktywacyjny na Twój adres email. 
            Kliknij w link, aby aktywować konto.
          </p>

          <div className="bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground mb-6">
            <p>Nie otrzymałeś maila? Sprawdź folder spam lub spróbuj ponownie za kilka minut.</p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Przejdź do logowania
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
