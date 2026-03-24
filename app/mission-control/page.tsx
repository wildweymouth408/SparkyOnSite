'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Zap, TrendingUp, Users, Target, Calendar } from 'lucide-react';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Types
interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: string;
  successRate?: number;
}

interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  agentAssigned?: string;
}

interface Metrics {
  mrr: number;
  mrrTrend: number;
  freeUsers: number;
  proUsers: number;
  conversionRate: number;
  hoursSaved: number;
}

const AGENTS: Agent[] = [
  { id: '1', name: 'school-partnership-hunter', status: 'idle', successRate: 100 },
  { id: '2', name: 'influencer-engagement-auditor', status: 'running', successRate: 95 },
  { id: '3', name: 'nec-2023-content-validator', status: 'completed', successRate: 88 },
  { id: '4', name: 'competitor-monitoring-bot', status: 'idle', successRate: 100 },
  { id: '5', name: 'revenue-forecast-modeler', status: 'idle', successRate: 92 },
  { id: '6', name: 'social-ad-performance-simulator', status: 'idle', successRate: 87 },
  { id: '7', name: 'zoho-crm-setup-architect', status: 'idle', successRate: 100 },
  { id: '8', name: 'launch-day-checklist-generator', status: 'idle', successRate: 100 },
];

export default function MissionControlRealtime() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [metrics, setMetrics] = useState<Metrics>({
    mrr: 3200,
    mrrTrend: 52,
    freeUsers: 1847,
    proUsers: 157,
    conversionRate: 8.5,
    hoursSaved: 47,
  });
  const [revenueData, setRevenueData] = useState<any[]>([
    { date: 'Jun 1', revenue: 500, users: 280 },
    { date: 'Jun 5', revenue: 1200, users: 650 },
    { date: 'Jun 10', revenue: 2100, users: 1200 },
    { date: 'Jun 15', revenue: 3200, users: 1847 },
  ]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskActions, setShowTaskActions] = useState(false);

  // Subscribe to real-time task updates
  useEffect(() => {
    const subscription = supabase
      .from('mission_tasks')
      .on('*', payload => {
        console.log('Task update:', payload);
        fetchTasks();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to real-time metrics updates
  useEffect(() => {
    const subscription = supabase
      .from('mission_control_metrics')
      .on('*', payload => {
        console.log('Metrics update:', payload);
        fetchMetrics();
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to agent completions (live updates)
  useEffect(() => {
    const subscription = supabase
      .from('agent_completions')
      .on('INSERT', payload => {
        console.log('Agent completed:', payload.new);
        updateAgentStatus(payload.new);
        fetchMetrics(); // Recalculate metrics
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('mission_tasks')
      .select('*')
      .eq('status', 'pending')
      .limit(5);

    if (!error && data) {
      setTasks(data.map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        dueDate: t.due_date,
        agentAssigned: t.agent_assigned,
      })));
    }
  };

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('mission_control_metrics')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      setMetrics({
        mrr: data[0].mrr || 0,
        mrrTrend: data[0].mrr_trend || 0,
        freeUsers: data[0].free_users || 0,
        proUsers: data[0].pro_users || 0,
        conversionRate: data[0].conversion_rate || 0,
        hoursSaved: data[0].hours_saved || 0,
      });
    }
  };

  const updateAgentStatus = (completion: any) => {
    const agentIndex = agents.findIndex(a => a.name === completion.agent_name);
    if (agentIndex !== -1) {
      const updatedAgents = [...agents];
      updatedAgents[agentIndex] = {
        ...updatedAgents[agentIndex],
        status: completion.status === 'success' ? 'completed' : completion.status === 'failed' ? 'failed' : 'running',
        lastRun: 'just now',
      };
      setAgents(updatedAgents);
    }
  };

  const handleDismissTask = async (taskId: string) => {
    await supabase
      .from('mission_tasks')
      .update({ status: 'dismissed' })
      .eq('id', taskId);

    setTasks(tasks.filter(t => t.id !== taskId));
    setShowTaskActions(false);
  };

  const handleAssignAgent = async (taskId: string, agentName: string) => {
    await supabase
      .from('mission_tasks')
      .update({ agent_assigned: agentName })
      .eq('id', taskId);

    setTasks(tasks.map(t =>
      t.id === taskId ? { ...t, agentAssigned: agentName } : t
    ));
    setShowTaskActions(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-700 border-red-200';
      case 'high': return 'bg-orange-500/20 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-500/20 text-blue-700 border-blue-200';
    }
  };

  // Load initial data
  useEffect(() => {
    fetchTasks();
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-bold">Sparky Mission Control</h1>
          <span className="ml-auto text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">● LIVE</span>
        </div>
        <p className="text-gray-400">Real-time automation dashboard • Agent coordination • Revenue tracking</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'dashboard', label: 'Control Center', icon: '🎛️' },
          { id: 'agents', label: 'Agents', icon: '🤖' },
          { id: 'metrics', label: 'Metrics', icon: '📊' },
          { id: 'roadmap', label: 'Roadmap', icon: '🛣️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Content (Simplified - same structure as before but with real data) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Agent Nodes */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Agent Status (Real-time)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {agents.map(agent => (
                <div key={agent.id} className="relative group cursor-pointer">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-sm text-center transition-all transform group-hover:scale-110 ${getStatusColor(agent.status)} ${
                    agent.status === 'running' ? 'animate-pulse' : ''
                  }`}>
                    {agent.status === 'running' && <span className="animate-spin">⚙️</span>}
                    {agent.status === 'completed' && <CheckCircle className="w-6 h-6" />}
                    {agent.status === 'failed' && <AlertCircle className="w-6 h-6" />}
                    {agent.status === 'idle' && <Clock className="w-6 h-6" />}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-600">
                    {agent.name.split('-').join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
              <div className="text-gray-400 text-sm font-semibold mb-2">MRR</div>
              <div className="text-3xl font-bold text-cyan-400">${metrics.mrr.toLocaleString()}</div>
              <div className="text-green-400 text-sm mt-2">↑ {metrics.mrrTrend}%</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
              <div className="text-gray-400 text-sm font-semibold mb-2">Users</div>
              <div className="text-3xl font-bold text-purple-400">{(metrics.freeUsers + metrics.proUsers).toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-2">{metrics.proUsers} Pro</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
              <div className="text-gray-400 text-sm font-semibold mb-2">Conversion</div>
              <div className="text-3xl font-bold text-green-400">{metrics.conversionRate}%</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
              <div className="text-gray-400 text-sm font-semibold mb-2">Hours Saved</div>
              <div className="text-3xl font-bold text-orange-400">{metrics.hoursSaved}h</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
            <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Active Tasks ({tasks.length})
            </h3>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-gray-400 text-center py-4">Loading tasks...</div>
              ) : (
                tasks.map((task, idx) => (
                  <div key={task.id} className={`border-l-4 p-4 rounded-lg bg-slate-700/30 ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold">{idx + 1}. {task.title}</div>
                        <div className="text-sm opacity-75 mt-1">
                          Due: {task.dueDate} {task.agentAssigned && `• Assigned: ${task.agentAssigned}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedTask(task); setShowTaskActions(true); }}
                          className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded hover:bg-cyan-500/30 text-sm"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleDismissTask(task.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 text-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {showTaskActions && selectedTask && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="text-sm font-semibold mb-3">Reassign: {selectedTask.title}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => handleAssignAgent(selectedTask.id, agent.name)}
                      className="p-2 text-xs bg-slate-600 hover:bg-cyan-500/30 rounded transition-all"
                    >
                      {agent.name.split('-')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs (simplified for brevity) */}
      {activeTab !== 'dashboard' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur text-center text-gray-400">
          {activeTab === 'agents' && '🤖 Agents tab - coming soon'}
          {activeTab === 'metrics' && '📊 Metrics tab - coming soon'}
          {activeTab === 'roadmap' && '🛣️ Roadmap tab - coming soon'}
        </div>
      )}
    </div>
  );
}
