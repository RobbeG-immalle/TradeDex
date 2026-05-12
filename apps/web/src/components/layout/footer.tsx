import Link from 'next/link'
import { DISCLAIMER, APP_NAME } from '@tradedex/config'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-(--border) bg-(--background)">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
        <p className="container mx-auto max-w-7xl text-xs text-amber-800 dark:text-amber-300 text-center">
          ⚠️ {DISCLAIMER}
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">
              <span className="text-2xl">⚡</span> {APP_NAME}
            </h3>
            <p className="text-sm text-(--muted-foreground)">
              Connecting Pokémon card collectors worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-(--muted-foreground)">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cards" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Search Cards</Link></li>
              <li><Link href="/trade" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Find Trades</Link></li>
              <li><Link href="/auth/register" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-(--muted-foreground)">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="text-(--muted-foreground) hover:text-(--foreground) transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-(--muted-foreground)">
              Notice
            </h4>
            <p className="text-xs text-(--muted-foreground)">
              TradeDex is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company. Pokémon and all related names are trademarks of their respective owners.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-(--border) pt-6 text-center text-xs text-(--muted-foreground)">
          © {new Date().getFullYear()} TradeDex. All rights reserved. Trades occur at users' own risk.
        </div>
      </div>
    </footer>
  )
}
