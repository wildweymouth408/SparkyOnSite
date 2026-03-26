'use client'

import { useState, useEffect } from 'react'
import { Flame, Trophy, Badge, Activity as ActivityIcon, Filter } from 'lucide-react'
import { getAcceptedFriends, getFriendActivity, FriendProfile, FriendActivity } from '@/lib/friends'
import { cn } from '@/lib/utils'

interface FriendActivityFeedProps {
  currentUserId: string
  onViewProfile?: (handle: string) => void
}

interface ActivityWithFriend extends FriendActivity {
  friend?: FriendProfile
}

export function FriendActivityFeed({
  currentUserId,
  onViewProfile,
}: FriendActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityWithFriend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'streak' | 'badge' | 'xp'>('all')

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true)
      try {
        const friends = await getAcceptedFriends(currentUserId)
        if (friends.length === 0) {
          setActivities([])
          setIsLoading(false)
          return
        }

        // Load activities for each friend
        const allActivities: ActivityWithFriend[] = []
        for (const friend of friends) {
          const friendActivities = await getFriendActivity(friend.id, 10)
          friendActivities.forEach((activity) => {
            allActivities.push({ ...activity, friend })
          })
        }

        // Sort by most recent
        allActivities.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        setActivities(allActivities.slice(0, 30))
      } catch (error) {
        console.error('Error loading activities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(loadActivities, 10000) // Refresh every 10s
    loadActivities()

    return () => clearInterval(interval)
  }, [currentUserId])

  const filteredActivities = activities.filter((activity) => {
    if (filterType === 'all') return true
    return activity.activity_type.includes(filterType)
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'streak_reached':
        return <Flame className="w-4 h-4 text-[#f97316]" />
      case 'badge_unlocked':
        return <Badge className="w-4 h-4 text-[#8b5cf6]" />
      case 'xp_earned':
        return <Trophy className="w-4 h-4 text-[#f59e0b]" />
      default:
        return <ActivityIcon className="w-4 h-4 text-[#cbd5e1]" />
    }
  }

  const getActivityMessage = (activity: ActivityWithFriend): string => {
    const friend = activity.friend
    const friendName = friend?.name || friend?.handle || 'A friend'

    switch (activity.activity_type) {
      case 'streak_reached':
        return `${friendName} reached a ${activity.activity_data?.streak}-day streak!`
      case 'badge_unlocked':
        return `${friendName} unlocked ${activity.activity_data?.badge_name} badge!`
      case 'xp_earned':
        return `${friendName} earned ${activity.activity_data?.xp} XP`
      case 'calculator_used':
        return `${friendName} used ${activity.activity_data?.calculator_name || 'a calculator'}`
      default:
        return `${friendName} did something awesome!`
    }
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Friend Activity</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'streak', 'badge', 'xp'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={cn(
              'px-3 py-1.5 text-sm font-600 rounded-[4px] transition-all duration-200',
              filterType === type
                ? 'bg-[#f97316] text-white'
                : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
            )}
          >
            <span className="capitalize">{type === 'all' ? 'All' : type}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[#94a3b8]">
            {activities.length === 0
              ? 'Add friends to see their activity'
              : 'No activities match your filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-1 relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f97316] to-[#f97316]/0" />

          {/* Activities */}
          {filteredActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex gap-4 relative"
              onClick={() => activity.friend && onViewProfile?.(activity.friend.handle)}
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center py-3">
                <div className="w-8 h-8 rounded-full bg-[#0f172a] border-2 border-[#f97316] flex items-center justify-center">
                  {getActivityIcon(activity.activity_type)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 py-3 cursor-pointer">
                <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-[6px] hover:border-[#334155]/60 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-white">
                        {getActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-[#94a3b8] mt-1">
                        {formatTime(activity.created_at)}
                      </p>
                    </div>
                    {activity.friend && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-[#0f172a] rounded-[4px] flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-[#f97316]/20 border border-[#f97316]/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-[#f97316]">
                            {activity.friend.name
                              ? activity.friend.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                              : activity.friend.handle.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs font-600 text-[#cbd5e1]">
                          @{activity.friend.handle}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Extra details based on activity type */}
                  {activity.activity_type === 'streak_reached' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#f59e0b]">
                      <Flame className="w-3 h-3" />
                      <span>Keep that streak alive!</span>
                    </div>
                  )}
                  {activity.activity_type === 'badge_unlocked' && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#8b5cf6]">
                      <Badge className="w-3 h-3" />
                      <span>Congratulations!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
