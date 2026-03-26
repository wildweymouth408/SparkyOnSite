'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, UserPlus, Loader2, X, AtSign, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { MOCK_SEARCH_RESULTS } from './types'

interface SearchResult {
  id: string
  handle: string
  display_name: string
  avatar_url?: string
}

interface AddFriendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendRequest?: (userId: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AddFriendModal({ open, onOpenChange, onSendRequest }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'handle' | 'email'>('handle')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

  // Simulated search with debounce
  const performSearch = useCallback((query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsSearching(true)
    // Simulate API delay
    setTimeout(() => {
      const filtered = MOCK_SEARCH_RESULTS.filter(
        (user) =>
          user.handle.toLowerCase().includes(query.toLowerCase()) ||
          user.display_name.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsSearching(false)
    }, 300)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, performSearch])

  const handleSendRequest = (userId: string) => {
    setSentRequests((prev) => new Set(prev).add(userId))
    onSendRequest?.(userId)
  }

  const handleClear = () => {
    setSearchQuery('')
    setResults([])
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setResults([])
      setSentRequests(new Set())
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Add Friend
          </DialogTitle>
          <DialogDescription>
            Search for friends by handle or email to send them a friend request.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'handle' | 'email')} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="handle" className="gap-1.5">
              <AtSign className="size-4" />
              Handle
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5">
              <Mail className="size-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="handle" className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by @handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Results */}
        <div className="mt-4 min-h-[200px]">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((user) => {
                const isSent = sentRequests.has(user.id)
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3 transition-colors hover:bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={user.avatar_url} alt={user.display_name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials(user.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.display_name}</p>
                        <p className="text-xs text-muted-foreground">@{user.handle}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isSent ? 'secondary' : 'default'}
                      disabled={isSent}
                      onClick={() => handleSendRequest(user.id)}
                      className={cn(isSent && 'opacity-75')}
                    >
                      {isSent ? 'Request Sent' : 'Add Friend'}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Search className="size-8 opacity-50" />
              <p className="mt-2 text-sm">No users found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <UserPlus className="size-8 opacity-50" />
              <p className="mt-2 text-sm">Start typing to search</p>
              <p className="text-xs">Enter at least 2 characters</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
