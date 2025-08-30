'use client'

import { useEffect, useState } from 'react'
import { Generation } from '@/components/studio/types'
import { HISTORY_KEY } from '@/components/studio/types'

export function useHistory(max: number = 5) {
  const [history, setHistory] = useState<Generation[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, max)))
    } catch {}
  }, [history, max])

  return { history, setHistory }
}
