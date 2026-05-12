import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { removeUserCard } from '@/lib/actions/cards'
import { CONDITION_LABELS, LANGUAGE_LABELS, STATUS_LABELS } from '@tradedex/utils'
import type { UserCard } from '@tradedex/types'

interface Props {
  userId: string
  isOwner: boolean
}

export async function UserCardGrid({ userId, isOwner }: Props) {
  const supabase = await createClient()

  const { data: cards } = await supabase
    .from('user_cards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const forTrade = cards?.filter((c) => c.status === 'FOR_TRADE') ?? []
  const wanted = cards?.filter((c) => c.status === 'WANTED') ?? []
  const collection = cards?.filter((c) => c.status === 'COLLECTION') ?? []

  return (
    <div className="space-y-10">
      <CardSection
        id="for-trade"
        title="🟢 For Trade"
        cards={forTrade}
        isOwner={isOwner}
        emptyMessage="No cards listed for trade yet"
      />
      <CardSection
        id="wanted"
        title="🔵 Wanted"
        cards={wanted}
        isOwner={isOwner}
        emptyMessage="No wanted cards listed yet"
      />
      <CardSection
        id="collection"
        title="⚪ Collection"
        cards={collection}
        isOwner={isOwner}
        emptyMessage="No collection cards added yet"
      />
    </div>
  )
}

function CardSection({
  id,
  title,
  cards,
  isOwner,
  emptyMessage,
}: {
  id: string
  title: string
  cards: UserCard[]
  isOwner: boolean
  emptyMessage: string
}) {
  return (
    <section id={id}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {cards.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
          {isOwner ? (
            <>
              <p className="mb-3">{emptyMessage}</p>
              <Link
                href="/cards"
                className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Search & Add Cards
              </Link>
            </>
          ) : (
            <p>{emptyMessage}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {cards.map((card) => (
            <UserCardItem key={card.id} card={card} isOwner={isOwner} />
          ))}
        </div>
      )}
    </section>
  )
}

function UserCardItem({ card, isOwner }: { card: UserCard; isOwner: boolean }) {
  return (
    <div className="group relative">
      <Link href={`/cards/${card.card_id}`}>
        <div className="card-shine relative aspect-[2.5/3.5] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-lg group-hover:border-indigo-400 transition-all duration-200">
          <Image
            src={card.card_image_small}
            alt={card.card_name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {/* Quantity badge */}
          {card.quantity > 1 && (
            <span className="absolute top-1.5 right-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-xs font-bold text-white">
              ×{card.quantity}
            </span>
          )}
        </div>
      </Link>
      <div className="mt-1.5 px-0.5">
        <p className="text-xs font-semibold truncate">{card.card_name}</p>
        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
          {card.condition && (
            <span className="text-xs text-slate-400">{CONDITION_LABELS[card.condition]}</span>
          )}
          {card.language !== 'EN' && (
            <span className="text-xs text-slate-400">{LANGUAGE_LABELS[card.language]}</span>
          )}
        </div>
      </div>
      {isOwner && (
        <form
          action={async () => {
            'use server'
            await removeUserCard(card.id)
          }}
          className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            type="submit"
            className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            title="Remove card"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}
