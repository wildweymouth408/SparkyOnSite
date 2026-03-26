'use client'

import { useState, useEffect } from 'react'
import { Flame, ChevronRight } from 'lucide-react'
import { getLeaderboard, FriendProfile } from '@/lib/friends'

interface LeaderboardWidgetProps {
  userId: string
  onViewLeaderboard?: () => void
  onViewProfile?: (handle: string) => void
}

export function LeaderboardWidget({
  userId,
  onViewLeaderboard,
  onViewProfile,
}: LeaderboardWidgetProps) {
  const [topFriends, setTopFriends] = useState<FriendProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)
      try {
        const data = await getLeaderboard(userId, 3)
        setTopFriends(data.slice(0, 3))
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(loadLeaderboard, 30000) // Refresh every 30s
    loadLeaderboard()

    return () => clearInterval(interval)
  }, [userId])

  if (isLoading) {
    return (
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-[6px]">
        <div className="h-32 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (topFriends.length === 0) {
    return (
      <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-[6px]">
        <h3 className="text-sm font-bold text-white mb-2">Friends Leaderboard</h3>
        <p className="text-xs text-[#94a3b8]">Add friends to see the leaderboard</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-[6px]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-white">Friends Leaderboard</h3>
        <button
          onClick={onViewLeaderboard}
          className="text-xs text-[#f97316] hover:text-[#f97316]/80 font-600 flex items-center gap-1 transition-colors"
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {topFriends.map((friend, index) => (
          <button
            key={friend.id}
            onClick={() => onViewProfile?.(friend.handle)}
            className="w-full flex items-center gap-2 p-2 rounded-[4px] hover:bg-[#0f172a] transition-colors text-left"
          >
            {/* Rank */}
            <div className="w-6 h-6 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-[#f59e0b]">
                {index + 1}
              </span>
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-600 text-white truncate">
                {friend.name || friend.handle}
              </p>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-0.5 px-2 py-0.5 bg-[#f97316]/10 rounded-[3px] flex-shrink-0">
              <Flame className="w-3 h-3 text-[#f97316]" />
              <span className="text-xs font-bold text-[#f97316]">
                {friend.current_streak}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
