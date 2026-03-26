'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Flame, Trophy, Badge, Activity, UserPlus, UserCheck, MessageSquare } from 'lucide-react'
import { getFriendProfile, getAcceptedFriends, getFriendActivity, addFriend, removeFriend, FriendProfile, FriendActivity } from '@/lib/friends'
import { cn } from '@/lib/utils'

interface FriendProfilePageProps {
  handle: string
  currentUserId: string
  currentUserHandle?: string
  onBack?: () => void
}

export function FriendProfilePage({
  handle,
  currentUserId,
  currentUserHandle,
  onBack,
}: FriendProfilePageProps) {
  const [profile, setProfile] = useState<FriendProfile | null>(null)
  const [isFriend, setIsFriend] = useState(false)
  const [activities, setActivities] = useState<FriendActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingFriend, setIsAddingFriend] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const friendProfile = await getFriendProfile(handle)
        if (friendProfile) {
          setProfile(friendProfile)

          // Check if already friends
          const friends = await getAcceptedFriends(currentUserId)
          setIsFriend(friends.some((f) => f.id === friendProfile.id))

          // Load activities
          const friendActivities = await getFriendActivity(friendProfile.id)
          setActivities(friendActivities.slice(0, 5))
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [handle, currentUserId])

  const handleAddFriend = async () => {
    setIsAddingFriend(true)
    try {
      await addFriend(currentUserId, handle)
      setIsFriend(true)
    } catch (error) {
      console.error('Error adding friend:', error)
    } finally {
      setIsAddingFriend(false)
    }
  }

  const handleRemoveFriend = async () => {
    try {
      if (profile) {
        await removeFriend(currentUserId, profile.id)
        setIsFriend(false)
      }
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#f97316]/20 border-t-[#f97316] rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[#94a3b8]">User not found</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[#f97316] hover:bg-[#f97316]/90 text-white font-600 rounded-[6px] transition-all duration-200"
        >
          Go Back
        </button>
      </div>
    )
  }

  const isCurrentUser = profile.handle === currentUserHandle

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[#1e293b] rounded-[6px] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#cbd5e1]" />
        </button>
        <h1 className="text-2xl font-bold text-white flex-1">Profile</h1>
        <div className="w-10 h-10" /> {/* Spacer for alignment */}
      </div>

      {/* Profile Card */}
      <div className="flex flex-col items-center gap-4 p-6 bg-[#1e293b] border border-[#334155] rounded-[8px]">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-[#f97316]/20 border-2 border-[#f97316] flex items-center justify-center">
          <span className="text-3xl font-bold text-[#f97316]">
            {profile.name
              ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
              : profile.handle.slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Name & Handle */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">
            {profile.name || profile.handle}
          </h2>
          <p className="text-sm text-[#94a3b8]">@{profile.handle}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 w-full mt-2">
          <div className="flex flex-col items-center gap-1 p-3 bg-[#0f172a] rounded-[6px]">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#f97316]" />
              <span className="text-2xl font-bold text-[#f97316]">
                {profile.current_streak}
              </span>
            </div>
            <span className="text-xs text-[#94a3b8]">Streak</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-[#0f172a] rounded-[6px]">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-2xl font-bold text-[#f59e0b]">
                #{profile.leaderboard_rank || 'N/A'}
              </span>
            </div>
            <span className="text-xs text-[#94a3b8]">Rank</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 bg-[#0f172a] rounded-[6px]">
            <div className="flex items-center gap-1">
              <Badge className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-2xl font-bold text-[#8b5cf6]">
                {profile.total_badges}
              </span>
            </div>
            <span className="text-xs text-[#94a3b8]">Badges</span>
          </div>
        </div>

        {/* XP Stats */}
        <div className="grid grid-cols-2 gap-3 w-full text-sm">
          <div className="p-3 bg-[#0f172a] rounded-[6px]">
            <p className="text-[#94a3b8] mb-1">Total XP</p>
            <p className="text-lg font-bold text-[#cbd5e1]">{profile.total_xp}</p>
          </div>
          <div className="p-3 bg-[#0f172a] rounded-[6px]">
            <p className="text-[#94a3b8] mb-1">Weekly XP</p>
            <p className="text-lg font-bold text-[#cbd5e1]">{profile.weekly_xp}</p>
          </div>
        </div>

        {/* Action Buttons */}
        {!isCurrentUser && (
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={isFriend ? handleRemoveFriend : handleAddFriend}
              disabled={isAddingFriend}
              className={cn(
                'flex-1 h-10 flex items-center justify-center gap-2 rounded-[6px] font-600 text-sm transition-all duration-200 active:scale-[0.98]',
                isFriend
                  ? 'bg-[#334155] hover:bg-[#334155]/80 text-white'
                  : 'bg-[#f97316] hover:bg-[#f97316]/90 text-white'
              )}
            >
              {isAddingFriend ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isFriend ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Friends</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </>
              )}
            </button>
            <button
              disabled
              className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#334155] text-[#94a3b8] rounded-[6px] font-600 text-sm opacity-50 cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#f97316]" />
          <h3 className="text-lg font-bold text-white">Recent Activities</h3>
        </div>

        {activities.length === 0 ? (
          <p className="text-[#94a3b8] text-sm">No recent activities</p>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-[#1e293b] border border-[#334155] rounded-[6px]"
              >
                <div className="w-1 h-12 bg-[#f97316] rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#cbd5e1]">
                    {activity.activity_type === 'calculator_used' && 'Used a calculator'}
                    {activity.activity_type === 'streak_reached' && `Reached a ${activity.activity_data?.streak}-day streak`}
                    {activity.activity_type === 'badge_unlocked' && `Unlocked ${activity.activity_data?.badge_name} badge`}
                    {activity.activity_type === 'xp_earned' && `Earned ${activity.activity_data?.xp} XP`}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
