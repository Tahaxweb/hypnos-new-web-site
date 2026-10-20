'use client'

import { notifySearchChange, useSearchParam } from '@/lib/hooks'
import { GalleryGrid, type GalleryItem } from './GalleryGrid'

export type PortfolioItem = GalleryItem & { serviceSlugs: string[]; sectorSlugs: string[] }

type Option = { slug: string; title: string }

/**
 * Tüm projeler HTML'de bulunur (arama motorları için); filtre yalnız görünümü daraltır.
 * Seçim adres çubuğuna yazılır (?hizmet=… / ?sektor=…) ve paylaşılabilir.
 */
export function PortfolioFilter({ items, services, sectors }: { items: PortfolioItem[]; services: Option[]; sectors: Option[] }) {
  // Filtre adresten okunur; böylece paylaşılan bağlantı aynı görünümü açar
  const h = useSearchParam('hizmet')
  const s = useSearchParam('sektor')
  const filter: { type: 'hizmet' | 'sektor'; slug: string } | null = h ? { type: 'hizmet', slug: h } : s ? { type: 'sektor', slug: s } : null

  const choose = (next: typeof filter) => {
    const url = new URL(window.location.href)
    url.searchParams.delete('hizmet')
    url.searchParams.delete('sektor')
    if (next) url.searchParams.set(next.type, next.slug)
    window.history.replaceState(null, '', url)
    notifySearchChange()
  }

  const visible = filter ? items.filter((it) => (filter.type === 'hizmet' ? it.serviceSlugs : it.sectorSlugs).includes(filter.slug)) : items

  const usedServices = services.filter((s) => items.some((i) => i.serviceSlugs.includes(s.slug)))
  const usedSectors = sectors.filter((s) => items.some((i) => i.sectorSlugs.includes(s.slug)))

  return (
    <>
      <div className="flex flex-col gap-4 border-t border-line pt-5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Hizmete göre filtrele">
          <span className="mr-2 w-20 text-[16px] muted">Hizmet</span>
          <button type="button" className="chip" aria-pressed={!filter} onClick={() => choose(null)}>
            Tümü
          </button>
          {usedServices.map((s) => (
            <button key={s.slug} type="button" className="chip" aria-pressed={filter?.type === 'hizmet' && filter.slug === s.slug} onClick={() => choose({ type: 'hizmet', slug: s.slug })}>
              {s.title}
            </button>
          ))}
        </div>
        {usedSectors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sektöre göre filtrele">
            <span className="mr-2 w-20 text-[16px] muted">Sektör</span>
            {usedSectors.map((s) => (
              <button key={s.slug} type="button" className="chip" aria-pressed={filter?.type === 'sektor' && filter.slug === s.slug} onClick={() => choose({ type: 'sektor', slug: s.slug })}>
                {s.title}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} proje gösteriliyor
      </p>

      <div className="mt-14">
        <GalleryGrid items={items} hidden={(it) => !visible.includes(it as PortfolioItem)} headingLevel="h2" />
      </div>
      {visible.length === 0 && (
        <p className="muted mt-12">
          Bu filtrede yayınlanmış proje yok.{' '}
          <button type="button" className="underline underline-offset-4" onClick={() => choose(null)}>
            Tüm projeleri göster
          </button>
        </p>
      )}
    </>
  )
}
