/**
 * POST /api/credentials/decrypt
 * Decrypt a credential's license number server-side.
 * Verifies ownership via session before decrypting.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decryptField } from '@/lib/crypto'
import { env } from '@/lib/env'

function getUserClient(authHeader: string | null) {
  return createClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
  )
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const supabase = getUserClient(authHeader)

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { credential_id: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.credential_id) {
    return NextResponse.json({ error: 'credential_id required' }, { status: 400 })
  }

  // Fetch only this user's credential (RLS + explicit user_id filter)
  const { data: cred, error: fetchError } = await supabase
    .from('credentials')
    .select('license_number')
    .eq('id', body.credential_id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !cred) {
    return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
  }

  if (!cred.license_number) {
    return NextResponse.json({ license: null })
  }

  try {
    const license = await decryptField(cred.license_number)
    return NextResponse.json({ license })
  } catch (err) {
    console.error('Decrypt error:', err)
    return NextResponse.json({ error: 'Unable to decrypt license' }, { status: 500 })
  }
}
