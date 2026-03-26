/**
 * POST /api/credentials
 * Create a credential with server-side license number encryption.
 * The client sends the plaintext license; this route encrypts before inserting.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { encryptField } from '@/lib/crypto'
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

  let body: {
    name: string
    issuer?: string
    issue_date?: string | null
    expiry_date?: string | null
    license_number?: string | null
    file_path?: string | null
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  let license_number: string | null = null
  if (body.license_number?.trim()) {
    try {
      license_number = await encryptField(body.license_number.trim())
    } catch (err) {
      console.error('Encrypt error:', err)
      return NextResponse.json({ error: 'Failed to secure license data' }, { status: 500 })
    }
  }

  const { error: insertError } = await supabase.from('credentials').insert({
    user_id: user.id,
    name: body.name.trim(),
    issuer: body.issuer?.trim() || null,
    issue_date: body.issue_date || null,
    expiry_date: body.expiry_date || null,
    license_number,
    file_path: body.file_path ?? null,
  })

  if (insertError) {
    console.error('Credential insert error:', insertError)
    return NextResponse.json({ error: 'Failed to save credential' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
