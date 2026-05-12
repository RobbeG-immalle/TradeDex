'use client'

import { useState, useTransition } from 'react'
import { reportUser } from '@/lib/actions/social'
import type { ReportReason } from '@tradedex/types'
import { toast } from 'sonner'

interface Props {
  reportedUserId: string
  reportedUsername: string
}

export function ReportButton({ reportedUserId, reportedUsername }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState<ReportReason>('SCAM')
  const [description, setDescription] = useState('')
  const [isPending, startTransition] = useTransition()

  const REASON_LABELS: Record<ReportReason, string> = {
    SCAM: 'Scam / Fraud',
    FAKE_CARDS: 'Fake Cards',
    HARASSMENT: 'Harassment',
    SPAM: 'Spam',
    MISLEADING_LISTING: 'Misleading Listing',
    OTHER: 'Other',
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await reportUser(reportedUserId, reason, description || null)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Report submitted. Our team will review it shortly.')
        setShowForm(false)
      }
    })
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg border border-red-200 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
      >
        Report
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-lg">Report {reportedUsername}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Reports are reviewed by our moderation team. False reports may result in account suspension.
        </p>
        <div>
          <label className="block text-sm font-medium mb-1">Reason</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReportReason)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {Object.entries(REASON_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened…"
            rows={4}
            maxLength={1000}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {isPending ? 'Reporting…' : 'Submit Report'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="rounded-lg border border-slate-200 dark:border-slate-600 px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
