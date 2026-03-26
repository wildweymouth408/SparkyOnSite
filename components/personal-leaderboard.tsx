'use client'

import { useState, useEffect } from 'react'
import { Flame, Trophy } from 'lucide-react'
import { getLeaderboard, FriendProfile } from '@/lib/friends'
import { cn } from '@/lib/utils'

interface PersonalLeaderboardProps {
  currentUserId: string
  currentUserHandle?: string
  onViewProfile?: (handle: string) => void
}

export function PersonalLeaderboard({
  currentUserId,
  currentUserHandle,
  onViewProfile,
}: PersonalLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<FriendProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true)
      try {
        const data = await getLeaderboard(currentUserId)
        setLeaderboard(data)
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(loadLeaderboard, 10000) // Refresh every 10s
    loadLeaderboard()

    return () => clearInterval(interval)
  }, [currentUserId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
      </div>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[#94a3b8]">Add friends to see the leaderboard</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-bold text-white">Friends Leaderboard</h2>

      {/* Mobile View */}
      {isMobile ? (
        <div className="space-y-2">
          {leaderboard.map((friend, index) => {
            const isCurrentUser = friend.handle === currentUserHandle
            return (
              <button
                key={friend.id}
                onClick={() => onViewProfile?.(friend.handle)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-[6px] transition-all duration-200',
                  isCurrentUser
                    ? 'bg-[#f97316]/10 border border-[#f97316]/30'
                    : 'bg-[#1e293b] border border-[#334155] hover:border-[#334155]/60'
                )}
              >
                <div className="w-8 h-8 rounded-full bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#f59e0b]">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-600 text-white truncate">
                    {friend.name || friend.handle}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-[#f97316]/10 rounded-[4px] flex-shrink-0">
                  <Flame className="w-3.5 h-3.5 text-[#f97316]" />
                  <span className="text-sm font-bold text-[#f97316]">
                    {friend.current_streak}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="overflow-hidden border border-[#334155] rounded-[6px]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e293b] border-b border-[#334155]">
                <th className="px-4 py-3 text-left text-xs font-bold text-[#94a3b8] uppercase tracking-wide">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-[#94a3b8] uppercase tracking-wide">
                  Handle / Avatar
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-[#94a3b8] uppercase tracking-wide">
                  Streak
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-[#94a3b8] uppercase tracking-wide">
                  Weekly XP
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-[#94a3b8] uppercase tracking-wide">
                  vs You
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((friend, index) => {
                const isCurrentUser = friend.handle === currentUserHandle
                const streakDiff = friend.current_streak -
                  (leaderboard.find((f) => f.handle === currentUserHandle)?.current_streak || 0)
                const xpDiff = friend.weekly_xp -
                  (leaderboard.find((f) => f.handle === currentUserHandle)?.weekly_xp || 0)

                return (
                  <tr
                    key={friend.id}
                    onClick={() => onViewProfile?.(friend.handle)}
                    className={cn(
                      'border-b border-[#334155] transition-all duration-200 cursor-pointer hover:bg-[#334155]/20',
                      isCurrentUser && 'bg-[#f97316]/5'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f59e0b]/20">
                        <span className="text-sm font-bold text-[#f59e0b]">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#f97316]">
                            {friend.name
                              ? friend.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                              : friend.handle.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-white truncate">
                            {friend.name || friend.handle}
                          </p>
                          <p className="text-xs text-[#94a3b8] truncate">
                            @{friend.handle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-[#f97316]" />
                        <span className="text-sm font-bold text-white">
                          {friend.current_streak}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-600 text-[#cbd5e1]">
                        {friend.weekly_xp}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={cn(
                            'text-xs font-bold',
                            streakDiff > 0
                              ? 'text-[#ef4444]'
                              : streakDiff < 0
                                ? 'text-[#10b981]'
                                : 'text-[#94a3b8]'
                          )}
                        >
                          {streakDiff > 0 ? '+' : ''}{streakDiff}
                        </span>
                        <span className="text-xs text-[#64748b]">
                          {xpDiff > 0 ? '+' : ''}{xpDiff} XP
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
