'use client'

import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { acceptFriendRequest, declineFriendRequest, getPendingRequests, FriendRelationship } from '@/lib/friends'

interface FriendRequestNotificationProps {
  userId: string
  onRequestHandled?: () => void
}

export function FriendRequestNotification({
  userId,
  onRequestHandled,
}: FriendRequestNotificationProps) {
  const [notifications, setNotifications] = useState<FriendRelationship[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const pending = await getPendingRequests(userId)
        setNotifications(pending)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 5000) // Check every 5s
    return () => clearInterval(interval)
  }, [userId])

  const handleAccept = async (friendshipId: string) => {
    setIsProcessing(true)
    try {
      await acceptFriendRequest(userId, friendshipId)
      setNotifications((prev) => prev.filter((n) => n.id !== friendshipId))
      onRequestHandled?.()
    } catch (error) {
      console.error('Error accepting request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecline = async (friendshipId: string) => {
    setIsProcessing(true)
    try {
      await declineFriendRequest(friendshipId)
      setNotifications((prev) => prev.filter((n) => n.id !== friendshipId))
      onRequestHandled?.()
    } catch (error) {
      console.error('Error declining request:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-center gap-3 p-4 bg-[#1e293b] border border-[#334155] rounded-[6px] shadow-lg animate-in slide-in-from-top-2"
        >
          <Bell className="w-4 h-4 text-[#f97316] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-600 text-white">
              Friend request received
            </p>
            <p className="text-xs text-[#94a3b8]">
              Someone wants to be your friend
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => handleAccept(notification.id)}
              disabled={isProcessing}
              className="px-3 py-1 bg-[#10b981] hover:bg-[#10b981]/90 text-white text-xs font-600 rounded-[4px] transition-all duration-200 disabled:opacity-50"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(notification.id)}
              disabled={isProcessing}
              className="px-2 py-1 hover:bg-[#334155] text-[#cbd5e1] rounded-[4px] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
