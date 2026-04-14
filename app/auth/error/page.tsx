import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Blad autoryzacji</h1>
        <p className="mb-8 text-muted-foreground">
          Wystapil problem z logowaniem. Sprobuj ponownie lub skontaktuj sie z
          nami jesli problem bedzie sie powtarzal.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login">
            <Button>Sprobuj ponownie</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Wróc na strone glowna</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
