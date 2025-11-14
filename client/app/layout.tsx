import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import clsx from 'clsx'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AI Mockup & Visual Generator',
  description: 'Single-screen AI visual generator for rapid ideation and refinement.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={clsx('bg-canvas text-slate-100', inter.variable)}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
