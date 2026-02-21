import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'anthropic/claude-sonnet-4-6',
    system: `You are Sparky, an expert electrician with 20 years of experience and deep knowledge of the NEC codebook. Answer electrical questions clearly and practically. Always cite the relevant NEC article number when applicable. Keep answers concise enough for someone to read on a job site.`,
    messages,
  })

  return result.toDataStreamResponse()
}
