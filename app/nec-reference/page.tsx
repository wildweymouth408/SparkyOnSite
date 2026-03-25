'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function NECReferencePage() {
  const [search, setSearch] = useState('');

  const codes = [
    { article: '210', title: 'Branch Circuits', content: 'Voltage drop should not exceed 5% on branch circuits' },
    { article: '220', title: 'Branch Circuit, Feeder, and Service Calculations', content: 'Load calculations for all branch circuits and feeders' },
    { article: '300', title: 'Wiring Methods and Materials', content: 'Rules for conduit fill and cable installation' },
    { article: '430', title: 'Motors and Motor Controllers', content: 'Protection and control of motors' }
  ];

  const filtered = codes.filter(c => 
    c.article.includes(search) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        NEC Reference
      </h1>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search NEC articles..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            background: '#1e293b',
            color: 'white',
            border: '1px solid #334155',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94a3b8' }} />
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filtered.map((code, idx) => (
          <div key={idx} style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#06b6d4';
              el.style.background = '#1a3a4a';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#334155';
              el.style.background = '#1e293b';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4', marginRight: '1rem' }}>
                Article {code.article}
              </span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                {code.title}
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', margin: 0 }}>
              {code.content}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
          No results found
        </div>
      )}
    </div>
  );
}