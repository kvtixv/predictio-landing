"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      await supabase.auth.getSession()

      router.push("/dashboard")
    }

    handleAuth()
  }, [router])

  return <p>Logowanie...</p>
}
