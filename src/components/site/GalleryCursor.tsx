'use client'

import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@/lib/hooks'

/**
 * `data-cursor` taşıyan öğelerin üzerinde imleci izleyen küçük etiket (ör. "Projeyi gör").
 * Yalnız fareli cihazlarda ve hareket azaltma tercihi yokken çalışır; dekoratiftir, ekran okuyuculardan gizlidir.
 */
export function GalleryCursor() {
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
  const el = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    let x = 0
    let y = 0
    let raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      setLabel(target ? target.dataset.cursor || null : null)
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          if (el.current) el.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        })
    }
    const leave = () => setLabel(null)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={el} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[60]">
      <span
        className="badge -translate-x-1/2 -translate-y-1/2 whitespace-nowrap transition-[opacity,scale] duration-300 ease-(--ease-out-soft)"
        style={{ opacity: label ? 1 : 0, scale: label ? '1' : '0.6' }}
      >
        {label ?? ''}
      </span>
    </div>
  )
}
