'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  UserPlus,
  Users,
  Clock,
  ArrowUpDown,
  Check,
  X,
  Flame,
  Trophy,
  UserCheck,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { FriendProfileCard } from './FriendProfileCard'
import { AddFriendModal } from './AddFriendModal'
import type { Friend, PendingRequest } from './types'
import { MOCK_FRIENDS, MOCK_PENDING_REQUESTS } from './types'

type SortOption = 'name' | 'streak' | 'rank' | 'recent'

interface FriendListViewProps {
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

function PendingRequestCard({
  request,
  onAccept,
  onDecline,
  onCancel,
}: {
  request: PendingRequest
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onCancel?: (id: string) => void
}) {
  const isIncoming = request.direction === 'incoming'

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={request.avatar_url} alt={request.display_name} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {getInitials(request.display_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{request.display_name}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">@{request.handle}</p>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{request.sent_at}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isIncoming ? (
          <>
            <Badge variant="secondary" className="gap-1 text-xs">
              <UserCheck className="size-3" />
              Incoming
            </Badge>
            <Button size="sm" variant="ghost" onClick={() => onDecline?.(request.id)}>
              <X className="size-4" />
              <span className="sr-only">Decline</span>
            </Button>
            <Button size="sm" onClick={() => onAccept?.(request.id)}>
              <Check className="size-4 mr-1" />
              Accept
            </Button>
          </>
        ) : (
          <>
            <Badge variant="outline" className="gap-1 text-xs">
              <Send className="size-3" />
              Sent
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onCancel?.(request.id)}>
              Cancel Request
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export function FriendListView({ className }: FriendListViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [activeTab, setActiveTab] = useState('friends')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  // Use mock data
  const friends = MOCK_FRIENDS
  const pendingRequests = MOCK_PENDING_REQUESTS

  const filteredFriends = useMemo(() => {
    let filtered = friends.filter(
      (friend) =>
        friend.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.handle.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort based on selected option
    switch (sortBy) {
      case 'streak':
        filtered = [...filtered].sort((a, b) => b.streak - a.streak)
        break
      case 'rank':
        filtered = [...filtered].sort((a, b) => a.rank - b.rank)
        break
      case 'recent':
        // Sort by last seen (would need proper date parsing in real app)
        filtered = [...filtered].sort((a, b) => {
          const aOnline = a.status === 'online'
          const bOnline = b.status === 'online'
          if (aOnline && !bOnline) return -1
          if (!aOnline && bOnline) return 1
          return 0
        })
        break
      case 'name':
      default:
        filtered = [...filtered].sort((a, b) => a.display_name.localeCompare(b.display_name))
        break
    }

    return filtered
  }, [friends, searchQuery, sortBy])

  const incomingRequests = pendingRequests.filter((r) => r.direction === 'incoming')
  const outgoingRequests = pendingRequests.filter((r) => r.direction === 'outgoing')

  const handleAcceptRequest = (requestId: string) => {
    // TODO: Integrate with Supabase
    console.log('Accept request:', requestId)
  }

  const handleDeclineRequest = (requestId: string) => {
    // TODO: Integrate with Supabase
    console.log('Decline request:', requestId)
  }

  const handleCancelRequest = (requestId: string) => {
    // TODO: Integrate with Supabase
    console.log('Cancel request:', requestId)
  }

  const handleRemoveFriend = (friendId: string) => {
    // TODO: Integrate with Supabase
    console.log('Remove friend:', friendId)
  }

  const handleSendFriendRequest = (userId: string) => {
    // TODO: Integrate with Supabase
    console.log('Send friend request to:', userId)
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Friends</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with fellow electricians and track your progress together
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowUpDown className="size-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                <Users className="size-4 mr-2" />
                Name
                {sortBy === 'name' && <Check className="size-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('streak')}>
                <Flame className="size-4 mr-2" />
                Streak
                {sortBy === 'streak' && <Check className="size-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('rank')}>
                <Trophy className="size-4 mr-2" />
                Rank
                {sortBy === 'rank' && <Check className="size-4 ml-auto" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                <Clock className="size-4 mr-2" />
                Recently Active
                {sortBy === 'recent' && <Check className="size-4 ml-auto" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsAddFriendOpen(true)} className="gap-1.5">
            <UserPlus className="size-4" />
            Add Friend
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="friends" className="gap-1.5">
            <Users className="size-4" />
            Friends
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {friends.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="size-4" />
            Pending
            {pendingRequests.length > 0 && (
              <Badge className="ml-1 px-1.5 py-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="mt-0">
          {filteredFriends.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFriends.map((friend) => (
                <FriendProfileCard
                  key={friend.id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                />
              ))}
            </div>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="size-12 opacity-30" />
              <p className="mt-4 text-lg font-medium">No friends found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="size-12 opacity-30" />
              <p className="mt-4 text-lg font-medium">No friends yet</p>
              <p className="text-sm">Add friends to start tracking progress together</p>
              <Button onClick={() => setIsAddFriendOpen(true)} className="mt-4 gap-1.5">
                <UserPlus className="size-4" />
                Add Your First Friend
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-0">
          {pendingRequests.length > 0 ? (
            <div className="space-y-6">
              {incomingRequests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <UserCheck className="size-4" />
                    Incoming Requests ({incomingRequests.length})
                  </h3>
                  <div className="space-y-3">
                    {incomingRequests.map((request) => (
                      <PendingRequestCard
                        key={request.id}
                        request={request}
                        onAccept={handleAcceptRequest}
                        onDecline={handleDeclineRequest}
                      />
                    ))}
                  </div>
                </div>
              )}

              {outgoingRequests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Send className="size-4" />
                    Sent Requests ({outgoingRequests.length})
                  </h3>
                  <div className="space-y-3">
                    {outgoingRequests.map((request) => (
                      <PendingRequestCard
                        key={request.id}
                        request={request}
                        onCancel={handleCancelRequest}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Clock className="size-12 opacity-30" />
              <p className="mt-4 text-lg font-medium">No pending requests</p>
              <p className="text-sm">Friend requests will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Friend Modal */}
      <AddFriendModal
        open={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        onSendRequest={handleSendFriendRequest}
      />
    </div>
  )
}
