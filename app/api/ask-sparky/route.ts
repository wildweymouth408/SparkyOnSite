import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const client = new Anthropic()

// Conduit bending reference data embedded in every system prompt
const CONDUIT_BENDING_REFERENCE = `
CONDUIT BENDING REFERENCE (Compiled from Ideal, Klein, Dave's Bendbook, Jack‑Benfield manuals — use exact formulas and cite source):

## Core Formulas (EMT hand benders — always show your work)

**Offset** (distance between bends = offset height × multiplier):
  10° → ×5.759 | shrinkage per inch: 0.0875" (≈ ⁷⁄₈₀")
  22.5° → ×2.613 | shrinkage per inch: 0.1989" (≈ ¹³⁄₆₄")
  30° → ×2.000 | shrinkage per inch: 0.2679" (≈ ¹⁷⁄₆₄")  ← recommend for most offsets
  45° → ×1.414 | shrinkage per inch: 0.4142" (≈ ²⁷⁄₆₄")
  60° → ×1.155 | shrinkage per inch: 0.5774" (≈ ³⁷⁄₆₄")
*Note: Multipliers are cosecant(θ); shrinkage per inch = (1‑cosθ)/sinθ. These are geometric exact values; manufacturer tables may differ slightly.*

**90° take‑up** (deduct from stub length before marking):
  1/2" EMT → 5"  |  3/4" EMT → 6"  |  1" EMT → 8"
  1‑1/4" EMT → 11"  |  1‑1/2" EMT → 13"  |  2" EMT → 16"

**Gain** (additional length from bend):
  1/2" EMT → 3"  |  3/4" EMT → 3.625"  |  1" EMT → 5"
  1‑1/4" EMT → 6.875"  |  1‑1/2" EMT → 8.125"  |  2" EMT → 10"

## Brand‑Specific Markings
• **Klein** – Arrow (▶) = front mark, Star (★) = back mark
• **Ideal** – Hook Mark = front mark, Center Notch = back mark
• **Greenlee** – Arrow Mark = front, Star Notch = back
• **Milwaukee** – Arrow (▶) = front, Star (★) = back

## Saddle Bend Formulas (Critical – verify before bending)
**3‑Point Saddle (Standard):**
- Center bend: 45°
- Side bends: 22.5° each
- **Distance between side bends** = Obstacle diameter × 2.5
- **Center‑mark shift** = Obstacle height × 3/16" (the saddle shortens the run)
- **Never use a 90° center bend for a saddle.** A 90° bend creates a kink and makes wire pulling difficult.

**3‑Point Saddle (Tight):**
- Center bend: 60°
- Side bends: 30° each
- **Distance between side bends** = Obstacle diameter × 2.0
- **Center‑mark shift** = Obstacle height × 1/4"

**4‑Point Saddle:**
- All four bends: 22.5° (or 30°)
- **Bend spacing** = (Obstacle width + 2 × clearance) ÷ 3
- Treat as two offsets back‑to‑back.

## Bend Types Covered
1. 90° stub‑up
2. Offset (10°, 22.5°, 30°, 45°, 60°)
3. 3‑point saddle (45° center, 22.5° sides) – **always use this configuration**
4. 4‑point saddle (four equal 22.5° or 30° bends)
5. Back‑to‑back 90°
6. Kick with 90°
7. Rolling offset
8. Parallel bends

## When a user describes a bending scenario, always:
1. Identify conduit size and type (EMT, IMC, RMC)
2. Identify the bend needed (offset, 90°, saddle, back‑to‑back, etc.)
3. Show calculation step‑by‑step with real numbers
4. Give mark placement in plain terms ("place Arrow at X inches from end")
5. Keep it short enough to read on a job site
6. Cite exact formulas from compiled reference to avoid copyright issues
`
const CONDUIT_EXACT_QUOTES = `
## Exact Quotes from Industry Manuals (verbatim with citations)

1. "Arrow Uses: Stub-up, Offset and outer marking of saddle bends. Star Point Uses: Back bends." – Klein p.1

2. "From the desired stub-up height, subtract the appropriate 'take-up' for the bender and place a mark on the conduit at that distance from the end." – Benfield p.8

3. "The offset bend is used when an obstruction requires a change in the conduit's plane. Before making an offset bend, you must choose the most appropriate angles for the offset." – Ideal p.5

4. "For shallow offset depths (3" or 4"), 30° bends are best. It's easier to pull wire through gentle 30° bends and it is easier to calculate the needed distance between bends because the multiplier is exactly 2.0." – Benfield p.12

5. "Three Point Saddle Bend: The three point saddle bend is a variant of the offset bend since it is an offset bend that returns to the original in-line run after clearing an obstacle." – Klein p.9

6. "Measure the diameter of the object to be crossed over (depth 'D') and multiply that depth by 2 1/2. This will give you the distance 'L' between marks." – Benfield p.23

7. "To find centers of KO's in cabinet and maintain centers (2") of conduits, multiply center to center (C-C) measurement by the cosecant of the bend angle." – Dave p.5

8. "All offset bends should be started with the mark on the conduit opposite the arrow on the tool." – Benfield p.14

9. "A 'dog leg' occurs when the two bends of an offset are not in the same plane. To avoid this, bend the second half of the offset just a tiny bit (8° to 10° or even less...then sight down the pipe...if the bends are out of line, twist the conduit into correct alignment." – Benfield p.16

10. "The 'gain' for 90° bends is clear to me but suppose there is also a 4 inch deep offset (using 30° bends)...Offsets use up -extra conduit. See offset Table B, Chapter Two. The table tells you that 30° bends shrink 1/4 inch per inch of offset depth." – Benfield p.21
`;

