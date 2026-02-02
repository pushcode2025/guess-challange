export type ImageOptions = {
  width?: number
  height?: number
  quality?: number
  fit?: 'contain' | 'cover' | 'fill'
  background?: string // hex بدون #
  format?: 'webp' | 'jpg'
}

export function buildImageUrl(
  image: string | null,
  options?: ImageOptions
) {
  if (!image) return null

  const storageUrl = import.meta.env.VITE_STORAGE_URL
  const base = storageUrl.replace(/\/storage\/?$/, '')

  const params = new URLSearchParams()

  if (options?.width) params.append('w', options.width.toString())
  if (options?.height) params.append('h', options.height.toString())
  if (options?.quality) params.append('q', options.quality.toString())
  if (options?.fit) params.append('fit', options.fit)
  if (options?.background) params.append('bg', options.background)
  if (options?.format) params.append('fm', options.format)

  return `${base}/images/${image}?${params.toString()}`
}
