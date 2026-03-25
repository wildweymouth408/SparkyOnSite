'use client';

import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

export default function AskSparkyPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: 'Hi! I\'m Sparky. Ask me anything about electrical work, NEC code, or calculations.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'This is a placeholder response. Connect to Claude API for real answers.'
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '700px', margin: '0 auto', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Ask Sparky
      </h1>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: msg.role === 'user' ? '#06b6d4' : '#1e293b',
              color: msg.role === 'user' ? '#0f172a' : '#cbd5e1'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{ padding: '1rem', color: '#94a3b8' }}>Thinking...</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            padding: '0.75rem',
            background: '#1e293b',
            color: 'white',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: '0.75rem 1rem',
            background: '#06b6d4',
            color: '#0f172a',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          <SendHorizontal style={{ width: '20px', height: '20px' }} />
        </button>
      </div>
    </div>
  );
}