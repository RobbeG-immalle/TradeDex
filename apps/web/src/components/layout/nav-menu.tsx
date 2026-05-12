'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { signOut } from '@/lib/actions/auth'
import type { User } from '@supabase/supabase-js'
import { generateInitials } from '@tradedex/utils'

interface NavMenuProps {
  user: User | null
  profile: { username: string; avatar_url: string | null } | null
}

export function NavMenu({ user, profile }: NavMenuProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-full p-2 text-(--muted-foreground) hover:bg-(--secondary) hover:text-(--foreground) transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {user && profile ? (
        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${profile.username}`}
            className="flex items-center gap-2 rounded-full bg-(--secondary) px-3 py-1.5 text-sm font-medium hover:bg-(--border) transition-colors"
          >
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--primary) text-xs text-(--primary-foreground) font-bold">
                {generateInitials(profile.username)}
              </span>
            )}
            <span>{profile.username}</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-1.5 text-sm text-(--muted-foreground) hover:text-(--foreground) transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-(--foreground) hover:bg-(--secondary) transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>
      )}
    </div>
  )
}
