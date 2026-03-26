'use client'

import { useState } from 'react'
import { Flame, Trophy, Award, Clock, UserMinus, MessageSquare, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Friend } from './types'

interface FriendProfileCardProps {
  friend: Friend
  variant?: 'default' | 'compact'
  onRemove?: (friendId: string) => void
  onMessage?: (friendId: string) => void
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

export function FriendProfileCard({
  friend,
  variant = 'default',
  onRemove,
  onMessage,
  className,
}: FriendProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm',
          className
        )}
      >
        <div className="relative">
          <Avatar className="size-10">
            <AvatarImage src={friend.avatar_url} alt={friend.display_name} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(friend.display_name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              'absolute bottom-0 right-0 size-3 rounded-full border-2 border-card',
              getStatusColor(friend.status)
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{friend.display_name}</p>
          <p className="text-xs text-muted-foreground truncate">@{friend.handle}</p>
        </div>
        <div className="flex items-center gap-1 text-primary">
          <Flame className="size-4" />
          <span className="text-sm font-semibold">{friend.streak}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md',
        isHovered && 'border-primary/50 shadow-md',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Avatar and Status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-12">
              <AvatarImage src={friend.avatar_url} alt={friend.display_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(friend.display_name)}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card',
                getStatusColor(friend.status)
              )}
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{friend.display_name}</h3>
            <p className="text-sm text-muted-foreground">@{friend.handle}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMessage?.(friend.id)}>
              <MessageSquare className="size-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onRemove?.(friend.id)}
              className="text-destructive focus:text-destructive"
            >
              <UserMinus className="size-4 mr-2" />
              Remove Friend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Row */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 px-2 py-2">
          <div className="flex items-center gap-1 text-primary">
            <Flame className="size-4" />
            <span className="text-lg font-bold">{friend.streak}</span>
          </div>
          <span className="text-xs text-muted-foreground">Streak</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 px-2 py-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Trophy className="size-4" />
            <span className="text-lg font-bold">#{friend.rank}</span>
          </div>
          <span className="text-xs text-muted-foreground">Rank</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 px-2 py-2">
          <div className="flex items-center gap-1 text-emerald-500">
            <Award className="size-4" />
            <span className="text-lg font-bold">{friend.badges}</span>
          </div>
          <span className="text-xs text-muted-foreground">Badges</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>Last seen {friend.last_seen}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {friend.weekly_xp} XP this week
        </Badge>
      </div>
    </div>
  )
}
