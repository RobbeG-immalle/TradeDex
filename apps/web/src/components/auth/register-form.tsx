'use client'

import { useState, useTransition } from 'react'
import { signUp } from '@/lib/actions/auth'
import { isValidUsername } from '@tradedex/utils'
import { toast } from 'sonner'

export function RegisterForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  function validateUsername(value: string) {
    if (!isValidUsername(value)) {
      setUsernameError('Username must be 3–30 characters: letters, numbers, underscores only')
    } else {
      setUsernameError(null)
    }
  }

  async function handleSubmit(formData: FormData) {
    setError(null)
    const username = formData.get('username') as string
    if (!isValidUsername(username)) {
      setError('Invalid username')
      return
    }
    startTransition(async () => {
      const result = await signUp(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else {
        toast.success('Account created! Check your email to confirm.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          onChange={(e) => validateUsername(e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          placeholder="pokecollector42"
        />
        {usernameError && <p className="mt-1 text-xs text-red-500">{usernameError}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          placeholder="Minimum 8 characters"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !!usernameError}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
      >
        {isPending ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
