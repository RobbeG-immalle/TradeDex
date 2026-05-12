import { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { TradeMatches } from '@/components/trade/trade-matches'

export const metadata: Metadata = { title: 'Find Trades – TradeDex' }

export default async function TradePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Trades</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Discover collectors who want your cards or own the cards you need
          </p>
        </div>
        <Suspense fallback={<TradeMatchesSkeleton />}>
          <TradeMatches userId={user?.id ?? null} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

function TradeMatchesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  )
}
