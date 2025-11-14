'use client'

import { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react'

import type { ThreadEntry } from '@/lib/utils'

type ThreadMeta = {
  lastImageId?: string
  lastSeed?: string
}

type ThreadState = {
  history: ThreadEntry[]
  isLoading: boolean
  error: string | null
} & ThreadMeta

type Action =
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setError'; payload: string | null }
  | { type: 'addEntry'; payload: ThreadEntry }
  | { type: 'resolveEntry'; payload: { id: string; imageData: string; seed: string; imageId: string } }
  | { type: 'entryError'; payload: { id: string; errorMessage: string } }
  | { type: 'reset' }

const initialState: ThreadState = {
  history: [],
  isLoading: false,
  error: null,
  lastImageId: undefined,
  lastSeed: undefined
}

const ThreadContext = createContext<ThreadState | undefined>(undefined)
const ThreadActionsContext = createContext<
  | undefined
  | {
      submitPrompt: (prompt: string) => Promise<void>
      clearThread: () => Promise<void>
      acknowledgeError: () => void
      threadId: string
    }
>(undefined)

function reducer(state: ThreadState, action: Action): ThreadState {
  switch (action.type) {
    case 'setLoading':
      return { ...state, isLoading: action.payload }
    case 'setError':
      return { ...state, error: action.payload }
    case 'addEntry':
      return { ...state, history: [...state.history, action.payload] }
    case 'resolveEntry':
      return {
        ...state,
        history: state.history.map((entry) =>
          entry.id === action.payload.id
            ? {
                ...entry,
                status: 'ready',
                imageData: action.payload.imageData,
                seed: action.payload.seed
              }
            : entry
        ),
        lastImageId: action.payload.imageId,
        lastSeed: action.payload.seed
      }
    case 'entryError':
      return {
        ...state,
        history: state.history.map((entry) =>
          entry.id === action.payload.id
            ? { ...entry, status: 'error', errorMessage: action.payload.errorMessage }
            : entry
        )
      }
    case 'reset':
      return { ...initialState }
    default:
      return state
  }
}

export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [threadId] = useState(() => crypto.randomUUID())

  const submitPrompt = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim()
    if (!trimmed || state.isLoading) {
      return
    }

    const entryId = crypto.randomUUID()
    dispatch({
      type: 'addEntry',
      payload: {
        id: entryId,
        prompt: trimmed,
        status: 'loading',
        timestamp: new Date().toISOString()
      }
    })
    dispatch({ type: 'setError', payload: null })
    dispatch({ type: 'setLoading', payload: true })

    const hasGeneratedBefore = state.history.some((entry) => entry.status === 'ready')
    const url = hasGeneratedBefore ? '/api/refine' : '/api/generate'

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          threadId,
          lastImageId: state.lastImageId,
          lastSeed: state.lastSeed
        })
      })

      if (!response.ok) {
        throw new Error('Something went wrong. Try again.')
      }

      const payload = await response.json()

      dispatch({
        type: 'resolveEntry',
        payload: {
          id: entryId,
          imageData: payload.imageData,
          seed: payload.seed,
          imageId: payload.imageId
        }
      })
    } catch (error) {
      dispatch({
        type: 'entryError',
        payload: { id: entryId, errorMessage: error instanceof Error ? error.message : 'Failed' }
      })
      dispatch({ type: 'setError', payload: error instanceof Error ? error.message : 'Request failed' })
    } finally {
      dispatch({ type: 'setLoading', payload: false })
    }
  }, [state.history, state.isLoading, state.lastImageId, state.lastSeed, threadId])

  const clearThread = useCallback(async () => {
    dispatch({ type: 'setLoading', payload: true })
    let cleared = false
    try {
      await fetch('/api/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId })
      })
      cleared = true
    } catch (error) {
      dispatch({
        type: 'setError',
        payload: error instanceof Error ? error.message : 'Unable to reset thread'
      })
    } finally {
      dispatch({ type: 'setLoading', payload: false })
    }

    if (cleared) {
      dispatch({ type: 'reset' })
    }
  }, [threadId])

  const acknowledgeError = useCallback(() => dispatch({ type: 'setError', payload: null }), [])

  const actionsValue = useMemo(
    () => ({
      submitPrompt,
      clearThread,
      acknowledgeError,
      threadId
    }),
    [threadId, submitPrompt, clearThread, acknowledgeError]
  )

  return (
    <ThreadContext.Provider value={state}>
      <ThreadActionsContext.Provider value={actionsValue}>{children}</ThreadActionsContext.Provider>
    </ThreadContext.Provider>
  )
}

export function useThreadState() {
  const context = useContext(ThreadContext)
  if (context === undefined) {
    throw new Error('useThreadState must be used within a ThreadProvider')
  }
  return context
}

export function useThreadActions() {
  const context = useContext(ThreadActionsContext)
  if (context === undefined) {
    throw new Error('useThreadActions must be used within a ThreadProvider')
  }
  return context
}
