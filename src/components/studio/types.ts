export type Generation = {
  id: string
  imageUrl: string
  prompt: string
  style: string
  createdAt: string
}

export const STYLES = ['Editorial', 'Streetwear', 'Vintage'] as const
export type Style = (typeof STYLES)[number]

export const MAX_FILE_MB = 10
export const HISTORY_KEY = 'ai-studio-history'
