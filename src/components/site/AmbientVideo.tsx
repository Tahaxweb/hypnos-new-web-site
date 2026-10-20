'use client'

import { useEffect, useRef } from 'react'

import { useMediaQuery } from '@/lib/hooks'

type Props = { src: string; type?: string | null; poster?: string; label?: string | null; ambient?: boolean }

/**
 * Atmosfer videoları sessiz ve döngüde oynar; azaltılmış hareket tercihinde otomatik oynatılmaz,
 * ekran dışındayken durdurulur. Diğer videolar kontrollerle ve yalnız tıklanınca yüklenir.
 */
export function AmbientVideo({ src, type, poster, label, ambient }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true)

  useEffect(() => {
    const el = ref.current
    if (!ambient || reduced || !el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [ambient, reduced])

  const autoplay = ambient && !reduced
  return (
    <video
      ref={ref}
      poster={poster}
      muted={autoplay}
      loop={autoplay}
      playsInline
      controls={!autoplay}
      preload={autoplay ? 'metadata' : 'none'}
      aria-label={label || undefined}
      className="h-full w-full object-cover"
    >
      <source src={src} type={type || undefined} />
    </video>
  )
}
