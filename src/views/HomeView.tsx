import Link from '@/shims/Link'

import { Arrow } from '@/components/site/Arrow'
import { GalleryGrid } from '@/components/site/GalleryGrid'
import { Highlight } from '@/components/site/Highlight'
import { toGalleryItem } from '@/components/site/ProjectCard'
import { getHomePage, getProjects, getServices, getSiteSettings, populated } from '@/lib/data'
import { docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { buildMetadata } from '@/lib/seo'
import type { Project } from '@/payload-types'

export function meta(): PageMeta {
  const [home, s] = [getHomePage(), getSiteSettings()]
  return buildMetadata({
    title: home.meta?.title || `${s.siteName} — Creative reklam ajansı`,
    description: home.meta?.description || s.description,
    image: home.meta?.image || s.defaultOgImage,
    path: '/',
  })
}

export function HomePage() {
  const [home, projects, services, s] = [getHomePage(), getProjects(), getServices(), getSiteSettings()]

  const chosen = populated<Project>(home.featuredProjects).filter((p) => p._status !== 'draft')
  const featured = (chosen.length ? chosen : projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, 8)

  return (
    <>
      {/* Açılış: solda kısa tanım, sağda tek cümle */}
      <section className="container-site pt-16 pb-20 md:pt-28 md:pb-28">
        <div className="grid-site gap-y-8">
          <p className="col-span-4 max-w-[16rem] text-[16px] leading-snug muted md:col-span-3 hero-line">
            {s.siteName}, {s.city || 'İstanbul'} merkezli creative reklam ajansı.
          </p>
          <div className="col-span-4 md:col-span-9">
            <h1 className="t-hero max-w-[22ch] hero-line [animation-delay:80ms]">
              {home.heroLead} <span className="t-accent">{home.heroAccent}</span> {home.heroTail}
            </h1>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[17px] hero-line [animation-delay:240ms]">
              <Link href="/portfolyo" className="group inline-flex items-center gap-2">
                <span className="link-line">Tüm işler</span> <Arrow />
              </Link>
              <Link href="/iletisim" className="group inline-flex items-center gap-2">
                <span className="link-line">Projenizi konuşalım</span> <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri */}
      {featured.length > 0 && (
        <section aria-labelledby="secili-isler" className="container-site pb-24 md:pb-36">
          <div className="mb-8 flex items-baseline justify-between gap-6 border-t border-line pt-5">
            <h2 id="secili-isler" className="text-[16px] font-normal">
              Seçili işler <span className="muted">({featured.length})</span>
            </h2>
            <Link href="/portfolyo" className="group text-[16px]">
              <span className="link-line">Tümünü gör</span> <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <GalleryGrid items={featured.map(toGalleryItem)} />
        </section>
      )}

      {/* Referanslar: yayındaki projelerin müşterileri */}
      {projects.length > 0 && (
        <section aria-labelledby="referanslar" className="container-site pb-24 md:pb-36">
          <div className="grid-site gap-y-8 border-t border-line pt-5">
            <h2 id="referanslar" className="col-span-4 text-[16px] font-normal md:col-span-3">
              Birlikte çalıştığımız markalar
            </h2>
            <ul className="col-span-4 flex flex-wrap gap-x-2 gap-y-1 md:col-span-9">
              {projects.map((p, i) => (
                <li key={p.id} className="t-hero text-[clamp(1.6rem,1rem+2vw,2.75rem)]">
                  <Link href={docPath('projects', p.slug)} className="link-line hover:text-ink">
                    {p.client}
                  </Link>
                  {i < projects.length - 1 && <span className="text-ink-subtle">,</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Hizmetler: yalnız adlar */}
      <section aria-labelledby="hizmetler" className="container-site pb-24 md:pb-36">
        <div className="grid-site gap-y-8 border-t border-line pt-5">
          <h2 id="hizmetler" className="col-span-4 text-[16px] font-normal md:col-span-3">
            Neler yapıyoruz
          </h2>
          <ul className="col-span-4 grid gap-x-8 md:col-span-9 md:grid-cols-2">
            {services.map((x, i) => (
              <li key={x.id} className="group border-b border-line">
                <Link href={docPath('services', x.slug)} className="flex items-baseline gap-4 py-4 md:py-5">
                  <span className="text-caption muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[clamp(1.35rem,1rem+1.1vw,2rem)] leading-tight tracking-tight transition-transform duration-500 group-hover:translate-x-2">{x.title}</span>
                  <span aria-hidden="true" className="ml-auto opacity-30 transition-opacity group-hover:opacity-100">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Biz kimiz */}
      {home.aboutText && (
        <section aria-labelledby="biz-kimiz" className="container-site pb-24 md:pb-36">
          <div className="grid-site gap-y-8 border-t border-line pt-5">
            <h2 id="biz-kimiz" className="col-span-4 text-[16px] font-normal md:col-span-3">
              {home.aboutHeading || 'Biz kimiz'}
            </h2>
            <div className="col-span-4 md:col-span-9">
              <p className="t-hero max-w-[34ch] text-[clamp(1.5rem,0.95rem+1.9vw,2.6rem)] reveal">
                <Highlight
                  text={home.aboutText}
                  phrases={[
                    '360 derece iletişim',
                    'insanlarla markalar arasında bağ kurmayı',
                    'akıl, fikir ve teknik',
                    'duygu ilaveli entegre iletişim',
                    'farklı bir yerde durmak',
                    'creative reklam ajansı!',
                  ]}
                />
              </p>
              <Link href="/hakkimizda" className="group mt-10 inline-flex items-center gap-2 text-[17px]">
                <span className="link-line">Stüdyoyu tanıyın</span> <Arrow />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
