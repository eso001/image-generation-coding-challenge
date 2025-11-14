import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ThreadEntryStatus = 'loading' | 'ready' | 'error'

export type ThreadEntry = {
  id: string
  prompt: string
  status: ThreadEntryStatus
  imageData?: string
  timestamp: string
  seed?: string
  errorMessage?: string
}
