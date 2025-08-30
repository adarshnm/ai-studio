'use client'

import { useCallback, useRef, useState } from 'react'
import type { Generation } from '@/components/studio/types'
import { toast } from 'sonner'

export function useGenerate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    controllerRef.current?.abort()
    toast.error('Request aborted')
  }, [])

  const generate = useCallback(
    async (payload: {
      imageDataUrl: string
      prompt: string
      style: string
    }) => {
      setLoading(true)
      setError(null)
      const maxAttempts = 3
      let attempt = 0
      let lastError: string | null = null

      while (attempt < maxAttempts) {
        attempt++
        const controller = new AbortController()
        controllerRef.current = controller
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal,
          })

          if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            lastError = data?.message || res.statusText
            if (res.status === 499) throw new Error('aborted')
            if (res.status >= 500) throw new Error(String(lastError))
            setError(String(lastError))
            break
          }

          const data: Generation = await res.json()
          setLoading(false)
          return { data }
        } catch (e: unknown) {
          const isDomAbort =
            typeof DOMException !== 'undefined' &&
            e instanceof DOMException &&
            e.name === 'AbortError'
          const msg = e instanceof Error ? e.message : 'Unknown error'
          if (msg === 'aborted' || isDomAbort) {
            setLoading(false)
            setError('Request aborted')
            return { error: 'Request aborted' }
          }
          lastError = msg
          if (attempt >= maxAttempts) break
          const backoff = Math.pow(2, attempt - 1) * 500
          await new Promise((r) => setTimeout(r, backoff))
        } finally {
          controllerRef.current = null
        }
      }

      setLoading(false)
      setError(lastError ?? 'Failed to generate')
      return { error: lastError ?? 'Failed to generate' }
    },
    [],
  )

  const canAbort = !!controllerRef.current && loading
  return { generate, abort, canAbort, loading, error, setError }
}
