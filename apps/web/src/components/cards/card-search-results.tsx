import Image from 'next/image'
import Link from 'next/link'
import { searchCards } from '@/lib/pokemon/api'
import type { PokemonCard } from '@tradedex/types'

interface CardSearchResultsProps {
  searchParams: Promise<{ q?: string; page?: string; set?: string }>
}

export async function CardSearchResults({ searchParams }: CardSearchResultsProps) {
  const { q, page: pageStr } = await searchParams
  const page = Number(pageStr ?? '1')

  if (!q) {
    return (
      <div className="mt-12 text-center text-slate-400">
        <p className="text-6xl mb-4">🃏</p>
        <p className="text-xl font-semibold">Search for any Pokémon card</p>
        <p className="text-sm mt-2">Type a card name above to get started</p>
      </div>
    )
  }

  try {
    const results = await searchCards(q, page, 20)

    if (results.count === 0) {
      return (
        <div className="mt-12 text-center text-slate-400">
          <p className="text-5xl mb-4">😔</p>
          <p className="text-xl font-semibold">No cards found for &quot;{q}&quot;</p>
          <p className="text-sm mt-2">Try a different search term</p>
        </div>
      )
    }

    return (
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Found {results.totalCount.toLocaleString()} cards for &quot;{q}&quot;
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.data.map((card) => (
            <PokemonCardThumbnail key={card.id} card={card} />
          ))}
        </div>
        {/* Pagination */}
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/cards?q=${encodeURIComponent(q)}&page=${page - 1}`}
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              ← Previous
            </Link>
          )}
          <span className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
            Page {page}
          </span>
          {results.count === 20 && (
            <Link
              href={`/cards?q=${encodeURIComponent(q)}&page=${page + 1}`}
              className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    )
  } catch {
    return (
      <div className="mt-12 text-center text-red-500">
        <p className="text-xl font-semibold">Failed to load cards</p>
        <p className="text-sm mt-2">Please try again in a moment</p>
      </div>
    )
  }
}

function PokemonCardThumbnail({ card }: { card: PokemonCard }) {
  return (
    <Link href={`/cards/${card.id}`} className="group">
      <div className="card-shine relative aspect-[2.5/3.5] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm group-hover:shadow-lg group-hover:border-indigo-400 transition-all duration-200">
        <Image
          src={card.images.small}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="mt-2 px-1">
        <p className="text-xs font-semibold truncate">{card.name}</p>
        <p className="text-xs text-slate-400 truncate">{card.set.name}</p>
      </div>
    </Link>
  )
}
