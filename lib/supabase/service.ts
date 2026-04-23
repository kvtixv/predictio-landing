// lib/supabase/service.ts
// UWAGA: używać TYLKO w route handlers / cron jobs - omija RLS!
// Nie importować w komponentach klienckich.

import { createClient } from "@supabase/supabase-js";

export async function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key, nie anon key!
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
