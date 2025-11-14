'use client'

import { motion } from 'framer-motion'
import { ImagePlus } from 'lucide-react'

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-white/10 bg-white/5 px-8 py-16 text-center backdrop-blur"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <ImagePlus className="h-8 w-8 text-cyan-200" />
      </div>
      <h2 className="text-2xl font-semibold">Imagine anything</h2>
      <p className="mt-3 text-base text-slate-400">
        Describe a dream UI, a 3D mockup, or a cinematic scene. Hit Generate to see the first version, then keep refining
        it with follow-up prompts.
      </p>
    </motion.div>
  )
}
