import { FriendListView } from '@/components/social'

export const metadata = {
  title: 'Friends | Sparky',
  description: 'Connect with fellow electricians and track your progress together',
}

export default function FriendsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <FriendListView />
      </div>
    </main>
  )
}
