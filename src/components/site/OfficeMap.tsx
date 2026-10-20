'use client'

import Link from '@/shims/Link'
import { useSyncExternalStore } from 'react'

const KEY = 'hypnos-map-consent'
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
const read = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Google Haritalar gömmesi. Google çerez bıraktığı için harita ziyaretçi onayıyla yüklenir
 * (KVKK çerez rehberi); tercih bu tarayıcıda hatırlanır. Markaya uyması için siyah-beyaz gösterilir.
 */
export function OfficeMap({ query, label, mapUrl }: { query: string; label: string; mapUrl?: string | null }) {
  const consent = useSyncExternalStore(subscribe, read, () => false)
  const allow = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    listeners.forEach((l) => l())
  }
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=tr&z=16&output=embed`

  return (
    <figure>
      <div className="media-frame relative aspect-[16/10] md:aspect-[21/9]">
        {consent ? (
          <iframe
            src={src}
            title={`Ofis konumu: ${label}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_contrast(1.05)]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-5 bg-surface-raised p-6 md:p-10">
            <p className="max-w-md text-[clamp(1.25rem,1rem+0.8vw,1.75rem)] leading-snug tracking-tight">{label}</p>
            <p className="max-w-lg text-[16px] text-ink-secondary">
              Harita Google Haritalar üzerinden yüklenir ve Google çerezleri kullanır.{' '}
              <Link href="/cerez-politikasi" className="link-line text-ink">
                Çerez politikası
              </Link>
            </p>
            <button type="button" onClick={allow} className="btn btn-lg">
              Haritayı göster <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3 text-[16px] text-ink-secondary">
        <span>{label}</span>
        {mapUrl && (
          <a href={mapUrl} target="_blank" rel="noopener" className="link-line text-ink">
            Google Haritalar’da yol tarifi al <span aria-hidden="true">↗</span>
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>
        )}
      </figcaption>
    </figure>
  )
}
