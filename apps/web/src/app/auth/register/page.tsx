import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Create Account – TradeDex' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white text-2xl font-bold">
            <span className="text-3xl">⚡</span>
            TradeDex
          </Link>
          <p className="text-white/60 mt-2">Create your collector account</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl">
          {/* Onboarding disclaimer */}
          <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 text-xs text-amber-800 dark:text-amber-300">
            ⚠️ By creating an account, you acknowledge that TradeDex only facilitates connections between collectors. We do not process payments or guarantee trades. All trades are at your own risk.
          </div>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
