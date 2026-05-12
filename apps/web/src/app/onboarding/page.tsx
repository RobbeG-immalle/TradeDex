import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Welcome to TradeDex' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-3xl font-extrabold mb-2">Welcome to TradeDex!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Your account is ready. Let&apos;s get you started.
          </p>

          {/* Important disclaimer */}
          <div className="mb-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-5 text-left">
            <h2 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
              ⚠️ Before you start — please read
            </h2>
            <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1.5 list-disc list-inside">
              <li>TradeDex only connects collectors — we do NOT process payments</li>
              <li>We do NOT authenticate, value, or guarantee any cards</li>
              <li>All trades are arranged privately at your own risk</li>
              <li>TradeDex has no liability for lost, damaged, or fake cards</li>
              <li>Always use trusted shipping and meet in safe public places</li>
            </ul>
          </div>

          {/* Steps */}
          <div className="text-left space-y-4 mb-8">
            {[
              { step: '1', icon: '🔍', title: 'Search for cards', desc: 'Browse the full Pokémon TCG database', href: '/cards' },
              { step: '2', icon: '📦', title: 'Build your collection', desc: 'Mark cards as For Trade, Wanted, or Collection', href: '/cards' },
              { step: '3', icon: '🔄', title: 'Find trade matches', desc: 'See who wants your cards and owns yours', href: '/trade' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-sm font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.icon} {item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/cards"
            className="block w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-center font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Start exploring cards →
          </Link>
        </div>
      </div>
    </div>
  )
}
