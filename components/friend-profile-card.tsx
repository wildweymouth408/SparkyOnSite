'use client'

import { useState } from 'react'
import { UserPlus, UserCheck, Flame, Trophy, Badge, Clock } from 'lucide-react'
import { FriendProfile } from '@/lib/friends'
import { cn } from '@/lib/utils'

interface FriendProfileCardProps {
  friend: FriendProfile
  isCurrentUser?: boolean
  isFriend?: boolean
  isPending?: boolean
  onAddFriend?: () => void
  onRemoveFriend?: () => void
  onViewProfile?: () => void
  loading?: boolean
}

function getInitials(name: string | null, handle: string): string {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return handle.slice(0, 2).toUpperCase()
}

function formatTime(timestamp: string | null): string {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function FriendProfileCard({
  friend,
  isCurrentUser = false,
  isFriend = false,
  isPending = false,
  onAddFriend,
  onRemoveFriend,
  onViewProfile,
  loading = false,
}: FriendProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={onViewProfile}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col gap-3 p-4 bg-[#1e293b] border border-[#334155] rounded-[6px] cursor-pointer transition-all duration-200 hover:border-[#f97316]/30 hover:shadow-md"
    >
      {/* Avatar & Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar Circle */}
          <div className="w-10 h-10 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#f97316]">
              {getInitials(friend.name, friend.handle)}
            </span>
          </div>

          {/* Name & Handle */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-600 text-white truncate">
              {friend.name || friend.handle}
            </p>
            <p className="text-xs text-[#94a3b8] truncate">
              @{friend.handle}
            </p>
          </div>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-1 px-2 py-1 bg-[#f97316]/10 rounded-[4px] flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-[#f97316]" />
          <span className="text-sm font-bold text-[#f97316]">
            {friend.current_streak}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 text-[#cbd5e1]">
          <Trophy className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>#{friend.leaderboard_rank || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1 text-[#cbd5e1]">
          <Badge className="w-3.5 h-3.5 text-[#8b5cf6]" />
          <span>{friend.total_badges} badges</span>
        </div>
      </div>

      {/* Last Seen */}
      <div className="flex items-center gap-1 text-xs text-[#94a3b8]">
        <Clock className="w-3 h-3" />
        <span>Last seen {formatTime(friend.last_seen)}</span>
      </div>

      {/* Action Button */}
      {!isCurrentUser && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isFriend) {
              onRemoveFriend?.()
            } else if (isPending) {
              // Show pending state
            } else {
              onAddFriend?.()
            }
          }}
          disabled={loading || isPending}
          className={cn(
            'w-full h-10 flex items-center justify-center gap-2 rounded-[6px] font-600 text-sm transition-all duration-200 text-white',
            isFriend
              ? 'bg-[#334155] hover:bg-[#334155]/80 active:scale-[0.98]'
              : isPending
                ? 'bg-[#334155] text-[#94a3b8] cursor-default'
                : 'bg-[#f97316] hover:bg-[#f97316]/90 active:scale-[0.98]',
            loading && 'opacity-60'
          )}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isFriend ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Friends</span>
            </>
          ) : isPending ? (
            <>
              <Clock className="w-4 h-4" />
              <span>Pending</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Add Friend</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
