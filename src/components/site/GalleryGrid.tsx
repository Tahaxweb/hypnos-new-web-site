import Image from '@/shims/Image'
import Link from '@/shims/Link'

export type GalleryItem = {
  href: string
  client: string
  title: string
  services: string
  year?: number | null
  image?: { url: string; alt: string; focal: string }
}

/**
 * Asimetrik galeri: masaüstünde öğeler farklı genişlik, oran ve dikey kaymayla dizilir; mobilde tek sütun.
 * Desen 6 öğede bir tekrar eder, böylece proje sayısı arttıkça düzen bozulmaz.
 */
const PATTERN = [
  { col: 'md:col-span-7', aspect: 'aspect-[4/3]', shift: '' },
  { col: 'md:col-span-4 md:col-start-9', aspect: 'aspect-[4/5]', shift: 'md:mt-44' },
  { col: 'md:col-span-5 md:col-start-2', aspect: 'aspect-square', shift: 'md:-mt-6' },
  { col: 'md:col-span-6 md:col-start-7', aspect: 'aspect-[16/10]', shift: 'md:mt-36' },
  { col: 'md:col-span-4', aspect: 'aspect-[3/4]', shift: 'md:mt-10' },
  { col: 'md:col-span-7 md:col-start-6', aspect: 'aspect-[16/9]', shift: 'md:mt-52' },
]

export function GalleryGrid({ items, hidden, priorityCount = 2, headingLevel = 'h3' }: { items: GalleryItem[]; hidden?: (it: GalleryItem) => boolean; priorityCount?: number; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  return (
    <ul className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-6 md:gap-y-20">
      {items.map((it, i) => {
        const p = PATTERN[i % PATTERN.length]
        return (
          <li key={it.href} className={`${p.col} ${p.shift}`} hidden={hidden?.(it)}>
            <article className="group relative" data-cursor="Projeyi gör">
              <div className={`media-frame hover-zoom reveal-img relative ${p.aspect}`}>
                {it.image ? (
                  <Image
                    src={it.image.url}
                    alt={it.image.alt}
                    fill
                    sizes="(min-width: 768px) 55vw, 100vw"
                    priority={i < priorityCount}
                    style={{ objectPosition: it.image.focal }}
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-caption muted">Görsel hazırlanıyor</span>
                )}
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-6">
                <H className="text-[17px] font-medium tracking-tight">
                  <Link href={it.href} className="link-line after:absolute after:inset-0 after:content-['']">
                    {it.client}
                  </Link>
                  <span aria-hidden="true" className="ml-1.5 inline-block transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </H>
                {it.year && <span className="text-caption muted tabular-nums">{it.year}</span>}
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
