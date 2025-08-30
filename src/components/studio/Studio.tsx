'use client'

import { useCallback, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { History, Loader2, XCircle } from 'lucide-react'
import UploadSection from '@/components/studio/UploadSection'
import PromptStyleSection from '@/components/studio/PromptStyleSection'
import SummaryPanel from '@/components/studio/SummaryPanel'
import HistoryList from '@/components/studio/HistoryList'
import type { Style, Generation } from '@/components/studio/types'
import { useHistory } from '@/components/studio/hooks/useHistory'
import { useGenerate } from '@/components/studio/hooks/useGenerate'
import {
  downscaleImageDataUrl,
  fileToDataUrl,
  type CustomImage,
} from '@/lib/image'
import { toast } from 'sonner'

export default function Studio() {
  const [image, setImage] = useState<CustomImage | null>(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState<Style>('Editorial')
  const { history, setHistory } = useHistory(5)
  const { generate, abort, canAbort, loading, error, setError } = useGenerate()

  const onFileChange = useCallback(async (f: File | null) => {
    if (!f) {
      setImage(null)
      return
    }
    if (!/^image\/(png|jpe?g)$/i.test(f.type)) {
      toast.error('Please upload a PNG or JPG file')
      return
    }
    const sizeMB = f.size / (1024 * 1024)

    const dataUrl = await fileToDataUrl(f)
    if (sizeMB > 10) {
      toast.error('File is larger than 10MB')
      const resized = await downscaleImageDataUrl(dataUrl, { maxDim: 1920 })
      setImage(resized)
    } else {
      setImage({ dataUrl, downscaled: false })
    }
  }, [])

  const onGenerate = useCallback(async () => {
    if (!image?.dataUrl) {
      toast.error('Please upload an image first')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }
    const result = await generate({
      imageDataUrl: image.dataUrl,
      prompt: prompt.trim(),
      style,
    })
    if (result?.data) {
      setHistory((prev) => [result.data as Generation, ...prev].slice(0, 5))
      toast.success('Generated')
    } else if (result?.error) {
      setError(result.error)
      if (result.error !== 'Request aborted') toast.error(result.error)
    }
  }, [generate, image?.dataUrl, prompt, setError, setHistory, style])

  const restoreFromHistory = useCallback((g: Generation) => {
    setImage({ dataUrl: g.imageUrl, downscaled: false })
    setPrompt(g.prompt)
    setStyle(g.style as Style)
  }, [])

  return (
    <div className="container mx-auto max-w-6xl p-4 flex flex-col justify-center min-h-dvh">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl" role="heading">
              AI Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col  gap-4">
            <div className="flex items-center">
              <UploadSection onChange={onFileChange} />
            </div>

            <Separator />

            <PromptStyleSection
              prompt={prompt}
              setPrompt={setPrompt}
              style={style}
              setStyle={setStyle}
            />

            <div className=" flex items-center gap-2">
              <Button type="button" onClick={onGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Generating…
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={abort}
                disabled={!canAbort}
                aria-disabled={!canAbort}
              >
                <XCircle className="mr-2 h-4 w-4" /> Abort
              </Button>
            </div>

            <SummaryPanel
              imageUrl={image?.dataUrl}
              prompt={prompt}
              style={style}
              error={error}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" /> History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[480px] pr-2">
              <HistoryList history={history} onSelect={restoreFromHistory} />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
