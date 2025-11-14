'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ClearThreadDialogProps = {
  onConfirm: () => void
  disabled?: boolean
}

export function ClearThreadDialog({ onConfirm, disabled }: ClearThreadDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wide" disabled={disabled}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-8 backdrop-blur"
          >
            <Dialog.Title className="text-xl font-semibold">Reset the canvas?</Dialog.Title>
            <Dialog.Description className="mt-3 text-sm text-slate-400">
              This clears every generated image and prompt. You&apos;ll need to start from your next idea.
            </Dialog.Description>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Dialog.Close asChild>
                <Button variant="ghost" className="sm:flex-1">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button
                  variant="primary"
                  className="bg-red-500 text-white hover:bg-red-400 sm:flex-1"
                  onClick={onConfirm}
                >
                  Reset thread
                </Button>
              </Dialog.Close>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
