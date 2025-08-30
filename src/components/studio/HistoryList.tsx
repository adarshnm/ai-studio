'use client'

import { cn } from '@/lib/utils'
import type { Generation } from '@/components/studio/types'

type Props = {
  history: Generation[]
  onSelect: (g: Generation) => void
}

export function HistoryList({ history, onSelect }: Props) {
  return (
    <ul className="space-y-3">
      {history.length === 0 && (
        <li className="text-sm text-muted-foreground">No generations yet</li>
      )}
      {history.map((g) => (
        <li key={g.id}>
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded border p-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-ring',
              'hover:bg-muted',
            )}
            onClick={() => onSelect(g)}
            aria-label={`Restore generation from ${new Date(g.createdAt).toLocaleString()}`}
          >
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.imageUrl}
                alt="History thumbnail"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{g.prompt}</div>
              <div className="truncate text-xs text-muted-foreground">
                {g.style} • {new Date(g.createdAt).toLocaleString()}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

export default HistoryList
