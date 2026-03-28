'use client'

import { useState, useEffect } from 'react'
import { Plus, HardHat, MapPin, Calendar, ChevronRight, X } from 'lucide-react'
import { getJobs, saveJob, deleteJob, type Job } from '@/lib/storage'
import { generateId } from '@/lib/storage'

const STATUS_STYLES: Record<Job['status'], string> = {
  'on-track': 'bg-emerald-500/15 text-emerald-400',
  'at-risk':  'bg-orange-500/15 text-orange-400',
  'complete': 'bg-zinc-700/60 text-zinc-400',
}
const STATUS_LABEL: Record<Job['status'], string> = {
  'on-track': 'On Track',
  'at-risk':  'At Risk',
  'complete': 'Complete',
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b']

interface NewJobForm {
  name: string
  address: string
  status: Job['status']
  color: string
}

const EMPTY_FORM: NewJobForm = { name: '', address: '', status: 'on-track', color: COLORS[0] }

export function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewJobForm>(EMPTY_FORM)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    setJobs(getJobs())
  }, [])

  function createJob() {
    if (!form.name.trim() || !form.address.trim()) return
    const job: Job = {
      id: generateId(),
      name: form.name.trim(),
      address: form.address.trim(),
      status: form.status,
      color: form.color,
      crew: [],
      tasks: [],
      notes: [],
      calculations: [],
      createdAt: new Date().toISOString(),
    }
    saveJob(job)
    const updated = getJobs()
    setJobs(updated)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function removeJob(id: string) {
    deleteJob(id)
    setJobs(getJobs())
    if (selectedJob?.id === id) setSelectedJob(null)
  }

  // ── Detail view ────────────────────────────────────────────────────────────

  if (selectedJob) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedJob(null)} className="text-orange-400 text-sm font-semibold">
            ← Jobs
          </button>
          <span className="text-zinc-600">/</span>
          <span className="text-sm text-white truncate">{selectedJob.name}</span>
        </div>

        <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{selectedJob.name}</h1>
              <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {selectedJob.address}
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[selectedJob.status]}`}>
              {STATUS_LABEL[selectedJob.status]}
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Created</span>
              <span>{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Tasks</span>
              <span>{selectedJob.tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Crew</span>
              <span>{selectedJob.crew.length} members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Calculations</span>
              <span>{selectedJob.calculations.length}</span>
            </div>
          </div>

          {selectedJob.notes.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Notes</h3>
              <div className="space-y-2">
                {selectedJob.notes.map((note, i) => (
                  <p key={i} className="text-sm text-zinc-300">{note}</p>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => removeJob(selectedJob.id)}
            className="w-full py-3 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-500/10 transition-colors"
          >
            Delete Job
          </button>
        </div>
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Jobs</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-black text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Job
        </button>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 bg-orange-500/10 rounded-2xl mb-4">
              <HardHat className="h-10 w-10 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">No jobs yet</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">Create your first job to track work, crew, and calculations in one place.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create First Job
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-orange-500/40 hover:shadow-[0_0_16px_rgba(249,115,22,0.1)] transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: job.color }} />
                    <span className="font-semibold text-white">{job.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[job.status]}`}>
                      {STATUS_LABEL[job.status]}
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-600" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500 pl-5">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.address}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Job Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={() => setShowForm(false)}>
          <div
            className="w-full bg-zinc-950 border-t border-zinc-800 rounded-t-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">New Job</h2>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5 text-zinc-500" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Job Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Smith Residence Panel Upgrade"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St, City, CA"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as Job['status'] }))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="on-track">On Track</option>
                  <option value="at-risk">At Risk</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className="w-8 h-8 rounded-full border-2 transition-all"
                      style={{ backgroundColor: c, borderColor: form.color === c ? '#fff' : 'transparent' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 border border-zinc-700 text-white text-sm font-bold rounded-lg hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createJob}
                disabled={!form.name.trim() || !form.address.trim()}
                className="flex-1 py-3 bg-orange-500 text-black text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
