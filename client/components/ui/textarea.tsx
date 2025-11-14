'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoExpand?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoExpand = true, onInput, ...props }, ref) => {
    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
      if (autoExpand) {
        event.currentTarget.style.height = 'auto'
        event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`
      }
      onInput?.(event)
    }

    return (
      <textarea
        ref={ref}
        onInput={handleInput}
        className={cn(
          'w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900 transition',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
