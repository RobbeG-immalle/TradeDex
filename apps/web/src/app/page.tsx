import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span>⚡</span>
              <span>100% free · No payments · Just trades</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Trade Pokémon Cards<br />
              <span className="text-yellow-300">with Collectors</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl">
              Showcase your collection, find cards you need, and connect with collectors worldwide.
              TradeDex never handles payments — just connections.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link
                    href="/cards"
                    className="rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    🔍 Search Cards
                  </Link>
                  <Link
                    href="/trade"
                    className="rounded-xl bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20"
                  >
                    🔄 Find Trades
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="rounded-xl bg-yellow-400 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-yellow-300 transition-colors shadow-lg"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/cards"
                    className="rounded-xl bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-sm hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Browse Cards
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How TradeDex Works</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
            A simple, transparent platform for Pokémon TCG collectors.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📦',
                title: 'Build Your Collection',
                description:
                  'Add your Pokémon cards to your personal collection. Mark them as For Trade or Wanted. Track condition, language, and quantity.',
              },
              {
                icon: '🔍',
                title: 'Discover Matches',
                description:
                  "Find collectors who want your cards or own the cards you're looking for. Our matching system connects the right people.",
              },
              {
                icon: '💬',
                title: 'Chat & Trade',
                description:
                  'Message collectors directly to arrange trades. Leave reviews after trading to build community trust.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 p-8">
            <p className="text-2xl mb-3">⚠️</p>
            <h3 className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-200">
              Important Notice
            </h3>
            <p className="text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
              TradeDex is a connection platform only. We do not process payments, authenticate
              cards, or guarantee any trades. All trades are arranged privately between users at
              their own risk. TradeDex assumes no liability for lost, damaged, or counterfeit cards.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
