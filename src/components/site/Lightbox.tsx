'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Shot = { src: string; alt: string; el: HTMLImageElement }

/**
 * Case study görsellerine tıklanınca tam ekran odak görünümü.
 * [data-lightbox] alanındaki `img[data-full]` görselleri toplar; bağlantı içindeki görseller (ör. sonraki proje) hariç.
 * Klavye: Tab ile görsel odaklanır, Enter/Boşluk açar, ← → gezinir, Esc kapatır; kapanınca odak görsele döner.
 */
export function Lightbox() {
  const root = useRef<HTMLElement | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [shots, setShots] = useState<Shot[]>([])
  const [index, setIndex] = useState<number | null>(null)

  const collect = useCallback(() => {
    const imgs = Array.from(root.current?.querySelectorAll<HTMLImageElement>('img[data-full]') ?? []).filter((img) => !img.closest('a'))
    return imgs.map((el) => ({ src: el.dataset.full!, alt: el.alt, el }))
  }, [])

  const open = useCallback(
    (el: HTMLImageElement) => {
      const list = collect()
      const i = list.findIndex((s) => s.el === el)
      if (i < 0) return
      setShots(list)
      setIndex(i)
      dialog.current?.showModal()
    },
    [collect],
  )

  // Görselleri tıklanabilir ve klavyeyle odaklanabilir yap
  useEffect(() => {
    root.current = document.querySelector<HTMLElement>('[data-lightbox]')
    const list = collect()
    for (const { el } of list) {
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `Görseli büyüt${el.alt ? `: ${el.alt}` : ''}`)
      el.style.cursor = 'zoom-in'
      el.dataset.cursor = 'Büyüt'
    }
    const onClick = (e: MouseEvent) => {
      const img = (e.target as Element).closest<HTMLImageElement>('img[data-full]')
      if (img && !img.closest('a') && root.current?.contains(img)) open(img)
    }
    const onKey = (e: KeyboardEvent) => {
      const img = e.target as HTMLElement
      if ((e.key === 'Enter' || e.key === ' ') && img instanceof HTMLImageElement && img.dataset.full && !img.closest('a')) {
        e.preventDefault()
        open(img)
      }
    }
    const r = root.current
    r?.addEventListener('click', onClick)
    r?.addEventListener('keydown', onKey)
    return () => {
      r?.removeEventListener('click', onClick)
      r?.removeEventListener('keydown', onKey)
    }
  }, [collect, open])

  const close = () => dialog.current?.close()
  const step = useCallback((d: number) => setIndex((i) => (i === null || !shots.length ? i : (i + d + shots.length) % shots.length)), [shots.length])

  const onDialogKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

  const current = index !== null ? shots[index] : null

  return (
    <>
      <dialog
        ref={dialog}
        aria-label="Görsel görüntüleyici"
        onKeyDown={onDialogKey}
        onClose={() => {
          current?.el.focus()
          setIndex(null)
        }}
        onClick={(e) => e.target === dialog.current && close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-ink-inverse backdrop:bg-black/80 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 text-[16px] md:px-8">
          <span className="tabular-nums text-[#d1d5dc]">{current ? `${(index ?? 0) + 1} / ${shots.length}` : ''}</span>
          <button type="button" onClick={close} className="btn" autoFocus>
            Kapat <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
          {current && (
            // Tam çözünürlüklü görsel; boyutu ekrana sığacak şekilde sınırlanır
            <img key={current.src} src={current.src} alt={current.alt} className="max-h-full max-w-full object-contain motion-safe:animate-[hero-in_.5s_cubic-bezier(.22,1,.36,1)]" />
          )}
          {shots.length > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Önceki görsel" className="btn absolute left-3 top-1/2 -translate-y-1/2 md:left-6">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Sonraki görsel" className="btn absolute right-3 top-1/2 -translate-y-1/2 md:right-6">
                →
              </button>
            </>
          )}
        </div>
        {current?.alt && <p className="px-4 pb-5 text-center text-[16px] text-[#d1d5dc] md:px-8">{current.alt}</p>}
      </dialog>
    </>
  )
}
