'use client'

import { useState } from 'react'
import {
  Trophy,
  Flame,
  Award,
  TrendingUp,
  Crown,
  Medal,
  Zap,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { LeaderboardEntry, FriendActivity } from './types'
import { MOCK_LEADERBOARD, MOCK_ACTIVITIES } from './types'

type TimeFrame = 'weekly' | 'monthly' | 'alltime'
type RankMetric = 'xp' | 'streak' | 'badges'

interface PersonalLeaderboardProps {
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="size-5 text-amber-400" />
    case 2:
      return <Medal className="size-5 text-zinc-400" />
    case 3:
      return <Medal className="size-5 text-amber-600" />
    default:
      return null
  }
}

function getRankChange(): { direction: 'up' | 'down' | 'same'; amount: number } {
  // Simulated rank change data
  const random = Math.random()
  if (random < 0.3) return { direction: 'up', amount: Math.ceil(Math.random() * 3) }
  if (random < 0.5) return { direction: 'down', amount: Math.ceil(Math.random() * 2) }
  return { direction: 'same', amount: 0 }
}

function LeaderboardRow({
  entry,
  showRankChange = false,
}: {
  entry: LeaderboardEntry
  showRankChange?: boolean
}) {
  const rankChange = showRankChange ? getRankChange() : null
  const isTopThree = entry.rank <= 3

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border px-4 py-3 transition-all',
        entry.is_current_user
          ? 'border-primary/50 bg-primary/5 shadow-sm'
          : 'bg-card hover:border-primary/30',
        isTopThree && !entry.is_current_user && 'border-amber-500/20 bg-amber-500/5'
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-10">
        {getRankIcon(entry.rank) || (
          <span
            className={cn(
              'text-lg font-bold',
              entry.is_current_user ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Rank Change Indicator */}
      {showRankChange && rankChange && (
        <div className="w-8 flex items-center justify-center">
          {rankChange.direction === 'up' && (
            <div className="flex items-center text-emerald-500">
              <ChevronUp className="size-4" />
              <span className="text-xs font-medium">{rankChange.amount}</span>
            </div>
          )}
          {rankChange.direction === 'down' && (
            <div className="flex items-center text-red-500">
              <ChevronDown className="size-4" />
              <span className="text-xs font-medium">{rankChange.amount}</span>
            </div>
          )}
          {rankChange.direction === 'same' && (
            <Minus className="size-4 text-muted-foreground" />
          )}
        </div>
      )}

      {/* Avatar and Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="size-10">
          <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
          <AvatarFallback
            className={cn(
              'text-sm font-medium',
              entry.is_current_user
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/10 text-primary'
            )}
          >
            {getInitials(entry.display_name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p
            className={cn(
              'font-medium truncate',
              entry.is_current_user ? 'text-primary' : 'text-foreground'
            )}
          >
            {entry.display_name}
            {entry.is_current_user && (
              <span className="ml-1.5 text-xs text-muted-foreground">(You)</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground truncate">@{entry.handle}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1 text-primary">
          <Flame className="size-4" />
          <span className="text-sm font-semibold">{entry.streak}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-emerald-500">
          <Award className="size-4" />
          <span className="text-sm font-semibold">{entry.badges}</span>
        </div>
        <Badge
          variant={entry.is_current_user ? 'default' : 'secondary'}
          className="min-w-[4rem] justify-center"
        >
          {entry.weekly_xp} XP
        </Badge>
      </div>
    </div>
  )
}

function ActivityFeed({ activities }: { activities: FriendActivity[] }) {
  const getActivityIcon = (type: FriendActivity['activity_type']) => {
    switch (type) {
      case 'badge_earned':
        return <Award className="size-4 text-emerald-500" />
      case 'streak_milestone':
        return <Flame className="size-4 text-primary" />
      case 'calculator_used':
        return <Zap className="size-4 text-amber-500" />
      case 'rank_up':
        return <TrendingUp className="size-4 text-blue-500" />
      default:
        return <Zap className="size-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/30"
        >
          <div className="mt-0.5">{getActivityIcon(activity.activity_type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium text-foreground">@{activity.handle}</span>{' '}
              <span className="text-muted-foreground">{activity.activity_description}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function PersonalLeaderboard({ className }: PersonalLeaderboardProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly')
  const [rankMetric, setRankMetric] = useState<RankMetric>('xp')

  // Use mock data
  const leaderboard = MOCK_LEADERBOARD
  const activities = MOCK_ACTIVITIES

  // Find current user's stats
  const currentUserEntry = leaderboard.find((e) => e.is_current_user)
  const currentUserRank = currentUserEntry?.rank || 0

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="size-6 text-amber-500" />
          Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how you stack up against your friends
        </p>
      </div>

      {/* Your Rank Card */}
      {currentUserEntry && (
        <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 border-2 border-primary">
                  <span className="text-2xl font-bold text-primary">#{currentUserRank}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Current Rank</p>
                  <p className="text-lg font-semibold text-foreground">
                    {currentUserRank === 1
                      ? 'You&apos;re in the lead!'
                      : currentUserRank <= 3
                        ? 'Top 3 - Keep it up!'
                        : `${currentUserRank - 1} spot${currentUserRank - 1 > 1 ? 's' : ''} from the podium`}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <Flame className="size-5" />
                    <span className="text-xl font-bold">{currentUserEntry.streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Zap className="size-5" />
                    <span className="text-xl font-bold">{currentUserEntry.weekly_xp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Weekly XP</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-500">
                    <Award className="size-5" />
                    <span className="text-xl font-bold">{currentUserEntry.badges}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Frame and Metric Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <Tabs value={timeFrame} onValueChange={(v) => setTimeFrame(v as TimeFrame)}>
          <TabsList>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rank by:</span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={rankMetric === 'xp' ? 'default' : 'outline'}
              onClick={() => setRankMetric('xp')}
              className="gap-1"
            >
              <Zap className="size-3.5" />
              XP
            </Button>
            <Button
              size="sm"
              variant={rankMetric === 'streak' ? 'default' : 'outline'}
              onClick={() => setRankMetric('streak')}
              className="gap-1"
            >
              <Flame className="size-3.5" />
              Streak
            </Button>
            <Button
              size="sm"
              variant={rankMetric === 'badges' ? 'default' : 'outline'}
              onClick={() => setRankMetric('badges')}
              className="gap-1"
            >
              <Award className="size-3.5" />
              Badges
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Leaderboard */}
        <div className="lg:col-span-2 space-y-3">
          {leaderboard.map((entry) => (
            <LeaderboardRow key={entry.user_id} entry={entry} showRankChange={timeFrame !== 'alltime'} />
          ))}
        </div>

        {/* Activity Feed Sidebar */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>What your friends have been up to</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
