import { PersonalLeaderboard } from '@/components/social'

export const metadata = {
  title: 'Leaderboard | Sparky',
  description: 'See how you rank against your friends on Sparky',
}

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <PersonalLeaderboard />
      </div>
    </main>
  )
}
