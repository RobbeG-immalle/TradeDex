import { Metadata } from 'next'
import { Suspense } from 'react'
import { CardSearchBar } from '@/components/cards/card-search-bar'
import { CardSearchResults } from '@/components/cards/card-search-results'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = { title: 'Search Cards – TradeDex' }

export default function CardsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; set?: string }>
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Pokémon Cards</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Search the complete Pokémon TCG card database
          </p>
        </div>
        {/* CardSearchBar uses useSearchParams — must be in Suspense */}
        <Suspense fallback={<div className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse mb-6" />}>
          <CardSearchBar />
        </Suspense>
        <Suspense
          key={JSON.stringify(searchParams)}
          fallback={<CardSearchSkeleton />}
        >
          <CardSearchResults searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function CardSearchSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="aspect-[2.5/3.5] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  )
}
