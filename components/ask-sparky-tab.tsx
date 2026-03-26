'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Zap, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
  }
  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    isFinal: boolean
  }
  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string
  }
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "What's your electrical question? I know the NEC inside and out and I'll give you a straight answer. Tap the mic to speak, or type below.",
}

export function AskSparkyTab() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)


  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const [speakEnabled, setSpeakEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const bottomRef = useRef<HTMLDivElement>(null)



  // Load user + conversation history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setHistoryLoaded(true); return }

        setUserId(user.id)

        const { data: rows, error } = await supabase
          .from('conversations')
          .select('role, content, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error || !rows || rows.length === 0) {
          setHistoryLoaded(true)
          return
        }

        const history = rows.reverse() as Message[]

        const lastMsg = rows[rows.length - 1] as typeof rows[0] & { created_at: string }
        const lastDate = new Date(lastMsg.created_at)
        const now = new Date()
        const diffMs = now.getTime() - lastDate.getTime()
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffHours / 24)

        let timeAgo = ''
        if (diffDays > 1) timeAgo = `${diffDays} days ago`
        else if (diffDays === 1) timeAgo = 'yesterday'
        else if (diffHours >= 1) timeAgo = `${diffHours}h ago`
        else timeAgo = 'recently'

        const summaryMessage: Message = {
          role: 'assistant',
          content: `Welcome back! I remember our last ${rows.length} messages (last active ${timeAgo}). Pick up where we left off or ask something new.`,
        }

        setMessages([summaryMessage, ...history])
      } catch {
        // Silently fall back to fresh state
      } finally {
        setHistoryLoaded(true)
      }
    }

    loadHistory()
  }, [])

  // Voice setup
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) setVoiceSupported(true)

    if ('speechSynthesis' in window) {
      setSpeechSupported(true)
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices()
        if (v.length > 0) voicesRef.current = v
      }
      loadVoices()
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
      return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, transcript])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => { setIsListening(true); setTranscript('') }

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) final += text
        else interim += text
      }
      setTranscript(interim || final)
      if (final) setInput(prev => prev + (prev ? ' ' : '') + final)
    }

    recognition.onerror = () => { setIsListening(false); setTranscript('') }
    recognition.onend = () => { setIsListening(false); setTranscript('') }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setTranscript('')
  }, [])

  const speak = useCallback((text: string) => {
    if (!speechSupported || !speakEnabled) return
    window.speechSynthesis.cancel()

    const cleaned = text
      .replace(/\*\*/g, '')
      .replace(/#{1,3}\s/g, '')
      .substring(0, 500)

    const utterance = new SpeechSynthesisUtterance(cleaned)
    utterance.rate = 0.95
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const preferred = voicesRef.current.find(v =>
      v.lang.startsWith('en') &&
      (v.name.includes('Google') || v.name.includes('Samantha') ||
       v.name.includes('Alex') || v.name.includes('David'))
    )
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [speechSupported, speakEnabled])

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }

    const conversationHistory = messages.filter(m =>
      !(m.role === 'assistant' && m.content.startsWith('Welcome back!')) &&
      !(m.role === 'assistant' && m.content.startsWith("What's your electrical"))
    )

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    stopSpeaking()

    try {
      // Pass the session token in the Authorization header — the server verifies identity server-side
      const { data: { session } } = await supabase.auth.getSession()
      const authHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`
      }

      const response = await fetch('/api/ask-sparky', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          messages: [...conversationHistory, userMessage],
        }),
      })
      const data = await response.json()
      const reply = data.reply || 'Something went wrong. Try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Check your signal and try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Field mode style tokens (removed field mode, using default dark theme)
  const fm = {
    topBar:     'text-zinc-400',
    voiceBtn:   'border-zinc-700 text-zinc-400',
    userBubble: 'bg-zinc-800/60 text-white border border-zinc-700 rounded-2xl',
    botBubble:  'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-2xl',
    inputBar:   'border-t border-zinc-800',
    input:      'border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-400 focus:border-orange-500 rounded-xl',
    micBtn:     'border-zinc-700 text-zinc-400 hover:border-orange-500 hover:text-orange-500 rounded-lg',
    hint:       'text-zinc-500',
  }

  return (
    <div className="flex flex-col h-full">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${fm.topBar}`}>
          <Zap className="h-3 w-3 text-orange-500" />
          Ask Sparky AI
        </div>
        {speechSupported && (
          <button
            onClick={() => { setSpeakEnabled(v => !v); if (isSpeaking) stopSpeaking() }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded text-[10px] uppercase tracking-wider font-bold transition-all ${
              speakEnabled
                ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                : 'border-zinc-700 text-zinc-400'
            }`}
          >
            {isSpeaking
              ? <><Volume2 className="h-3 w-3 animate-pulse" /> Speaking...</>
              : speakEnabled
                ? <><Volume2 className="h-3 w-3" /> Voice On</>
                : <><VolumeX className="h-3 w-3" /> Voice Off</>
            }
          </button>
        )}
      </div>

      {/* Sign-in prompt for unauthenticated users */}
      {historyLoaded && !userId && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2 text-xs text-orange-400">
          <span>Sign in to save your conversation history</span>
          <a href="/login" className="font-bold text-orange-300 underline hover:text-white transition-colors">Sign in →</a>
        </div>
      )}

      {/* Loading history indicator */}
      {!historyLoaded && (
        <div className="flex items-center gap-2 px-1 mb-2">
          <Loader2 className="h-3 w-3 animate-spin text-orange-500" />
          <span className={`text-[10px] uppercase tracking-wider ${fm.hint}`}>Loading your history...</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-col gap-3 pb-4 flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-orange-500 rounded mt-1">
                <Zap className="h-3.5 w-3.5 text-black" />
              </div>
            )}
            <div className={`max-w-[82%] px-3 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user' ? fm.userBubble : fm.botBubble
            }`}>
              {msg.content}

              {msg.role === 'assistant' && speechSupported && speakEnabled && (
                <button
                  onClick={() => speak(msg.content)}
                  className="mt-2 flex items-center gap-1.5 text-[10px] text-orange-500 uppercase tracking-wider font-bold"
                >
                  <Volume2 className="h-3 w-3" />
                  Tap to hear
                </button>
              )}
            </div>
          </div>
        ))}

        {isListening && transcript && (
          <div className="flex gap-2.5 flex-row-reverse">
            <div className="max-w-[82%] px-3 py-2.5 text-sm italic border border-dashed rounded-2xl text-zinc-400 border-zinc-500 bg-zinc-900">
              {transcript}...
            </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-orange-500 rounded mt-1">
              <Zap className="h-3.5 w-3.5 text-black" />
            </div>
            <div className="border px-3 py-2.5 bg-zinc-900 border-zinc-800 rounded-2xl">
              <div className="flex gap-1 items-center h-5">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className={`pt-3 ${fm.inputBar}`}>
        {isListening && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="flex gap-1">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-1 bg-orange-500 rounded-full animate-bounce"
                  style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
            <span className="text-[10px] text-orange-500 uppercase tracking-wider font-bold">Listening...</span>
            <span className={`text-[10px] ${fm.hint}`}>Tap mic to stop</span>
          </div>
        )}

        <div className="flex gap-2">
          {voiceSupported && (
            <button
              onClick={() => isListening ? stopListening() : startListening()}
              disabled={loading}
              className={`flex h-11 w-11 shrink-0 items-center justify-center border transition-all disabled:opacity-40 ${
                isListening
                  ? 'border-orange-500 bg-orange-500/15 text-orange-500 animate-pulse rounded-lg'
                  : fm.micBtn
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : 'Ask an electrical question...'}
            className={`flex-1 h-11 px-3 text-sm focus:outline-none ${fm.input}`}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 items-center justify-center bg-orange-500 text-black disabled:opacity-40 disabled:cursor-not-allowed shrink-0 rounded-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <span className={`text-[9px] ${fm.hint}`}>
            {voiceSupported ? '🎤 Tap mic to speak • Enter to send' : 'Enter to send'}
          </span>
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-[9px] text-orange-500 uppercase tracking-wider">
              Stop speaking
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
