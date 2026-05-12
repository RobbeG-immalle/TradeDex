import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sign In – TradeDex' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white text-2xl font-bold">
            <span className="text-3xl">⚡</span>
            TradeDex
          </Link>
          <p className="text-white/60 mt-2">Sign in to your account</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-2xl">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
