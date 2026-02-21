'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef } from 'react'
import { Send, Zap } from 'lucide-react'

export function AskSparkyTab() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#222] ring-2 ring-[#ff6b00]/20">
              <Zap className="h-8 w-8 text-[#ff6b00]" strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-[#ff6b00]">
                Ask Sparky
              </h2>
              <p className="text-xs leading-relaxed text-[#888]">
                20 years experience • NEC Expert • Job Site Ready
              </p>
            </div>
            <div className="mt-4 space-y-2 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-[#666]">
                Try asking:
              </p>
              <div className="space-y-1.5">
                {[
                  'What's the maximum conduit fill for EMT?',
                  'How do I calculate voltage drop for 3-phase?',
                  'What size wire for a 50A circuit at 120V?',
                  'NEC requirements for GFCI in bathrooms?',
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(new Event('submit') as any, { data: q })}
                    className="block w-full border border-[#333] bg-[#1a1a1a] px-3 py-2 text-left text-xs text-[#888] transition-colors hover:border-[#ff6b00]/50 hover:text-[#f0f0f0]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#222] ring-1 ring-[#ff6b00]/30">
                <Zap className="h-4 w-4 text-[#ff6b00]" strokeWidth={2.5} />
              </div>
            )}
            <div
              className={`max-w-[85%] border px-4 py-3 ${
                message.role === 'user'
                  ? 'border-[#ff6b00]/30 bg-[#222] text-[#f0f0f0]'
                  : 'border-[#333] bg-[#1a1a1a] text-[#e0e0e0]'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#222] ring-1 ring-[#ff6b00]/30">
              <Zap className="h-4 w-4 animate-pulse text-[#ff6b00]" strokeWidth={2.5} />
            </div>
            <div className="border border-[#333] bg-[#1a1a1a] px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b00]" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b00]" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff6b00]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area - pinned to bottom */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 mt-auto border-t border-[#333] bg-[#0f1115] pt-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about electrical work..."
            disabled={isLoading}
            className="flex-1 border border-[#333] bg-[#1a1a1a] px-4 py-3 font-sans text-sm text-[#f0f0f0] placeholder-[#555] outline-none transition-colors focus:border-[#ff6b00]/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center bg-[#ff6b00] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0f1115] transition-all hover:bg-[#ff8533] disabled:opacity-50 disabled:hover:bg-[#ff6b00]"
          >
            <Send className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  )
}
