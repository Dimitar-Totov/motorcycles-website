// SERVER-ONLY — never import this on the client.
//
// This client is created with the SERVICE ROLE key, which bypasses Row Level
// Security entirely. Use it only in API routes (app/api/**), server actions, and
// other server-only modules — never in a Client Component. The key is read from
// SUPABASE_SERVICE_ROLE_KEY (deliberately NOT prefixed with NEXT_PUBLIC_) so it is
// never bundled into client code.
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      // No session persistence/refresh on the server — this client acts purely as
      // the service role and must never read a user's cookies/session.
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
