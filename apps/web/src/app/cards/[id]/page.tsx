import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCard } from '@/lib/pokemon/api'
import { createClient } from '@/lib/supabase/server'
import { AddToCollectionButton } from '@/components/cards/add-to-collection-button'
import { CardTradeMatches } from '@/components/cards/card-trade-matches'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const card = await getCard(id)
    return { title: `${card.name} – TradeDex` }
  } catch {
    return { title: 'Card Not Found – TradeDex' }
  }
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params

  let card
  try {
    card = await getCard(id)
  } catch {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Card Image */}
          <div className="flex justify-center">
            <div className="card-shine relative w-full max-w-sm aspect-[2.5/3.5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={card.images.large}
                alt={card.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Card Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">{card.name}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {card.set.name} · #{card.number}
                </p>
              </div>
              {card.rarity && (
                <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {card.rarity}
                </span>
              )}
            </div>

            {/* Details */}
            <dl className="grid grid-cols-2 gap-4 mb-6">
              {card.supertype && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</dt>
                  <dd className="font-medium">{card.supertype}</dd>
                </div>
              )}
              {card.hp && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">HP</dt>
                  <dd className="font-medium">{card.hp}</dd>
                </div>
              )}
              {card.types && card.types.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Element</dt>
                  <dd className="font-medium">{card.types.join(', ')}</dd>
                </div>
              )}
              {card.artist && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Artist</dt>
                  <dd className="font-medium">{card.artist}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Set</dt>
                <dd className="font-medium">{card.set.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Release</dt>
                <dd className="font-medium">{card.set.releaseDate}</dd>
              </div>
            </dl>

            {/* Price estimates */}
            {card.cardmarket?.prices && (
              <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-sm font-semibold mb-2 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Market Reference Prices (Cardmarket)
                </h3>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {card.cardmarket.prices.lowPrice != null && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Low</p>
                      <p className="font-bold text-green-600 dark:text-green-400">
                        €{card.cardmarket.prices.lowPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {card.cardmarket.prices.averageSellPrice != null && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Average</p>
                      <p className="font-bold">
                        €{card.cardmarket.prices.averageSellPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                  {card.cardmarket.prices.trendPrice != null && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Trend</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400">
                        €{card.cardmarket.prices.trendPrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  ⚠️ Prices are estimates only. TradeDex does not facilitate sales.
                </p>
              </div>
            )}

            {/* Add to collection */}
            <AddToCollectionButton card={card} user={user} />
          </div>
        </div>

        {/* Trade Matches */}
        <div className="mt-16">
          <CardTradeMatches cardId={card.id} cardName={card.name} />
        </div>
      </main>
      <Footer />
    </>
  )
}
