'use client'

import Image from 'next/image'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { Clock, RefreshCcw, Sparkles } from 'lucide-react'

import type { ThreadEntry } from '@/lib/utils'
import { cn } from '@/lib/utils'

type HistoryCardProps = {
  entry: ThreadEntry
  isLatest: boolean
}

const statusCopy: Record<ThreadEntry['status'], string> = {
  loading: 'Generating…',
  ready: 'Ready',
  error: 'Failed'
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export const HistoryCard = memo(({ entry, isLatest }: HistoryCardProps) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-white/2 to-white/0 p-6 backdrop-blur-sm',
        isLatest && 'border-cyan-300/40 shadow-glow'
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
          {statusCopy[entry.status]}
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <Clock className="mr-1 h-3 w-3" /> {formatTimestamp(entry.timestamp)}
        </div>
        <div className="flex items-center text-xs text-slate-400">
          {entry.status === 'loading' ? (
            <RefreshCcw className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="mr-1 h-3 w-3 text-cyan-200" />
          )}
          {entry.status === 'loading' ? 'Refining' : 'Prompted'}
        </div>
      </div>

      <p className="mt-4 text-base text-slate-100">{entry.prompt}</p>

      <div className="mt-5 rounded-2xl border border-white/5 bg-slate-900/40">
        {entry.status === 'loading' ? (
          <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="h-32 w-32 animate-spin rounded-full border-2 border-white/10 border-t-cyan-200" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(103,232,249,0.12),_transparent_55%)]" />
          </div>
        ) : entry.status === 'error' ? (
          <div className="flex h-40 items-center justify-center rounded-2xl bg-red-500/10 text-sm text-red-200">
            {entry.errorMessage ?? 'Unable to render image.'}
          </div>
        ) : (
          <motion.div layoutId={entry.id} className="overflow-hidden rounded-2xl border border-white/5">
            <Image
              src={entry.imageData ?? ''}
              alt={`Generated visual for ${entry.prompt}`}
              width={1024}
              height={768}
              loading="lazy"
              className="h-auto w-full bg-black object-cover"
              sizes="(min-width: 768px) 640px, 100vw"
              unoptimized
            />
          </motion.div>
        )}
      </div>
    </motion.article>
  )
})

HistoryCard.displayName = 'HistoryCard'
