// Social feature types for Sparky

export interface Friend {
  id: string
  handle: string
  display_name: string
  avatar_url?: string
  streak: number
  rank: number
  badges: number
  weekly_xp: number
  last_seen: string
  status: 'online' | 'offline' | 'away'
}

export interface PendingRequest {
  id: string
  handle: string
  display_name: string
  avatar_url?: string
  sent_at: string
  direction: 'incoming' | 'outgoing'
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  handle: string
  display_name: string
  avatar_url?: string
  streak: number
  weekly_xp: number
  badges: number
  is_current_user: boolean
}

export interface FriendActivity {
  id: string
  user_id: string
  handle: string
  activity_type: 'badge_earned' | 'streak_milestone' | 'calculator_used' | 'rank_up'
  activity_description: string
  timestamp: string
}

// Mock data for development
export const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    handle: 'sarah_electrical',
    display_name: 'Sarah Chen',
    streak: 14,
    rank: 3,
    badges: 12,
    weekly_xp: 350,
    last_seen: '2 min ago',
    status: 'online',
  },
  {
    id: '2',
    handle: 'mike_watts',
    display_name: 'Mike Johnson',
    streak: 7,
    rank: 8,
    badges: 5,
    weekly_xp: 180,
    last_seen: '1 hour ago',
    status: 'away',
  },
  {
    id: '3',
    handle: 'jenny_sparks',
    display_name: 'Jenny Williams',
    streak: 21,
    rank: 1,
    badges: 18,
    weekly_xp: 520,
    last_seen: '5 min ago',
    status: 'online',
  },
  {
    id: '4',
    handle: 'tom_conductor',
    display_name: 'Tom Davis',
    streak: 3,
    rank: 15,
    badges: 2,
    weekly_xp: 75,
    last_seen: '3 days ago',
    status: 'offline',
  },
  {
    id: '5',
    handle: 'lisa_circuit',
    display_name: 'Lisa Martinez',
    streak: 9,
    rank: 5,
    badges: 8,
    weekly_xp: 290,
    last_seen: '30 min ago',
    status: 'online',
  },
]

export const MOCK_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'p1',
    handle: 'alex_ohm',
    display_name: 'Alex Thompson',
    sent_at: '2 hours ago',
    direction: 'incoming',
  },
  {
    id: 'p2',
    handle: 'chris_volt',
    display_name: 'Chris Parker',
    sent_at: '1 day ago',
    direction: 'incoming',
  },
  {
    id: 'p3',
    handle: 'emma_amp',
    display_name: 'Emma Wilson',
    sent_at: '3 hours ago',
    direction: 'outgoing',
  },
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    user_id: '3',
    handle: 'jenny_sparks',
    display_name: 'Jenny Williams',
    streak: 21,
    weekly_xp: 520,
    badges: 18,
    is_current_user: false,
  },
  {
    rank: 2,
    user_id: 'current',
    handle: 'you',
    display_name: 'You',
    streak: 16,
    weekly_xp: 410,
    badges: 14,
    is_current_user: true,
  },
  {
    rank: 3,
    user_id: '1',
    handle: 'sarah_electrical',
    display_name: 'Sarah Chen',
    streak: 14,
    weekly_xp: 350,
    badges: 12,
    is_current_user: false,
  },
  {
    rank: 4,
    user_id: '5',
    handle: 'lisa_circuit',
    display_name: 'Lisa Martinez',
    streak: 9,
    weekly_xp: 290,
    badges: 8,
    is_current_user: false,
  },
  {
    rank: 5,
    user_id: '2',
    handle: 'mike_watts',
    display_name: 'Mike Johnson',
    streak: 7,
    weekly_xp: 180,
    badges: 5,
    is_current_user: false,
  },
  {
    rank: 6,
    user_id: '4',
    handle: 'tom_conductor',
    display_name: 'Tom Davis',
    streak: 3,
    weekly_xp: 75,
    badges: 2,
    is_current_user: false,
  },
]

export const MOCK_ACTIVITIES: FriendActivity[] = [
  {
    id: 'a1',
    user_id: '3',
    handle: 'jenny_sparks',
    activity_type: 'streak_milestone',
    activity_description: 'reached a 21-day streak',
    timestamp: '1 hour ago',
  },
  {
    id: 'a2',
    user_id: '1',
    handle: 'sarah_electrical',
    activity_type: 'badge_earned',
    activity_description: 'earned the "Voltage Master" badge',
    timestamp: '2 hours ago',
  },
  {
    id: 'a3',
    user_id: '2',
    handle: 'mike_watts',
    activity_type: 'calculator_used',
    activity_description: 'completed 5 calculations today',
    timestamp: '3 hours ago',
  },
  {
    id: 'a4',
    user_id: '5',
    handle: 'lisa_circuit',
    activity_type: 'rank_up',
    activity_description: 'moved up to rank #5',
    timestamp: '5 hours ago',
  },
]

export const MOCK_SEARCH_RESULTS: Array<{ id: string; handle: string; display_name: string }> = [
  { id: 's1', handle: 'david_ampere', display_name: 'David Brown' },
  { id: 's2', handle: 'rachel_resistance', display_name: 'Rachel Green' },
  { id: 's3', handle: 'kevin_kilowatt', display_name: 'Kevin White' },
  { id: 's4', handle: 'maria_megawatt', display_name: 'Maria Lopez' },
]
