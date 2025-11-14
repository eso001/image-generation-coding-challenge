'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

type ToastProps = {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p>{message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
