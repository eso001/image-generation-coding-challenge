'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import { ClearThreadDialog } from '@/components/clear-thread-dialog'
import { EmptyState } from '@/components/empty-state'
import { HistoryCard } from '@/components/history-card'
import { ThreadProvider, useThreadActions, useThreadState } from '@/components/providers/thread-provider'
import { PromptBar } from '@/components/prompt-bar'
import { Toast } from '@/components/ui/toast'

function Interface() {
  const { history, isLoading, error } = useThreadState()
  const { submitPrompt, clearThread, acknowledgeError } = useThreadActions()
  const [prompt, setPrompt] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)

  const hasReadyEntries = useMemo(() => history.some((entry) => entry.status === 'ready'), [history])

  useEffect(() => {
    if (!feedRef.current) return
    feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
  }, [history.length])

  useEffect(() => {
    if (!error) return
    const id = window.setTimeout(() => acknowledgeError(), 3200)
    return () => window.clearTimeout(id)
  }, [error, acknowledgeError])

  const handleSubmit = () => {
    if (!prompt.trim()) return
    void submitPrompt(prompt)
    setPrompt('')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas pb-40">
      <div className="noise-layer pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-32 pt-10 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-cyan-200" /> AI VISUAL THREAD
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Describe once. Refine endlessly.
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-400">
              The canvas streams every generation in one scrollable story. Keep the prompt docked, riff on what you see,
              and stay in flow.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <ClearThreadDialog onConfirm={clearThread} disabled={history.length === 0 || isLoading} />
          </div>
        </header>

        <section
          ref={feedRef}
          className="scroll-shadow mt-6 flex-1 overflow-y-auto pb-56 pr-1"
          aria-live="polite"
          aria-label="Generation history"
        >
          {history.length === 0 ? (
            <div className="mt-12">
              <EmptyState />
            </div>
          ) : (
            <div className="flex flex-col gap-6 pb-20">
              <AnimatePresence initial={false}>
                {history.map((entry, index) => (
                  <HistoryCard key={entry.id} entry={entry} isLatest={index === history.length - 1} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      <PromptBar
        value={prompt}
        onChange={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode={hasReadyEntries ? 'refine' : 'generate'}
      />

      <Toast message={error ?? ''} visible={Boolean(error)} />
    </div>
  )
}

export default function Page() {
  return (
    <ThreadProvider>
      <Interface />
    </ThreadProvider>
  )
}
