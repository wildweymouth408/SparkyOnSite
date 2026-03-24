'use client';

import React, { useState } from 'react';
import { Zap, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const AGENTS = [
  { name: 'school-partnership-hunter', status: 'idle' },
  { name: 'influencer-engagement-auditor', status: 'running' },
  { name: 'nec-2023-content-validator', status: 'completed' },
  { name: 'competitor-monitoring-bot', status: 'idle' },
  { name: 'revenue-forecast-modeler', status: 'idle' },
  { name: 'social-ad-performance-simulator', status: 'idle' },
  { name: 'zoho-crm-setup-architect', status: 'idle' },
  { name: 'launch-day-checklist-generator', status: 'idle' },
];

export default function MissionControl() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getStatusIcon = (status: string) => {
    if (status === 'running') return '⚙️';
    if (status === 'completed') return '✓';
    if (status === 'idle') return '◯';
    return '!';
  };

  const getStatusBg = (status: string) => {
    if (status === 'running') return 'bg-blue-500';
    if (status === 'completed') return 'bg-green-500';
    if (status === 'idle') return 'bg-gray-600';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold">Sparky Mission Control</h1>
          </div>
          <p className="text-gray-400">Real-time agent coordination dashboard</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['dashboard', 'agents', 'metrics', 'roadmap'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition-all ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Agent Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4">Agent Status</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {AGENTS.map(agent => (
                  <div
                    key={agent.name}
                    className={`flex flex-col items-center p-3 rounded-lg ${getStatusBg(agent.status)} ${
                      agent.status === 'running' ? 'animate-pulse' : ''
                    }`}
                  >
                    <div className="text-2xl mb-2">{getStatusIcon(agent.status)}</div>
                    <div className="text-xs text-center truncate">{agent.name.split('-')[0]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'MRR', value: '$3,200', trend: '+52%' },
                  { label: 'Users', value: '2,004', trend: '+340' },
                  { label: 'Conversion', value: '8.5%', trend: 'stable' },
                  { label: 'Hours Saved', value: '47h', trend: 'this month' },
                ].map(metric => (
                  <div key={metric.label} className="bg-slate-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm mb-2">{metric.label}</div>
                    <div className="text-2xl font-bold text-cyan-400">{metric.value}</div>
                    <div className="text-xs text-green-400 mt-2">{metric.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h2 className="text-xl font-bold mb-4">Active Tasks</h2>
              <div className="space-y-3">
                {[
                  { title: 'Fix Wire Sizing formula', priority: 'critical', due: 'Today' },
                  { title: 'School outreach begins', priority: 'high', due: 'Tomorrow' },
                  { title: 'Review revenue scenarios', priority: 'high', due: 'Tomorrow' },
                  { title: 'Launch readiness', priority: 'high', due: 'June 14' },
                  { title: 'Social content approval', priority: 'medium', due: 'June 16' },
                ].map((task, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{task.title}</div>
                        <div className="text-sm text-gray-400 mt-1">Due: {task.due}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                        task.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGENTS.map(agent => (
              <div key={agent.name} className="bg-slate-800 rounded-lg p-4">
                <div className="font-semibold mb-2">{agent.name}</div>
                <div className={`text-sm inline-block px-2 py-1 rounded ${getStatusBg(agent.status)}`}>
                  {agent.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="bg-slate-800 rounded-lg p-6 text-center text-gray-400">
            📊 Metrics dashboard coming soon
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Launch', value: '21 days', max: 100, current: 65 },
              { label: '$5K MRR', value: '$3.2K/$5K', max: 5000, current: 3200 },
              { label: '5K Users', value: '1.8K/5K', max: 5000, current: 1800 },
            ].map(item => (
              <div key={item.label} className="bg-slate-800 rounded-lg p-4">
                <div className="font-semibold mb-2">{item.label}</div>
                <div className="text-2xl font-bold text-cyan-400 mb-3">{item.value}</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${(item.current / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
