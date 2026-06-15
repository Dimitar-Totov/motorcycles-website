import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { UserRole } from '@/lib/types/roles'
import { createClient } from '@/utils/supabase/server'

const VALID_ROLES: readonly UserRole[] = ['user', 'admin']

export async function POST(request: Request) {
  // 1. Authenticate and authorize the caller server-side. We re-check the role
  //    here independently of middleware/UI — those are convenience only, this is
  //    the real gate. The role comes from app_metadata (JWT), never user_metadata.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.app_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 })
  }

  // 2. Parse and validate the request body.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { userId, role } = (body ?? {}) as { userId?: unknown; role?: unknown }

  if (typeof userId !== 'string' || userId.length === 0) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
  }

  if (typeof role !== 'string' || !VALID_ROLES.includes(role as UserRole)) {
    return NextResponse.json(
      { error: "Invalid role: must be 'user' or 'admin'" },
      { status: 400 },
    )
  }

  // 3. Apply the change with the service-role client (bypasses RLS).
  const supabaseAdmin = createAdminClient()

  // 3a. Embed the role in the JWT via app_metadata — this is the authoritative
  //     source for authorization (middleware, RLS via is_admin(), API guards).
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role },
  })
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // 3b. Keep the profiles table in sync so RLS policies that read it stay correct.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role })
    .eq('id', userId)
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
