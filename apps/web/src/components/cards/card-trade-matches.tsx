import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Props {
  cardId: string
  cardName: string
}

export async function CardTradeMatches({ cardId, cardName }: Props) {
  const supabase = await createClient()

  const [{ data: wantedBy }, { data: ownedBy }] = await Promise.all([
    supabase
      .from('user_cards')
      .select('user_id, profiles(username, avatar_url, rating, rating_count)')
      .eq('card_id', cardId)
      .eq('status', 'WANTED')
      .limit(10),
    supabase
      .from('user_cards')
      .select('user_id, condition, language, quantity, profiles(username, avatar_url, rating, rating_count)')
      .eq('card_id', cardId)
      .eq('status', 'FOR_TRADE')
      .limit(10),
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Users who want this card */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          🔍 Users who want <span className="text-indigo-600 dark:text-indigo-400">{cardName}</span>
        </h2>
        {!wantedBy || wantedBy.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
            <p className="text-3xl mb-2">😴</p>
            <p>No one is currently looking for this card</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {wantedBy.map((item) => {
              const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
              if (!profile) return null
              return (
                <li key={item.user_id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-indigo-400 transition-colors">
                  <Link href={`/profile/${profile.username}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {profile.username[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{profile.username}</span>
                  </Link>
                  <span className="text-xs text-slate-400">{profile.rating_count > 0 ? `${profile.rating}% (${profile.rating_count})` : 'New'}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Users who have this card for trade */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          🔄 Users trading <span className="text-green-600 dark:text-green-400">{cardName}</span>
        </h2>
        {!ownedBy || ownedBy.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
            <p className="text-3xl mb-2">😴</p>
            <p>No one is currently trading this card</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {ownedBy.map((item) => {
              const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
              if (!profile) return null
              return (
                <li key={item.user_id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-green-400 transition-colors">
                  <Link href={`/profile/${profile.username}`} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-sm font-bold text-green-700 dark:text-green-300">
                      {profile.username[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{profile.username}</span>
                  </Link>
                  <div className="text-right text-xs text-slate-400">
                    <p>{item.condition?.replace('_', ' ')}</p>
                    <p>{item.language} · ×{item.quantity}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
