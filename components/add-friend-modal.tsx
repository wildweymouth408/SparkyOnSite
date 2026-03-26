'use client'

import { useState, useEffect } from 'react'
import { X, Search, Loader2 } from 'lucide-react'
import { searchUsers, addFriend, FriendProfile } from '@/lib/friends'
import { FriendProfileCard } from './friend-profile-card'

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: string
  onFriendAdded?: () => void
}

export function AddFriendModal({
  isOpen,
  onClose,
  currentUserId,
  onFriendAdded,
}: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FriendProfile[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setIsSearching(true)
        setErrorMessage('')
        try {
          const results = await searchUsers(searchQuery)
          setSearchResults(results.filter((u) => u.id !== currentUserId))
        } catch (error) {
          setErrorMessage('Failed to search users')
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, currentUserId])

  const handleAddFriend = async (targetHandle: string) => {
    setLoadingUserId(targetHandle)
    try {
      await addFriend(currentUserId, targetHandle)
      setSearchQuery('')
      setSearchResults([])
      setErrorMessage('')
      onFriendAdded?.()
    } catch (error) {
      setErrorMessage((error as Error).message || 'Failed to add friend')
    } finally {
      setLoadingUserId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-[#334155] rounded-[8px] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
          <h2 className="text-lg font-bold text-white">Add Friend</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1e293b] rounded-[4px] transition-colors"
          >
            <X className="w-5 h-5 text-[#94a3b8]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Search Input */}
          <div className="mb-4 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by handle or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-[#334155] rounded-[6px] text-white placeholder-[#64748b] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20"
              autoFocus
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-[#7f1d1d] border border-[#dc2626] rounded-[6px] text-sm text-[#fecaca]">
              {errorMessage}
            </div>
          )}

          {/* Search Results */}
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-[#f97316] animate-spin" />
            </div>
          )}

          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div className="py-8 text-center text-[#94a3b8]">
              <p>No users found</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-[#1e293b] rounded-[6px]">
                  <div className="w-10 h-10 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#f97316]">
                      {user.name
                        ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                        : user.handle.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-white truncate">
                      {user.name || user.handle}
                    </p>
                    <p className="text-xs text-[#94a3b8] truncate">
                      @{user.handle}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.handle)}
                    disabled={loadingUserId === user.handle}
                    className="px-4 py-2 bg-[#f97316] hover:bg-[#f97316]/90 text-white text-sm font-600 rounded-[6px] transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loadingUserId === user.handle ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!isSearching && searchQuery === '' && (
            <div className="py-8 text-center text-[#94a3b8]">
              <p>Search for a friend by handle or email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
