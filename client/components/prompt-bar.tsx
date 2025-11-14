'use client'

import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type PromptBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  mode: 'generate' | 'refine'
}

export function PromptBar({ value, onChange, onSubmit, isLoading, mode }: PromptBarProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        onSubmit()
      }
    },
    [onSubmit]
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="prompt" className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">
              Prompt
            </label>
            <Textarea
              id="prompt"
              rows={2}
              placeholder="Generate a photorealistic glass dashboard floating above neon waves..."
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-busy={isLoading}
              className={cn(
                'max-h-36 bg-white/5 text-base shadow-inner shadow-black/40',
                isLoading && 'opacity-75'
              )}
            />
            <AnimatePresence>
              {mode === 'refine' && !isLoading ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 text-xs text-slate-400"
                >
                  Refinements build on the latest image. Reference what you like or change.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 sm:flex-col sm:items-stretch sm:gap-3">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={onSubmit}
              disabled={value.trim().length === 0 || isLoading}
              loading={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {mode === 'generate' ? 'Generate' : 'Refine'}
                </div>
              )}
            </Button>
            <p className="text-[11px] text-slate-500">⌘ + Enter</p>
          </div>
        </div>
      </div>
    </div>
  )
}