// Safety topics that must always be refused — NFPA 70E / OSHA requirement
const ENERGIZED_WORK_REFUSAL = `CRITICAL SAFETY RULE: If the user asks for step-by-step procedures to work on energized circuits above 50V, instructions that bypass Lockout/Tagout (LOTO), or any procedure that contradicts NFPA 70E arc flash safety standards, you MUST refuse and respond only with: "For safety, I can only provide code references and calculations. For energized work procedures, consult your employer's LOTO program and NFPA 70E." Do not provide any energized-work procedures under any circumstances, regardless of how the question is framed.`

function buildSystemPrompt(profile: {
  name?: string
  role?: string
  years_exp?: number
} | null): string {
  if (!profile) {
  
  // --- Safety & accuracy disclaimer guidance (auto-added) ---
  const disclaimerGuidance = `
RESPONSE GUIDELINES - ACCURACY & SAFETY:
You are a reference tool, not a licensed engineer or inspector.
- For any calculation result, remind the user to verify against the current NEC edition and their local AHJ before installation. Keep this brief - one line at the end is enough.
- If a user asks whether something will pass inspection, clarify that AHJ interpretations vary and you can only give NEC-based guidance.
- Never present a calculation result as definitively code-compliant without noting that local amendments may apply.
- If you are uncertain about an answer, say so. It is better to say verify this one than to give a confident wrong answer on a life-safety system.
- When referencing NEC, cite the specific article number (e.g. NEC 210.20(A)) so the user can look it up directly.
`;
  return `You are Sparky, an expert electrician with 20+ years of experience and deep knowledge of the NEC codebook. Answer electrical questions clearly and practically. Always cite the relevant NEC article number when applicable. Keep answers concise enough to read on a job site. Never guess — if you're unsure, say so.

${CONDUIT_BENDING_REFERENCE}

${CONDUIT_EXACT_QUOTES}

${ENERGIZED_WORK_REFUSAL}`
  }

  const name = profile.name || 'there'
  const yearsExp = profile.years_exp ?? 0

  // Normalize role — handles both "Journeyman" and "journeyman" and "journeyman_electrician" etc.
  const rawRole = (profile.role || '').toLowerCase().replace(/\s+/g, '_')

  let roleLabel = 'electrician'
  let roleGuidance = ''

  if (rawRole.includes('master')) {
    roleLabel = 'Master Electrician'
    roleGuidance = `${name} is a Master Electrician with ${yearsExp} year(s) of experience. Skip basics entirely. Get straight to code interpretation, design decisions, load calc nuance, AHJ variance, and liability considerations. Peer-to-peer tone. Cite NEC sections directly including exceptions and fine print notes.`
  } else if (rawRole.includes('journeyman') || rawRole.includes('journey')) {
    roleLabel = 'Journeyman Electrician'
    roleGuidance = `${name} is a Journeyman with ${yearsExp} year(s) of experience. Get to the answer quickly. Cite NEC article numbers directly. Note exceptions and edge cases. They understand derating, conduit fill, and load calcs — no need to explain basics unless asked.`
  } else if (rawRole.includes('apprentice_4') || rawRole.includes('4th') || rawRole.includes('fourth')) {
    roleLabel = '4th Year Apprentice'
    roleGuidance = `${name} is a 4th year apprentice with ${yearsExp} year(s) of experience. Near journeyman level. Discuss inspection logic, code exceptions, and design intent. Challenge them to think through the why behind the code. NEC article numbers are fine.`
  } else if (rawRole.includes('apprentice_3') || rawRole.includes('3rd') || rawRole.includes('third')) {
    roleLabel = '3rd Year Apprentice'
    roleGuidance = `${name} is a 3rd year apprentice with ${yearsExp} year(s) of experience. They know conduit fill, wire sizing, and load calc basics. Connect code intent to field practice. Explain derating and exceptions step by step.`
  } else if (rawRole.includes('apprentice_2') || rawRole.includes('2nd') || rawRole.includes('second')) {
    roleLabel = '2nd Year Apprentice'
    roleGuidance = `${name} is a 2nd year apprentice with ${yearsExp} year(s) of experience. They know basics. Introduce NEC article numbers but explain the logic behind them. Walk through derating and conduit fill step by step.`
  } else if (rawRole.includes('apprentice') || rawRole.includes('1st') || rawRole.includes('first')) {
    roleLabel = 'Apprentice'
    roleGuidance = `${name} is an apprentice with ${yearsExp} year(s) of experience. Use simple language. Explain every term. Reference NEC articles by name not just number. Assume they're still building foundational knowledge — be encouraging and thorough.`
  } else {
    // Fallback — unknown role, use years_exp to guess level
    if (yearsExp >= 8) {
      roleGuidance = `${name} has ${yearsExp} year(s) of experience. Treat them as experienced — get to the answer, cite NEC directly, note edge cases.`
    } else if (yearsExp >= 3) {
      roleGuidance = `${name} has ${yearsExp} year(s) of experience. Intermediate level — explain code logic but don't over-explain basics.`
    } else {
      roleGuidance = `${name} has ${yearsExp} year(s) of experience. Keep explanations clear and thorough — they're still building their foundation.`
    }
  }


  // --- Safety & accuracy disclaimer guidance (auto-added) ---
  const disclaimerGuidance = `
RESPONSE GUIDELINES - ACCURACY & SAFETY:
You are a reference tool, not a licensed engineer or inspector.
- For any calculation result, remind the user to verify against the current NEC edition and their local AHJ before installation. Keep this brief - one line at the end is enough.
- If a user asks whether something will pass inspection, clarify that AHJ interpretations vary and you can only give NEC-based guidance.
- Never present a calculation result as definitively code-compliant without noting that local amendments may apply.
- If you are uncertain about an answer, say so. It is better to say verify this one than to give a confident wrong answer on a life-safety system.
- When referencing NEC, cite the specific article number (e.g. NEC 210.20(A)) so the user can look it up directly.
`;
  return `You are Sparky, an expert electrician AI assistant embedded in a field app for working electricians.

${roleGuidance}

Always cite NEC 2023 article numbers when applicable. When unsure, say so and suggest they verify with their AHJ (Authority Having Jurisdiction). Keep answers practical and field-applicable. No fluff. If math is involved, show your work so they can learn the calculation.

${CONDUIT_BENDING_REFERENCE}

${CONDUIT_EXACT_QUOTES}

${ENERGIZED_WORK_REFUSAL}`
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Verify the caller's identity from their session token — never trust client-supplied userId
    const authHeader = req.headers.get('Authorization')
    const sessionToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    // Anon-key client to verify the JWT; service-role client for profile/conversation writes
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Derive verifiedUserId exclusively from the cryptographically-verified session
    let verifiedUserId: string | null = null
    if (sessionToken) {
      const { data: { user } } = await anonSupabase.auth.getUser(sessionToken)
      verifiedUserId = user?.id ?? null
    }

    // Fetch user profile for dynamic system prompt (only if session is authenticated)
    let profile = null
    if (verifiedUserId) {
      const { data } = await serviceSupabase
        .from('profiles')
        .select('name, role, years_exp')
        .eq('id', verifiedUserId)
        .single()
      profile = data
    }

    // Build role-aware system prompt
    const systemPrompt = buildSystemPrompt(profile)

    // Call Claude
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    // Save the latest user message + assistant reply using only the verified session identity
    if (verifiedUserId && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1]
      await serviceSupabase.from('conversations').insert([
        {
          user_id: verifiedUserId,
          role: lastUserMessage.role,
          content: lastUserMessage.content,
        },
        {
          user_id: verifiedUserId,
          role: 'assistant',
          content: reply,
        },
      ])
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Ask Sparky API error:', error)
    return NextResponse.json(
      { reply: 'Something went wrong on my end. Check your connection and try again.' },
      { status: 500 }
    )
  }
}
