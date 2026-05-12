'use client'

import { useState, useTransition } from 'react'
import { addCardToCollection } from '@/lib/actions/cards'
import type { PokemonCard, CardStatus, CardCondition, CardLanguage } from '@tradedex/types'
import { CONDITION_LABELS, LANGUAGE_LABELS, STATUS_LABELS } from '@tradedex/utils'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface Props {
  card: PokemonCard
  user: User | null
}

export function AddToCollectionButton({ card, user }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<CardStatus>('COLLECTION')
  const [condition, setCondition] = useState<CardCondition>('NEAR_MINT')
  const [language, setLanguage] = useState<CardLanguage>('EN')
  const [quantity, setQuantity] = useState(1)

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-6 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-3">
          Sign in to add this card to your collection
        </p>
        <Link
          href="/auth/login"
          className="inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  function handleAdd() {
    startTransition(async () => {
      const result = await addCardToCollection(card, { status, condition, language, quantity })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`${card.name} added to your collection!`)
        setShowForm(false)
      }
    })
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
      >
        + Add to Collection
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <h3 className="font-semibold text-sm">Add to Collection</h3>

      {/* Status */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['COLLECTION', 'FOR_TRADE', 'WANTED'] as CardStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                status === s
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as CardCondition)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Object.entries(CONDITION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as CardLanguage)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          max={99}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
        >
          {isPending ? 'Adding…' : 'Add Card'}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
