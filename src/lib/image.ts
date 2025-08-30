export type CustomImage = {
  dataUrl: string

  downscaled: boolean
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * Downscale an image to fit within maxDim while preserving aspect ratio.
 * Returns the data URL (preserving original mime if possible).
 */
export async function downscaleImageDataUrl(
  srcDataUrl: string,
  opts: { maxDim?: number; quality?: number } = {},
): Promise<CustomImage> {
  const { maxDim = 1920, quality = 0.9 } = opts
  const img = await loadImage(srcDataUrl)
  const { width: w, height: h } = img

  const ratio = Math.min(1, maxDim / Math.max(w, h))
  const targetW = Math.round(w * ratio)
  const targetH = Math.round(h * ratio)

  if (ratio === 1) {
    return { dataUrl: srcDataUrl, downscaled: false }
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(img, 0, 0, targetW, targetH)
  // Try to preserve mime type from source
  const mime = srcDataUrl.startsWith('data:image/png')
    ? 'image/png'
    : 'image/jpeg'
  const dataUrl = canvas.toDataURL(mime, quality)
  return { dataUrl, downscaled: true }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}
