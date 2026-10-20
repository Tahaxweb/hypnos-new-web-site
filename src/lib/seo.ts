import type { Media } from '@/payload-types'
import { absoluteURL } from './paths'

export type PageMeta = {
  title?: string
  description?: string
  path: string
  image?: string
  noindex?: boolean
  type?: 'website' | 'article'
}

type MetaInput = {
  title?: string | null
  description?: string | null
  path: string
  image?: Media | number | null
  noindex?: boolean | null
  type?: 'website' | 'article'
}

export function mediaURL(media?: Media | number | null, size?: 'og' | 'card' | 'thumbnail'): string | undefined {
  if (!media || typeof media !== 'object') return undefined
  const url = (size && media.sizes?.[size]?.url) || media.url
  return url ? absoluteURL(url) : undefined
}

export function buildMetadata({ title, description, path, image, noindex, type = 'website' }: MetaInput): PageMeta {
  return {
    title: title || undefined,
    description: description || undefined,
    path,
    image: mediaURL(image, 'og'),
    noindex: Boolean(noindex),
    type,
  }
}

/** Belgenin SEO sekmesindeki değerleri, yoksa yedek değerleri kullanır. */
export function docMetadata(
  doc: { title: string; isSample?: boolean | null; meta?: { title?: string | null; description?: string | null; image?: Media | number | null; noindex?: boolean | null } | null },
  path: string,
  fallbackDescription?: string | null,
  fallbackImage?: Media | number | null,
  type: 'website' | 'article' = 'website',
): PageMeta {
  return buildMetadata({
    title: doc.meta?.title || doc.title,
    description: doc.meta?.description || fallbackDescription,
    image: doc.meta?.image || fallbackImage,
    noindex: doc.meta?.noindex || doc.isSample,
    path,
    type,
  })
}
