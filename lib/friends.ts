import { supabase } from '@/lib/supabase'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface FriendProfile {
  id: string
  handle: string
  name: string | null
  avatar_url: string | null
  current_streak: number
  weekly_xp: number
  total_xp: number
  leaderboard_rank: number | null
  total_badges: number
  last_seen: string | null
  created_at: string
}

export interface FriendRelationship {
  id: string
  user_id_1: string
  user_id_2: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  accepted_at: string | null
  requester_id: string
}

export interface FriendActivity {
  id: string
  user_id: string
  activity_type: 'calculator_used' | 'streak_reached' | 'badge_unlocked' | 'xp_earned'
  activity_data: Record<string, any>
  created_at: string
}

// ─── Friend Management ──────────────────────────────────────────────────────

export async function addFriend(currentUserId: string, targetHandle: string) {
  try {
    // Get target user by handle
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('handle', targetHandle)
      .single()

    if (userError) throw new Error('User not found')

    // Check if friendship already exists
    const { data: existing } = await supabase
      .from('friends')
      .select('*')
      .or(
        `and(user_id_1.eq.${currentUserId},user_id_2.eq.${targetUser.id}),and(user_id_1.eq.${targetUser.id},user_id_2.eq.${currentUserId})`
      )
      .single()

    if (existing) {
      if (existing.status === 'accepted') throw new Error('Already friends')
      if (existing.status === 'pending') throw new Error('Request already sent')
    }

    // Create friendship request
    const { data: friendship, error: friendError } = await supabase
      .from('friends')
      .insert({
        user_id_1: currentUserId,
        user_id_2: targetUser.id,
        status: 'pending',
        requester_id: currentUserId,
      })
      .select()
      .single()

    if (friendError) throw friendError

    return { success: true, friendship }
  } catch (error) {
    console.error('Error adding friend:', error)
    throw error
  }
}

export async function acceptFriendRequest(currentUserId: string, friendshipId: string) {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted', accepted_at: new Date().toISOString() })
      .eq('id', friendshipId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error accepting friend request:', error)
    throw error
  }
}

export async function declineFriendRequest(friendshipId: string) {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendshipId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error declining friend request:', error)
    throw error
  }
}

export async function removeFriend(currentUserId: string, friendId: string) {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(
        `and(user_id_1.eq.${currentUserId},user_id_2.eq.${friendId}),and(user_id_1.eq.${friendId},user_id_2.eq.${currentUserId})`
      )

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error removing friend:', error)
    throw error
  }
}

export async function getAcceptedFriends(userId: string): Promise<FriendProfile[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('user_id_1, user_id_2')
      .eq('status', 'accepted')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)

    if (error) throw error

    const friendIds = data
      .map((f) => (f.user_id_1 === userId ? f.user_id_2 : f.user_id_1))

    if (friendIds.length === 0) return []

    const { data: friends, error: friendsError } = await supabase
      .from('users')
      .select('id, handle, name, avatar_url, current_streak, weekly_xp, total_xp, leaderboard_rank, total_badges, last_seen, created_at')
      .in('id', friendIds)

    if (friendsError) throw friendsError
    return friends || []
  } catch (error) {
    console.error('Error fetching friends:', error)
    throw error
  }
}

export async function getPendingRequests(userId: string): Promise<FriendRelationship[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id_2', userId)
      .eq('status', 'pending')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching pending requests:', error)
    throw error
  }
}

export async function getOutgoingRequests(userId: string): Promise<FriendRelationship[]> {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id_1', userId)
      .eq('status', 'pending')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching outgoing requests:', error)
    throw error
  }
}

export async function searchUsers(query: string): Promise<FriendProfile[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, handle, name, avatar_url, current_streak, weekly_xp, total_xp, leaderboard_rank, total_badges, last_seen, created_at')
      .or(`handle.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching users:', error)
    throw error
  }
}

export async function getFriendProfile(handle: string): Promise<FriendProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, handle, name, avatar_url, current_streak, weekly_xp, total_xp, leaderboard_rank, total_badges, last_seen, created_at')
      .eq('handle', handle)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching friend profile:', error)
    return null
  }
}

export async function getLeaderboard(userId: string, limit = 50): Promise<FriendProfile[]> {
  try {
    // Get all accepted friends
    const friendIds = await getAcceptedFriends(userId).then((friends) => friends.map((f) => f.id))

    if (friendIds.length === 0) return []

    // Get leaderboard for these friends, sorted by streak
    const { data, error } = await supabase
      .from('users')
      .select('id, handle, name, avatar_url, current_streak, weekly_xp, total_xp, leaderboard_rank, total_badges, last_seen, created_at')
      .in('id', friendIds)
      .order('current_streak', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    throw error
  }
}

export async function getFriendActivity(userId: string, limit = 20): Promise<FriendActivity[]> {
  try {
    const { data, error } = await supabase
      .from('friend_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching friend activity:', error)
    throw error
  }
}

export async function logActivity(userId: string, activityType: string, data: Record<string, any>) {
  try {
    const { error } = await supabase
      .from('friend_activity')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: data,
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}
