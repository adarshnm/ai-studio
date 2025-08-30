'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type Props = {
  onChange: (file: File | null) => void
}

export function UploadSection({ onChange }: Props) {
  return (
    <div>
      <Label htmlFor="file">Upload image</Label>
      <Input
        id="file"
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        aria-describedby="file-help"
      />
      <p id="file-help" className="mt-1 text-xs text-muted-foreground">
        Large images will be downscaled to 1920px.
      </p>
    </div>
  )
}

export default UploadSection
