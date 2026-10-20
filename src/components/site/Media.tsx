import Image from '@/shims/Image'

import type { Media as MediaDoc } from '@/payload-types'
import { localURL } from '@/lib/paths'
import { AmbientVideo } from './AmbientVideo'

type Props = {
  media?: MediaDoc | number | null
  sizes?: string
  priority?: boolean
  className?: string
  fill?: boolean
  aspect?: string | null
  /** Video için kapak görseli */
  poster?: MediaDoc | number | null
  ambient?: boolean
}

const isObj = (m: unknown): m is MediaDoc => Boolean(m) && typeof m === 'object'

/** Dışa aktarımda üretilmiş boyutlardan srcset kurar (dosya adındaki -GENİŞLİKxYÜKSEKLİK ekinden genişlik okunur). */
function srcSetOf(m: MediaDoc): string | undefined {
  const parts: string[] = []
  for (const key of ['thumbnail', 'card'] as const) {
    const u = m.sizes?.[key]?.url
    const w = u?.match(/-(\d+)x\d+\.\w+$/)?.[1]
    if (u && w) parts.push(`${localURL(u)} ${w}w`)
  }
  if (m.width) parts.push(`${localURL(m.url)} ${m.width}w`)
  return parts.length > 1 ? parts.join(', ') : undefined
}

export function Media({ media, sizes = '100vw', priority, className, fill, aspect, poster, ambient }: Props) {
  if (!isObj(media) || !media.url) return null
  const style = aspect && aspect !== 'auto' ? { aspectRatio: aspect } : undefined

  if (media.mimeType?.startsWith('video/')) {
    const posterUrl = isObj(poster) ? localURL(poster.url) || undefined : undefined
    return (
      <div className={className} style={style}>
        <AmbientVideo src={localURL(media.url)} type={media.mimeType} poster={posterUrl} label={media.alt} ambient={ambient} />
      </div>
    )
  }

  if (fill || style) {
    return (
      <div className={`relative ${className ?? ''}`} style={style}>
        <Image
          src={localURL(media.url)}
          alt={media.alt || ''}
          data-full={localURL(media.url)}
          fill
          srcSet={srcSetOf(media)}
          sizes={sizes}
          priority={priority}
          style={{ objectPosition: `${media.focalX ?? 50}% ${media.focalY ?? 50}%` }}
        />
      </div>
    )
  }

  return (
    <Image
      src={localURL(media.url)}
      alt={media.alt || ''}
      data-full={localURL(media.url)}
      width={media.width || 1600}
      height={media.height || 900}
      srcSet={srcSetOf(media)}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
