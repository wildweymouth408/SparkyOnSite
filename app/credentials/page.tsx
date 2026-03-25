'use client';

import React, { useState } from 'react';
import { Plus, Lock } from 'lucide-react';

export default function CredentialsPage() {
  const [credentials] = useState([
    { id: 1, title: 'Master Electrician License', issuer: 'California CSLB', expires: '2025-12-31' }
  ]);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '700px', margin: '0 auto', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
          Credentials Wallet
        </h1>
        <button style={{
          padding: '0.75rem 1rem',
          background: '#06b6d4',
          color: '#0f172a',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Plus style={{ width: '20px', height: '20px' }} />
          Add Credential
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {credentials.map((cred) => (
          <div key={cred.id} style={{
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Lock style={{ width: '24px', height: '24px', color: '#06b6d4' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {cred.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
                {cred.issuer} • Expires {cred.expires}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}