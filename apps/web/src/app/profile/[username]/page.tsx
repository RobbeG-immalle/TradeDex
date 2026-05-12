import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { UserCardGrid } from '@/components/profile/user-card-grid'
import { ReviewList } from '@/components/profile/review-list'
import { ReportButton } from '@/components/profile/report-button'
import { StartChatButton } from '@/components/chat/start-chat-button'
import { formatDate, generateInitials } from '@tradedex/utils'
import type { Profile } from '@tradedex/types'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return { title: `${username} – TradeDex` }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  const isOwner = currentUser?.id === profile.id

  // Stats
  const [{ count: forTradeCount }, { count: wantedCount }, { count: collectionCount }] =
    await Promise.all([
      supabase
        .from('user_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('status', 'FOR_TRADE'),
      supabase
        .from('user_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('status', 'WANTED'),
      supabase
        .from('user_cards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('status', 'COLLECTION'),
    ])

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                {generateInitials(profile.username)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              {profile.rating_count > 0 && (
                <span className="rounded-full bg-green-100 dark:bg-green-900/40 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-300">
                  ✓ {profile.rating}% positive ({profile.rating_count} reviews)
                </span>
              )}
            </div>
            {profile.bio && (
              <p className="text-slate-600 dark:text-slate-300 mb-2">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              {profile.location && <span>📍 {profile.location}</span>}
              <span>📅 Member since {formatDate(profile.created_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isOwner ? (
              <Link
                href="/profile/edit"
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Edit Profile
              </Link>
            ) : currentUser ? (
              <>
                <StartChatButton targetUserId={profile.id} targetUsername={profile.username} />
                <ReportButton reportedUserId={profile.id} reportedUsername={profile.username} />
              </>
            ) : null}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'For Trade', count: forTradeCount ?? 0, color: 'green', href: '#for-trade' },
            { label: 'Wanted', count: wantedCount ?? 0, color: 'blue', href: '#wanted' },
            { label: 'Collection', count: collectionCount ?? 0, color: 'gray', href: '#collection' },
          ].map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center hover:border-indigo-400 transition-colors"
            >
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </a>
          ))}
        </div>

        {/* Cards */}
        <UserCardGrid userId={profile.id} isOwner={isOwner} />

        {/* Reviews */}
        <div className="mt-12">
          <ReviewList reviewedUserId={profile.id} currentUserId={currentUser?.id ?? null} />
        </div>
      </main>
      <Footer />
    </>
  )
}
