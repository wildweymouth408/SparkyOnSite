              <Phone className="h-4 w-4" />
              <span>{selectedJob.customerPhone}</span>
            </div>
          </div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-[#f97316]" />
                <span className="text-sm text-[#aaa]">Start Date</span>
              </div>
              <span className="font-medium">
                {new Date(selectedJob.startDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35]">
              <div className="flex items-center gap-2 mb-2">
                <HardHat className="h-4 w-4 text-[#f97316]" />
                <span className="text-sm text-[#aaa]">Job Type</span>
              </div>
              <span 
                className="font-medium"
                style={{ color: getJobTypeColor(selectedJob.jobType) }}
              >
                {JOB_TYPES.find(t => t.value === selectedJob.jobType)?.label || selectedJob.jobType}
              </span>
            </div>
            
            <div className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35]">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-[#f97316]" />
                <span className="text-sm text-[#aaa]">Quote Amount</span>
              </div>
              <span className="font-medium">${selectedJob.quoteAmount.toLocaleString()}</span>
            </div>
            
            <div className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35]">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-[#f97316]" />
                <span className="text-sm text-[#aaa]">Estimated Hours</span>
              </div>
              <span className="font-medium">{selectedJob.estimatedHours} hours</span>
            </div>
          </div>

          {/* Notes */}
          {selectedJob.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#aaa] mb-2">Notes</h3>
              <div className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35] whitespace-pre-wrap">
                {selectedJob.notes}
              </div>
            </div>
          )}

          {/* Photos Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#aaa]">Job Photos</h3>
              <span className="text-xs text-[#666]">{jobPhotos.length} photos</span>
            </div>
            
            {jobPhotos.length === 0 ? (
              <div className="border-2 border-dashed border-[#2a2a35] rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-[#444]" />
                <p className="text-sm text-[#aaa] mb-2">No photos yet</p>
                <p className="text-xs text-[#666]">Add photos to document the job progress</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {jobPhotos.map(photo => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Job photo'}
                      className="w-full h-48 object-cover rounded border border-[#2a2a35]"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => window.open(photo.url, '_blank')}
                        className="p-2 bg-white/20 rounded hover:bg-white/30"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="p-2 bg-red-500/20 rounded hover:bg-red-500/30"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    {photo.caption && (
                      <p className="text-xs text-[#aaa] mt-1 truncate">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── JOBS LIST VIEW ────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-[#f0f0f0]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a35]">
        <h1 className="text-lg font-bold">Jobs</h1>
        <button
          onClick={() => setShowNewJobForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-[#ff7b20]"
        >
          <Plus className="h-4 w-4" />
          New Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto p-4">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <HardHat className="h-16 w-16 mb-4 text-[#444]" />
            <h3 className="text-lg font-bold mb-2">No jobs yet</h3>
            <p className="text-sm text-[#aaa] mb-6">Create your first job to get started</p>
            <button
              onClick={() => setShowNewJobForm(true)}
              className="px-6 py-3 bg-[#f97316] text-white font-bold uppercase tracking-wider rounded hover:bg-[#ff7b20]"
            >
              Create First Job
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-[#1a1c22] p-4 rounded border border-[#2a2a35] hover:border-[#f97316] cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <span 
                    className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded"
                    style={{ backgroundColor: getStatusColor(job.status) + '20', color: getStatusColor(job.status) }}
                  >
                    {JOB_STATUSES.find(s => s.value === job.status)?.label || job.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-[#aaa] mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{job.address}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-[#666]" />
                      <span>{job.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#666]" />
                      <span>{new Date(job.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 font-bold">
                    <DollarSign className="h-3 w-3" />
                    <span>${job.quoteAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Job Modal */}
      {showNewJobForm && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={() => setShowNewJobForm(false)}>
          <div 
            className="w-full bg-[#09090b] border-t border-[#2a2a35] p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-[#f0f0f0]">New Job</span>
              <button onClick={() => setShowNewJobForm(false)}>
                <X className="h-5 w-5 text-[#52525b]" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666]"
                  placeholder="e.g., Smith Residence Rewire"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  value={newJob.address}
                  onChange={e => setNewJob({...newJob, address: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666]"
                  placeholder="e.g., 123 Main St, San Jose, CA"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newJob.customerName}
                    onChange={e => setNewJob({...newJob, customerName: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666]"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Job Type
                  </label>
                  <select
                    value={newJob.jobType}
                    onChange={e => setNewJob({...newJob, jobType: e.target.value as any})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white"
                  >
                    {JOB_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="tel"
                    value={newJob.customerPhone}
                    onChange={e => setNewJob({...newJob, customerPhone: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666]"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={newJob.customerEmail}
                    onChange={e => setNewJob({...newJob, customerEmail: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666]"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newJob.startDate}
                    onChange={e => setNewJob({...newJob, startDate: e.target.value})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newJob.estimatedHours}
                    onChange={e => setNewJob({...newJob, estimatedHours: parseInt(e.target.value) || 8})}
                    className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                  Quote Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newJob.quoteAmount}
                  onChange={e => setNewJob({...newJob, quoteAmount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#aaa] mb-1">
                  Notes
                </label>
                <textarea
                  value={newJob.notes}
                  onChange={e => setNewJob({...newJob, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-[#1a1c22] border border-[#2a2a35] rounded text-white placeholder-[#666] min-h-[100px]"
                  placeholder="Job details, special instructions, materials needed..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-[#2a2a35]">
              <button
                onClick={() => setShowNewJobForm(false)}
                className="flex-1 px-4 py-3 border border-[#2a2a35] text-white text-sm font-bold uppercase tracking-wider rounded hover:border-[#52525b]"
              >
                Cancel
              </button>
              <button
                onClick={() => saveJob(newJob)}
                disabled={!newJob.title || !newJob.address || !newJob.customerName}
                className="flex-1 px-4 py-3 bg-[#f97316] text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-[#ff7b20] disabled:opacity-50 disabled:cursor-not-allowed"
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