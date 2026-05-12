import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TradeDex – Pokémon Card Trading',
  description: 'Find and organize Pokémon card trades with collectors worldwide. No payments, no intermediary – just connections.',
  keywords: ['pokemon', 'trading cards', 'TCG', 'trade', 'collection'],
  openGraph: {
    title: 'TradeDex',
    description: 'Find your perfect Pokémon card trade',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-(--background) text-(--foreground)">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

