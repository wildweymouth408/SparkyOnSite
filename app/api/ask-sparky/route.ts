/**
 * app/api/profile/route.ts
 *
 * GET  /api/profile        — fetch authenticated user's profile (decrypts license)
 * POST /api/profile        — upsert profile (encrypts license before storage)
 *
 * Security:
 *  - userId is ALWAYS derived from the verified Supabase session, never from the request body.
 *  - License number is encrypted at rest using AES-GCM (lib/crypto.ts).
 *  - Requires CREDENTIAL_ENCRYPTION_KEY env var (64 hex chars / 256-bit).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { encryptField, decryptField } from '@/lib/crypto'

// ── Supabase server client (service role for RLS bypass on trusted server ops) ──
function getSupabase(authHeader: string | null) {
  // We create a client scoped to the user's JWT so RLS applies correctly.
  // Service role is only used for the auth.getUser() verification step.
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    authHeader
      ? { global: { headers: { Authorization: authHeader } } }
      : {}
  )
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── GET — return profile with decrypted license number ───────────────────────
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const supabase = getSupabase(authHeader)

  // Verify session — never trust client-supplied userId
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = getServiceClient()
  const { data: profile, error } = await serviceClient
    .from('profiles')
    .select('id, name, role, years_exp, company, license_encrypted')
    .eq('id', user.id)
    .single()

  if (error) {
    // PGRST116 = no row found; return empty profile rather than 500
    if (error.code === 'PGRST116') {
      return NextResponse.json({ profile: null })
    }
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }

  // Decrypt license number before sending to client
  let license = ''
  if (profile.license_encrypted) {
    try {
      license = await decryptField(profile.license_encrypted)
    } catch (decryptError) {
      // Log but don't surface — return empty rather than crash
      console.error('License decrypt error:', decryptError)
    }
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      name: profile.name,
      role: profile.role,
      years_exp: profile.years_exp,
      company: profile.company,
      license, // plaintext, only in transit (HTTPS) — never stored plain
    },
  })
}

// ── POST — upsert profile with encrypted license number ──────────────────────
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const supabase = getSupabase(authHeader)

  // Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    name?: string
    role?: string
    years_exp?: number
    company?: string
    license?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate years_exp if provided
  if (body.years_exp !== undefined) {
    const yrs = Number(body.years_exp)
    if (!Number.isInteger(yrs) || yrs < 0 || yrs > 60) {
      return NextResponse.json(
        { error: 'years_exp must be an integer between 0 and 60' },
        { status: 400 }
      )
    }
  }

  // Encrypt license number before storage — never store plaintext
  let license_encrypted: string | undefined
  if (body.license !== undefined) {
    if (body.license.length > 50) {
      return NextResponse.json(
        { error: 'License number too long (max 50 characters)' },
        { status: 400 }
      )
    }
    if (body.license.trim() === '') {
      license_encrypted = '' // allow clearing the field
    } else {
      try {
        license_encrypted = await encryptField(body.license.trim())
      } catch (encryptError) {
        console.error('License encrypt error:', encryptError)
        return NextResponse.json(
          { error: 'Failed to secure license data. Check server configuration.' },
          { status: 500 }
        )
      }
    }
  }

  // Build upsert payload — only include fields that were sent
  const upsertData: Record<string, unknown> = {
    id: user.id, // always set from session, never from body
    updated_at: new Date().toISOString(),
  }
  if (body.name !== undefined)      upsertData.name      = body.name.trim()
  if (body.role !== undefined)      upsertData.role      = body.role
  if (body.years_exp !== undefined) upsertData.years_exp = Number(body.years_exp)
  if (body.company !== undefined)   upsertData.company   = body.company.trim()
  if (license_encrypted !== undefined) upsertData.license_encrypted = license_encrypted

  const serviceClient = getServiceClient()
  const { error: upsertError } = await serviceClient
    .from('profiles')
    .upsert(upsertData, { onConflict: 'id' })

  if (upsertError) {
    console.error('Profile upsert error:', upsertError)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
