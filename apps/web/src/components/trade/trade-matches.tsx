import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  userId: string | null
}

export async function TradeMatches({ userId }: Props) {
  const supabase = await createClient()

  if (!userId) {
    // Show latest cards for trade to anonymous users
    const { data: forTradeCards } = await supabase
      .from('user_cards')
      .select('*, profiles(username, avatar_url, rating, rating_count)')
      .eq('status', 'FOR_TRADE')
      .order('created_at', { ascending: false })
      .limit(20)

    return (
      <div>
        <div className="mb-6 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-4">
          <p className="text-indigo-800 dark:text-indigo-300 text-sm">
            💡 <strong>Sign in</strong> to see personalized trade matches based on your collection and wish list.
          </p>
        </div>
        <h2 className="text-xl font-bold mb-4">Recently Listed for Trade</h2>
        <LatestForTradeGrid cards={forTradeCards ?? []} />
      </div>
    )
  }

  // For authenticated users: find mutual matches
  // Cards user WANTS that others have FOR_TRADE
  const { data: wantedMatches } = await supabase
    .from('user_cards')
    .select('card_id, card_name, card_image_small')
    .eq('user_id', userId)
    .eq('status', 'WANTED')

  const wantedCardIds = (wantedMatches ?? []).map((c) => c.card_id)

  const { data: matchingOffers } = wantedCardIds.length > 0
    ? await supabase
        .from('user_cards')
        .select('*, profiles(username, avatar_url, rating, rating_count)')
        .in('card_id', wantedCardIds)
        .eq('status', 'FOR_TRADE')
        .neq('user_id', userId)
        .limit(20)
    : { data: [] }

  // Cards user has FOR_TRADE that others WANT
  const { data: ownedForTrade } = await supabase
    .from('user_cards')
    .select('card_id')
    .eq('user_id', userId)
    .eq('status', 'FOR_TRADE')

  const ownedCardIds = (ownedForTrade ?? []).map((c) => c.card_id)

  const { data: interestedUsers } = ownedCardIds.length > 0
    ? await supabase
        .from('user_cards')
        .select('*, profiles(username, avatar_url, rating, rating_count)')
        .in('card_id', ownedCardIds)
        .eq('status', 'WANTED')
        .neq('user_id', userId)
        .limit(20)
    : { data: [] }

  return (
    <div className="space-y-12">
      {/* Cards others have that you want */}
      <section>
        <h2 className="text-xl font-bold mb-2">🎯 Cards you want — available for trade</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {matchingOffers && matchingOffers.length > 0
            ? `${matchingOffers.length} card(s) from your wanted list are available for trade`
            : 'No matches yet — add cards to your Wanted list to find matches'}
        </p>
        {matchingOffers && matchingOffers.length > 0 ? (
          <MatchGrid cards={matchingOffers} />
        ) : (
          <EmptyMatchState message="No one is currently trading your wanted cards" actionHref="/cards" actionLabel="Search & add wanted cards" />
        )}
      </section>

      {/* Users who want your cards */}
      <section>
        <h2 className="text-xl font-bold mb-2">💰 Your cards — users who want them</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {interestedUsers && interestedUsers.length > 0
            ? `${interestedUsers.length} user(s) want cards you have for trade`
            : 'No one is looking for your cards yet'}
        </p>
        {interestedUsers && interestedUsers.length > 0 ? (
          <MatchGrid cards={interestedUsers} />
        ) : (
          <EmptyMatchState message="No one is looking for your cards yet" actionHref="/cards" actionLabel="Browse cards to add for trade" />
        )}
      </section>
    </div>
  )
}

function MatchGrid({ cards }: { cards: Array<Record<string, unknown>> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const profile = Array.isArray(card.profiles) ? card.profiles[0] : card.profiles as Record<string, unknown> | null
        return (
          <div
            key={`${String(card.card_id)}-${i}`}
            className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-indigo-400 transition-colors"
          >
            <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={String(card.card_image_small)}
                alt={String(card.card_name)}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{String(card.card_name)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {String(card.condition ?? '').replace('_', ' ')} · {String(card.language)}
              </p>
              {profile && (
                <Link
                  href={`/profile/${String(profile.username)}`}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  @{String(profile.username)}
                </Link>
              )}
            </div>
            {profile && (
              <Link
                href={`/profile/${String(profile.username)}`}
                className="flex-shrink-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
              >
                View
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

function LatestForTradeGrid({ cards }: { cards: Array<Record<string, unknown>> }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const profile = Array.isArray(card.profiles) ? card.profiles[0] : card.profiles as Record<string, unknown> | null
        return (
          <Link
            key={`${String(card.card_id)}-${i}`}
            href={`/cards/${String(card.card_id)}`}
            className="group"
          >
            <div className="relative aspect-[2.5/3.5] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-lg group-hover:border-indigo-400 transition-all">
              <Image
                src={String(card.card_image_small)}
                alt={String(card.card_name)}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="mt-1.5 px-0.5">
              <p className="text-xs font-semibold truncate">{String(card.card_name)}</p>
              {profile && (
                <p className="text-xs text-slate-400 truncate">@{String(profile.username)}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function EmptyMatchState({
  message,
  actionHref,
  actionLabel,
}: {
  message: string
  actionHref: string
  actionLabel: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
      <p className="mb-3">{message}</p>
      <Link
        href={actionHref}
        className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
      >
        {actionLabel}
      </Link>
    </div>
  )
}
