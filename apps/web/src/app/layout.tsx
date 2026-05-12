import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/layout/providers'

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-(--background) text-(--foreground) font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

