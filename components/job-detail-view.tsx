'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft, Edit2, Check, X, Trash2, Plus, Camera,
  Calculator, MapPin, FileText, ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Job {
  id: string
  user_id: string
  name: string
  address: string | null
  job_type: string | null
  notes: string | null
  last_used_at: string
  created_at: string
  updated_at: string
}

interface JobPhoto {
  id: string
  job_id: string
  user_id: string
  storage_path: string
  caption: string | null
  created_at: string
  url?: string
}

interface JobCalculation {
  id: string
  job_id: string
  calculator_type: string
  inputs: Record<string, unknown>
  result: Record<string, unknown>
  notes: string | null
  created_at: string
}

interface JobDetailViewProps {
  jobId: string
  userId: string
  onBack: () => void
  onDeleted: () => void
}

const JOB_TYPES = ['Residential', 'Commercial', 'Industrial', 'Service', 'Other']

// ─── JOB DETAIL VIEW ─────────────────────────────────────────────────────────

export function JobDetailView({ jobId, userId, onBack, onDeleted }: JobDetailViewProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [photos, setPhotos] = useState<JobPhoto[]>([])
  const [calculations, setCalculations] = useState<JobCalculation[]>([])
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadJob()
  }, [jobId])

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  async function loadJob() {
    // Update last_used_at when opening
    await supabase
      .from('jobs')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', jobId)

    const { data: jobData } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobData) {
      setJob(jobData)
      setNameValue(jobData.name)
    }

    // Load photos
    const { data: photoData } = await supabase
      .from('job_photos')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (photoData && photoData.length > 0) {
      const photosWithUrls = await Promise.all(
        photoData.map(async (p) => {
          const { data } = await supabase.storage
            .from('job-photos')
            .createSignedUrl(p.storage_path, 3600)
          return { ...p, url: data?.signedUrl }
        })
      )
      setPhotos(photosWithUrls)
    }

    // Load calculations
    const { data: calcData } = await supabase
      .from('job_calculations')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (calcData) setCalculations(calcData)
  }

  async function saveField(field: 'address' | 'job_type' | 'notes', value: string) {
    if (!job) return
    setSaving(true)
    await supabase
      .from('jobs')
      .update({ [field]: value || null, updated_at: new Date().toISOString() })
      .eq('id', jobId)
    setJob(prev => prev ? { ...prev, [field]: value || null } : prev)
    setSaving(false)
  }

  async function saveName() {
    const trimmed = nameValue.trim()
    if (!trimmed) {
      setNameValue(job?.name || '')
      setEditingName(false)
      return
    }
    setSaving(true)
    await supabase
      .from('jobs')
      .update({ name: trimmed, updated_at: new Date().toISOString() })
      .eq('id', jobId)
    setJob(prev => prev ? { ...prev, name: trimmed } : prev)
    setSaving(false)
    setEditingName(false)
  }

  async function handlePhotoUpload(file: File) {
    setUploadingPhoto(true)
    setUploadError('')
    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${userId}/${jobId}/${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('job-photos')
        .upload(path, file)
      if (uploadErr) throw uploadErr

      const { data: photoRecord } = await supabase
        .from('job_photos')
        .insert({ job_id: jobId, user_id: userId, storage_path: path })
        .select()
        .single()

      if (photoRecord) {
        const { data: urlData } = await supabase.storage
          .from('job-photos')
          .createSignedUrl(path, 3600)
        setPhotos(prev => [{ ...photoRecord, url: urlData?.signedUrl }, ...prev])
      }
    } catch (e: any) {
      setUploadError(`Upload failed: ${e.message}`)
    }
    setUploadingPhoto(false)
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function deletePhoto(photo: JobPhoto) {
    await supabase.storage.from('job-photos').remove([photo.storage_path])
    await supabase.from('job_photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  async function deleteJob() {
    await supabase.from('jobs').delete().eq('id', jobId)
    onDeleted()
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full bg-[#09090b]">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-[#09090b]">

      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a] sticky top-0 bg-[#09090b] z-10">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 text-[#a1a1aa] hover:text-[#fafafa] active:scale-90 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {editingName ? (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <input
              ref={nameInputRef}
              value={nameValue}
              onChange={e => setNameValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') saveName()
                if (e.key === 'Escape') { setNameValue(job.name); setEditingName(false) }
              }}
              className="flex-1 bg-[#18181b] border border-[#f97316] px-2 py-1 text-base font-bold text-[#fafafa] focus:outline-none min-w-0"
            />
            <button onClick={saveName} className="p-1 text-[#f97316] shrink-0">
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={() => { setNameValue(job.name); setEditingName(false) }}
              className="p-1 text-[#a1a1aa] shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <h1 className="text-base font-bold text-[#fafafa] truncate">{job.name}</h1>
            <button
              onClick={() => setEditingName(true)}
              className="p-1 text-[#a1a1aa] hover:text-[#f97316] shrink-0 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {saving && (
          <span className="text-[10px] text-[#a1a1aa] uppercase tracking-wider shrink-0">Saving…</span>
        )}
      </div>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-4 pb-20">

        {/* Job Info */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">Job Info</h2>

          {/* Address */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#a1a1aa] mb-1.5">Address</label>
            <input
              className="w-full bg-[#18181b] border border-[#27272a] px-3 py-2.5 text-sm text-[#fafafa] placeholder-[#3f3f46] focus:border-[#f97316] focus:outline-none"
              defaultValue={job.address || ''}
              placeholder="123 Main St, San Jose CA"
              onBlur={e => saveField('address', e.target.value)}
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#a1a1aa] mb-1.5">Job Type</label>
            <select
              className="w-full bg-[#18181b] border border-[#27272a] px-3 py-2.5 text-sm text-[#fafafa] focus:border-[#f97316] focus:outline-none appearance-none"
              defaultValue={job.job_type || ''}
              onChange={e => saveField('job_type', e.target.value)}
            >
              <option value="">Select type…</option>
              {JOB_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#a1a1aa] mb-1.5">Notes</label>
            <textarea
              className="w-full bg-[#18181b] border border-[#27272a] px-3 py-2.5 text-sm text-[#fafafa] placeholder-[#3f3f46] focus:border-[#f97316] focus:outline-none resize-none"
              rows={4}
              defaultValue={job.notes || ''}
              placeholder="Panel location, contact info, special instructions…"
              onBlur={e => saveField('notes', e.target.value)}
            />
          </div>
        </section>

        {/* Photos */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">Photos</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1.5 text-[#f97316] border border-[#f97316]/30 hover:border-[#f97316] transition-colors disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
              {uploadingPhoto ? 'Uploading…' : 'Add Photo'}
            </button>
          </div>

          {/* Hidden file input — opens camera/gallery picker on phones */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) handlePhotoUpload(f)
            }}
          />

          {uploadError && (
            <p className="text-xs text-[#ef4444]">{uploadError}</p>
          )}

          {photos.length === 0 ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#27272a] py-10 text-[#a1a1aa] hover:border-[#f97316]/50 hover:text-[#f97316] transition-colors active:scale-[0.99]"
            >
              <Camera className="h-7 w-7" />
              <span className="text-xs uppercase tracking-wider">Tap to add photos from camera or gallery</span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map(photo => (
                <div key={photo.id} className="relative aspect-square">
                  {photo.url && (
                    <img
                      src={photo.url}
                      alt="Job photo"
                      className="w-full h-full object-cover border border-[#27272a]"
                    />
                  )}
                  <button
                    onClick={() => deletePhoto(photo)}
                    className="absolute top-1 right-1 w-7 h-7 bg-black/80 flex items-center justify-center text-red-400 active:scale-90 transition-transform"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {/* Add more photos tile */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border border-dashed border-[#27272a] flex flex-col items-center justify-center gap-1 text-[#3f3f46] hover:border-[#f97316]/50 hover:text-[#f97316] transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="text-[9px] uppercase tracking-wider">Add</span>
              </button>
            </div>
          )}
        </section>

        {/* Saved Calculations */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">Saved Calculations</h2>

          {calculations.length === 0 ? (
            <div className="border border-dashed border-[#27272a] py-8 text-center">
              <Calculator className="h-5 w-5 text-[#3f3f46] mx-auto mb-2" />
              <p className="text-xs text-[#a1a1aa]">No calculations saved to this job yet</p>
              <p className="text-[10px] text-[#3f3f46] mt-1">Save results from any calculator to this job</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {calculations.map(calc => (
                <div key={calc.id} className="bg-[#18181b] border border-[#27272a] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider">
                      {calc.calculator_type}
                    </span>
                    <span className="text-[10px] text-[#a1a1aa]">
                      {new Date(calc.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-[#fafafa] flex flex-wrap gap-x-4">
                    {Object.entries(calc.result).slice(0, 3).map(([k, v]) => (
                      <span key={k} className="text-xs">
                        <span className="text-[#a1a1aa]">{k}:</span>{' '}
                        <strong className="text-[#fafafa]">{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                  {calc.notes && (
                    <p className="text-[11px] text-[#a1a1aa] mt-1.5 border-t border-[#1a1d22] pt-1.5">{calc.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Created date */}
        <p className="text-[10px] text-[#3f3f46] text-center uppercase tracking-wider">
          Created {new Date(job.created_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })}
        </p>

        {/* Delete Job */}
        <div className="pt-2 border-t border-[#27272a]">
          {showDeleteConfirm ? (
            <div className="bg-[#140a0a] border border-red-900/50 p-4 flex flex-col gap-3">
              <p className="text-sm text-[#fafafa] leading-relaxed">
                Delete <strong className="text-white">{job.name}</strong>?{' '}
                All photos and calculations will be permanently removed. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 border border-[#27272a] text-sm text-[#a1a1aa] uppercase tracking-wider font-bold active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteJob}
                  className="flex-1 py-3 bg-red-900/30 border border-red-800/60 text-sm text-red-400 font-bold uppercase tracking-wider active:scale-[0.98]"
                >
                  Delete Job
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-red-900/40 text-sm font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/20 active:scale-[0.99] transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Delete Job
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
