'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';

export default function MissionControlPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ 
              padding: '0.5rem', 
              background: 'linear-gradient(to bottom right, #f97316, #fbbf24)',
              borderRadius: '0.5rem'
            }}>
              <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Mission Control</h1>
          </div>
          <p style={{ color: '#cbd5e1' }}>Real-time dashboard</p>
        </div>

        {/* TABS */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          borderBottom: '1px solid #334155',
          marginBottom: '2rem',
          paddingBottom: '1rem'
        }}>
          {['dashboard', 'agents', 'metrics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#f97316' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* METRICS */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Key Metrics</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {[
                  { label: 'Total Tasks', value: '247', change: '+12' },
                  { label: 'MRR', value: '$3.2K', change: '+52%' },
                  { label: 'Active Users', value: '2,004', change: '+340' },
                  { label: 'Uptime', value: '99.1%', change: 'stable' }
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {metric.label}
                    </div>
                    <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f97316' }}>
                      {metric.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.5rem' }}>
                      {metric.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TASKS */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Active Tasks</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { title: 'Wire Sizing Formula', priority: 'critical', due: 'Today' },
                  { title: 'School Outreach Campaign', priority: 'high', due: 'Tomorrow' },
                  { title: 'Supabase RLS Audit', priority: 'high', due: 'Tomorrow' },
                  { title: 'June Launch Readiness', priority: 'high', due: 'June 14' }
                ].map((task, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Due: {task.due}</div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: task.priority === 'critical' ? '#ef4444' : '#f59e0b',
                      color: 'white'
                    }}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div style={{ color: '#cbd5e1' }}>Agent details coming soon</div>
        )}

        {activeTab === 'metrics' && (
          <div style={{ color: '#cbd5e1' }}>Advanced metrics coming soon</div>
        )}
      </div>
    </div>
  );
}