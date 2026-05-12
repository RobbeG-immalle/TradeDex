import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NavMenu } from './nav-menu'
import { APP_NAME } from '@tradedex/config'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border) bg-(--background)/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">⚡</span>
          <span className="text-(--primary)">{APP_NAME}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/cards"
            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
          >
            Search Cards
          </Link>
          <Link
            href="/trade"
            className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
          >
            Find Trades
          </Link>
          {user && (
            <Link
              href="/chat"
              className="text-(--muted-foreground) hover:text-(--foreground) transition-colors"
            >
              Messages
            </Link>
          )}
        </nav>

        {/* Right side */}
        <NavMenu user={user} profile={profile} />
      </div>
    </header>
  )
}
