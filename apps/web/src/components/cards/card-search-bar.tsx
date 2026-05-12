'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function CardSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/cards?q=${encodeURIComponent(query.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by card name, e.g. Charizard…"
        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={isPending || !query.trim()}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
      >
        {isPending ? '…' : '🔍 Search'}
      </button>
    </form>
  )
}
