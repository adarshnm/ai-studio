'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STYLES, type Style } from '@/components/studio/types'

type Props = {
  prompt: string
  setPrompt: (v: string) => void
  style: Style
  setStyle: (v: Style) => void
}

export function PromptStyleSection({
  prompt,
  setPrompt,
  style,
  setStyle,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <Label htmlFor="prompt">Prompt</Label>
        <Input
          id="prompt"
          placeholder="Describe what to generate"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="style">Style</Label>
        <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
          <SelectTrigger id="style" aria-label="Style">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            {STYLES.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PromptStyleSection
