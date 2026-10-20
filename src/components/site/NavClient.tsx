'use client'

import Image from '@/shims/Image'
import Link from '@/shims/Link'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useIsClient } from '@/lib/hooks'
import { Arrow } from './Arrow'

export type NavItem = { label: string; href: string; summary?: string | null; image?: { url: string; alt: string; project: string } }
export type NavGroup = { title: string; href: string; items: NavItem[] }

const primary = [
  { label: 'Portfolyo', href: '/portfolyo' },
  { label: 'Blog', href: '/blog' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
]

export function NavClient({ groups, availability, pathname }: { groups: NavGroup[]; availability?: string | null; pathname: string }) {
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mounted = useIsClient()
  const megaId = useId()
  const mobileId = useId()
  const megaRef = useRef<HTMLDivElement>(null)
  const megaButton = useRef<HTMLButtonElement>(null)
  const mobileButton = useRef<HTMLButtonElement>(null)

  // Sayfa değişince menüleri kapat (render sırasında önceki yolla karşılaştırılır)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMegaOpen(false)
    setMobileOpen(false)
  }

  // Esc ile kapat, odağı tetikleyiciye geri ver
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (megaOpen) {
        setMegaOpen(false)
        megaButton.current?.focus()
      }
      if (mobileOpen) {
        setMobileOpen(false)
        mobileButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [megaOpen, mobileOpen])

  // Mobil menü açıkken arka plan kaymasın
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [mobileOpen])

  // Menü panelinde vurgulanan hizmet (önizleme)
  const [active, setActive] = useState(0)
  const services = groups[0]
  const others = groups.slice(1)
  const current = services?.items[active]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const whatActive = pathname.startsWith('/neler-yapiyoruz') || groups.some((g) => g.items.some((i) => pathname === i.href))

  // Panel dışına tıklanınca kapat
  useEffect(() => {
    if (!megaOpen) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!megaRef.current?.contains(t) && !megaButton.current?.contains(t)) setMegaOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [megaOpen])

  return (
    <>
      {/* Masaüstü */}
      <nav aria-label="Ana menü" className="hidden flex-1 items-center justify-between gap-8 pl-16 lg:flex">
        <ul className="flex items-center gap-8 text-[16px] font-normal">
          <li className="relative">
            <button
              ref={megaButton}
              type="button"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
              className={`group flex items-center gap-1.5 py-2 ${whatActive ? 'text-ink' : 'text-ink-secondary hover:text-ink'}`}
            >
              <span className={`link-line ${whatActive ? '[background-size:100%_1px]' : ''}`}>Neler yapıyoruz</span>
              <span aria-hidden="true" className={`transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>
          </li>
          {primary.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`link-line py-1 ${isActive(item.href) ? 'text-ink [background-size:100%_1px]' : 'text-ink-secondary hover:text-ink'}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-6">
          {availability && (
            <span className="flex items-center gap-2 text-caption text-ink-muted">
              <span className="inline-block size-2 rounded-full bg-ink" aria-hidden="true" />
              {availability}
            </span>
          )}
          <Link href="/iletisim" className="btn" aria-current={isActive('/iletisim') ? 'page' : undefined}>
            İletişim <Arrow />
          </Link>
        </div>
      </nav>

      {/* Açılır panel: solda numaralı hizmet listesi, sağda üzerine gelinen hizmetin önizlemesi */}
      {/* Arka plan karartması: header'daki backdrop-filter fixed konumu kırptığı için body'ye taşınır */}
      {mounted &&
        createPortal(
          <div
            aria-hidden="true"
            onClick={() => setMegaOpen(false)}
            className={`fixed inset-x-0 top-(--header-h) bottom-0 z-40 hidden bg-black/25 transition-opacity duration-500 lg:block ${megaOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          />,
          document.body,
        )}
      <div
        id={megaId}
        ref={megaRef}
        inert={!megaOpen}
        className={`absolute inset-x-0 top-full hidden border-b border-line bg-surface transition-[opacity,transform,visibility] duration-500 ease-(--ease-out-soft) lg:block ${
          megaOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <div className="container-site grid grid-cols-12 gap-x-6 pt-10 pb-12">
          {/* Hizmetler */}
          <div className="col-span-7">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <Link href={services.href} className="text-[16px] muted hover:text-ink">
                {services.title} <span className="tabular-nums">({services.items.length})</span>
              </Link>
              <Link href="/neler-yapiyoruz" className="group text-[16px]">
                <span className="link-line">Genel bakış</span> <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <ul onMouseLeave={() => setActive(0)}>
              {services.items.map((it, i) => (
                <li key={it.href} className="border-b border-line">
                  <Link
                    href={it.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-current={pathname === it.href ? 'page' : undefined}
                    className="group flex items-baseline gap-5 py-2.5"
                  >
                    <span className="w-6 text-caption muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`text-[clamp(1.35rem,0.9rem+1vw,1.85rem)] leading-tight tracking-tight transition-[transform,color] duration-500 ease-(--ease-out-soft) ${
                        active === i ? 'translate-x-2 text-ink' : 'text-ink-muted'
                      }`}
                    >
                      {it.label}
                    </span>
                    <span aria-hidden="true" className={`ml-auto transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-0'}`}>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Önizleme */}
          <div className="col-span-4 col-start-9 flex flex-col">
            <div className="media-frame relative aspect-[4/3]">
              {services.items.map((it, i) =>
                it.image ? (
                  <Image
                    key={it.href}
                    src={it.image.url}
                    alt=""
                    fill
                    sizes="30vw"
                    className={`object-cover transition-[opacity,scale] duration-700 ease-(--ease-out-soft) ${active === i ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                  />
                ) : null,
              )}
              {!current?.image && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="t-list text-ink-subtle">{String(active + 1).padStart(2, '0')}</span>
                </span>
              )}
              {current?.image && (
                <span className="badge absolute bottom-3 left-3 text-[13px]">Proje: {current.image.project}</span>
              )}
            </div>
            <p className="mt-4 min-h-[4.5rem] text-[16px] leading-relaxed muted">{current?.summary}</p>

            <div className="mt-auto grid grid-cols-2 gap-6 border-t border-line pt-4">
              {others.map((g) => (
                <div key={g.title}>
                  <Link href={g.href} className="text-caption muted hover:text-ink">
                    {g.title}
                  </Link>
                  <ul className="mt-2 space-y-1">
                    {g.items.map((it) => (
                      <li key={it.href}>
                        <Link href={it.href} className="link-line text-[16px]" aria-current={pathname === it.href ? 'page' : undefined}>
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobil */}
      <button
        ref={mobileButton}
        type="button"
        className="btn lg:hidden"
        aria-expanded={mobileOpen}
        aria-controls={mobileId}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? 'Kapat' : 'Menü'}
      </button>
      {/* Header'daki backdrop-filter fixed konumu kırptığı için panel body'ye taşınır */}
      {mounted &&
        createPortal(
        <div
          id={mobileId}
          hidden={!mobileOpen}
          className="fixed inset-x-0 bottom-0 top-(--header-h) z-40 overflow-y-auto bg-surface lg:hidden"
        >
          <nav aria-label="Mobil menü" className="container-site flex min-h-full flex-col py-6">
            <ul className="divide-y divide-line border-y border-line">
              <li>
                <Link href="/neler-yapiyoruz" className="flex items-center justify-between py-4 t-list">
                  Neler Yapıyoruz <Arrow />
                </Link>
              </li>
              {groups.map((g) => (
                <li key={g.title}>
                  <details className="group/acc">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 t-list [&::-webkit-details-marker]:hidden">
                      {g.title}
                      <span aria-hidden="true" className="transition-transform group-open/acc:rotate-45">+</span>
                    </summary>
                    <ul className="pb-4">
                      {g.items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href} className="block py-2 text-ink-secondary">
                            {it.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
              {primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center justify-between py-4 t-list" aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label} <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/iletisim" className="btn btn-lg mt-8 self-start">
              Projenizi konuşalım <Arrow />
            </Link>
          </nav>
        </div>,
          document.body,
        )}
    </>
  )
}
