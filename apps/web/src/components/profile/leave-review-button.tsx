'use client'

import { useState, useTransition } from 'react'
import { submitReview } from '@/lib/actions/social'
import type { ReviewType } from '@tradedex/types'
import { toast } from 'sonner'

interface Props {
  reviewedUserId: string
}

export function LeaveReviewButton({ reviewedUserId }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<ReviewType>('POSITIVE')
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitReview(reviewedUserId, type, comment || null)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Review submitted!')
        setShowForm(false)
      }
    })
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
      >
        Leave Review
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 w-full max-w-md space-y-4">
      <h3 className="font-semibold">Leave a Review</h3>
      <div className="flex gap-2">
        {(['POSITIVE', 'NEUTRAL', 'NEGATIVE'] as ReviewType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
              type === t
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-600'
            }`}
          >
            {t === 'POSITIVE' ? '👍' : t === 'NEGATIVE' ? '👎' : '😐'}
            <span className="ml-1 hidden sm:inline">{t.charAt(0) + t.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment (optional)…"
        rows={3}
        maxLength={500}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
        >
          {isPending ? 'Submitting…' : 'Submit Review'}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
