'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Flame,
  Trophy,
  Award,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare,
  UserMinus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MOCK_FRIENDS, MOCK_ACTIVITIES } from '@/components/social/types'
import type { Friend, FriendActivity } from '@/components/social/types'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusColor(status: Friend['status']): string {
  switch (status) {
    case 'online':
      return 'bg-green-500'
    case 'away':
      return 'bg-amber-500'
    case 'offline':
      return 'bg-zinc-500'
    default:
      return 'bg-zinc-500'
  }
}

function getStatusText(status: Friend['status']): string {
  switch (status) {
    case 'online':
      return 'Online now'
    case 'away':
      return 'Away'
    case 'offline':
      return 'Offline'
    default:
      return 'Unknown'
  }
}

function getActivityIcon(type: FriendActivity['activity_type']) {
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

export default function FriendProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = use(params)
  
  // Find friend by handle (mock data)
  const friend = MOCK_FRIENDS.find(
    (f) => f.handle.toLowerCase() === handle.toLowerCase()
  )

  if (!friend) {
    notFound()
  }

  // Get activities for this friend
  const friendActivities = MOCK_ACTIVITIES.filter(
    (a) => a.handle === friend.handle
  )

  // Mock stats data
  const stats = {
    calculationsThisWeek: 47,
    totalCalculations: 1248,
    memberSince: 'March 2025',
    favoriteCalculator: 'Voltage Drop',
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/friends">
          <Button variant="ghost" size="sm" className="mb-6 gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Friends
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="relative">
            <Avatar className="size-24 border-4 border-background shadow-lg">
              <AvatarImage src={friend.avatar_url} alt={friend.display_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {getInitials(friend.display_name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute bottom-1 right-1 size-5 rounded-full border-4 border-background',
                getStatusColor(friend.status)
              )}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {friend.display_name}
                </h1>
                <p className="text-muted-foreground">@{friend.handle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      getStatusColor(friend.status)
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {getStatusText(friend.status)}
                    {friend.status !== 'online' && ` · Last seen ${friend.last_seen}`}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageSquare className="size-4" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <UserMinus className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Flame className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {friend.streak}
                  </p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Trophy className="size-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    #{friend.rank}
                  </p>
                  <p className="text-xs text-muted-foreground">Rank</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Award className="size-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {friend.badges}
                  </p>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Zap className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {friend.weekly_xp}
                  </p>
                  <p className="text-xs text-muted-foreground">XP This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Activity Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Activity Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Calculations this week
                </span>
                <span className="font-medium">
                  {stats.calculationsThisWeek}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Total calculations
                </span>
                <span className="font-medium">{stats.totalCalculations}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">
                  Favorite calculator
                </span>
                <Badge variant="secondary">{stats.favoriteCalculator}</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  Member since
                </span>
                <span className="font-medium">{stats.memberSince}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friendActivities.length > 0 ? (
                <div className="space-y-3">
                  {friendActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3"
                    >
                      <div className="mt-0.5">
                        {getActivityIcon(activity.activity_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          {activity.activity_description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="size-3" />
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <TrendingUp className="size-8 opacity-30" />
                  <p className="mt-2 text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
