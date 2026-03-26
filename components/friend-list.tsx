'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, Clock, Trash2 } from 'lucide-react'
import {
  getAcceptedFriends,
  getPendingRequests,
  getOutgoingRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  FriendProfile,
  FriendRelationship,
} from '@/lib/friends'
import { FriendProfileCard } from './friend-profile-card'
import { AddFriendModal } from './add-friend-modal'
import { cn } from '@/lib/utils'

interface FriendListProps {
  currentUserId: string
  onViewProfile?: (handle: string) => void
}

export function FriendList({ currentUserId, onViewProfile }: FriendListProps) {
  const [activeTab, setActiveTab] = useState<'accepted' | 'requests'>('accepted')
  const [friends, setFriends] = useState<FriendProfile[]>([])
  const [incomingRequests, setIncomingRequests] = useState<FriendRelationship[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRelationship[]>([])
  const [requesters, setRequesters] = useState<Map<string, FriendProfile>>(new Map())
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'streak' | 'rank' | 'name' | 'last-seen'>('streak')
  const [isLoading, setIsLoading] = useState(true)

  const loadFriends = async () => {
    setIsLoading(true)
    try {
      const [acceptedFriends, pending, outgoing] = await Promise.all([
        getAcceptedFriends(currentUserId),
        getPendingRequests(currentUserId),
        getOutgoingRequests(currentUserId),
      ])

      setFriends(acceptedFriends)
      setIncomingRequests(pending)
      setOutgoingRequests(outgoing)

      // For incoming requests, we need to fetch the requester's profile
      if (pending.length > 0) {
        const { supabase } = await import('@/lib/supabase')
        const requesterIds = pending.map((r) => r.user_id_1)
        const { data: requesterProfiles } = await supabase
          .from('users')
          .select('id, handle, name, avatar_url, current_streak, weekly_xp, total_xp, leaderboard_rank, total_badges, last_seen, created_at')
          .in('id', requesterIds)

        const requesterMap = new Map(requesterProfiles?.map((p) => [p.id, p]) || [])
        setRequesters(requesterMap)
      }
    } catch (error) {
      console.error('Error loading friends:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFriends()
  }, [currentUserId])

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await acceptFriendRequest(currentUserId, friendshipId)
      await loadFriends()
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      await declineFriendRequest(friendshipId)
      await loadFriends()
    } catch (error) {
      console.error('Error declining request:', error)
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(currentUserId, friendId)
      await loadFriends()
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const filteredFriends = friends
    .filter((f) =>
      `${f.handle} ${f.name || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'streak':
          return b.current_streak - a.current_streak
        case 'rank':
          return (a.leaderboard_rank || 999) - (b.leaderboard_rank || 999)
        case 'name':
          return (a.name || a.handle).localeCompare(b.name || b.handle)
        case 'last-seen':
          return (
            new Date(b.last_seen || 0).getTime() -
            new Date(a.last_seen || 0).getTime()
          )
        default:
          return 0
      }
    })

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Friends</h1>
        <button
          onClick={() => setIsAddFriendModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 h-10 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-600 rounded-[6px] transition-all duration-200 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Friend</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#334155]">
        <button
          onClick={() => setActiveTab('accepted')}
          className={cn(
            'px-4 py-3 font-600 text-sm transition-all duration-200 border-b-2 -mb-px',
            activeTab === 'accepted'
              ? 'text-[#f97316] border-[#f97316]'
              : 'text-[#94a3b8] border-transparent hover:text-[#cbd5e1]'
          )}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={cn(
            'px-4 py-3 font-600 text-sm transition-all duration-200 border-b-2 -mb-px',
            activeTab === 'requests'
              ? 'text-[#f97316] border-[#f97316]'
              : 'text-[#94a3b8] border-transparent hover:text-[#cbd5e1]'
          )}
        >
          Requests ({incomingRequests.length + outgoingRequests.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'accepted' && (
        <div className="flex flex-col gap-4">
          {/* Search & Sort */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-[#334155] rounded-[6px] text-white placeholder-[#64748b] focus:outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]/20"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-[#1e293b] border border-[#334155] rounded-[6px] text-white text-sm focus:outline-none focus:border-[#f97316]"
            >
              <option value="streak">Sort by Streak</option>
              <option value="rank">Sort by Rank</option>
              <option value="name">Sort by Name</option>
              <option value="last-seen">Sort by Last Seen</option>
            </select>
          </div>

          {/* Friends Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#94a3b8]">
                {searchQuery ? 'No friends match your search' : 'No friends yet. Add one to get started!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="relative group">
                  <FriendProfileCard
                    friend={friend}
                    isFriend={true}
                    onViewProfile={() => onViewProfile?.(friend.handle)}
                    onRemoveFriend={() => handleRemoveFriend(friend.id)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFriend(friend.id)
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-[#ef4444] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="flex flex-col gap-6">
          {/* Incoming Requests */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white">Friend Requests</h3>
            {incomingRequests.length === 0 ? (
              <p className="text-[#94a3b8] text-sm">No incoming requests</p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((request) => {
                  const requester = requesters.get(request.user_id_1)
                  if (!requester) return null

                  return (
                    <div
                      key={request.id}
                      className="flex items-center gap-3 p-4 bg-[#1e293b] border border-[#334155] rounded-[6px]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#f97316]">
                          {requester.name
                            ? requester.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                            : requester.handle.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-600 text-white truncate">
                          {requester.name || requester.handle}
                        </p>
                        <p className="text-xs text-[#94a3b8] truncate">
                          @{requester.handle}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="px-3 py-1 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-xs font-600 rounded-[4px] transition-all duration-200"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="px-3 py-1 bg-[#334155] hover:bg-[#334155]/80 text-white text-xs font-600 rounded-[4px] transition-all duration-200"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Outgoing Requests */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white">Your Requests</h3>
            {outgoingRequests.length === 0 ? (
              <p className="text-[#94a3b8] text-sm">No pending requests</p>
            ) : (
              <div className="space-y-2">
                {outgoingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-[#1e293b] border border-[#334155] rounded-[6px]"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#f59e0b]" />
                      <span className="text-sm text-[#cbd5e1]">
                        User ID: {request.user_id_2.slice(0, 8)}...
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="px-3 py-1 bg-[#334155] hover:bg-[#334155]/80 text-white text-xs font-600 rounded-[4px] transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
        currentUserId={currentUserId}
        onFriendAdded={loadFriends}
      />
    </div>
  )
}
