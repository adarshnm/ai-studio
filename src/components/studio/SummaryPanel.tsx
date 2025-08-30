'use client'

import { Label } from '@/components/ui/label'
import { ImageIcon, AlertTriangle } from 'lucide-react'

type Props = {
  imageUrl?: string
  prompt: string
  style: string
  error?: string | null
}

export function SummaryPanel({ imageUrl, prompt, style, error }: Props) {
  return (
    <div>
      <Label>Live summary</Label>
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="relative aspect-square w-full overflow-hidden rounded border bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Style:</span> {style}
            </div>
            <div>
              <span className="font-medium">Prompt:</span> {prompt || '—'}
            </div>

            {error && (
              <div
                className="flex items-center text-destructive"
                role="alert"
                aria-live="polite"
              >
                <AlertTriangle className="mr-2 h-4 w-4" /> {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPanel
