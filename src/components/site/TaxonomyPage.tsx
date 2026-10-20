import Link from '@/shims/Link'

import { ServiceCards } from '@/components/blocks/Dynamic'
import { collectFaqs, RenderBlocks } from '@/components/blocks/RenderBlocks'
import type { Partner, Project, Sector, Service } from '@/payload-types'
import { faqSchema, ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath } from '@/lib/paths'
import { Arrow } from './Arrow'
import { JsonLd } from './JsonLd'
import { PageHero } from './PageHero'
import { GalleryGrid } from './GalleryGrid'
import { toGalleryItem } from './ProjectCard'
import { RichText } from './RichText'
import { SampleNotice } from './SampleNotice'

type Kind = 'services' | 'sectors' | 'partners'
type Doc = Service | Sector | Partner

const KIND = {
  services: { label: 'Hizmet', group: 'Hizmetler', anchor: 'hizmetler', schema: 'Service' },
  sectors: { label: 'Sektör', group: 'Sektörler', anchor: 'sektorler', schema: null },
  partners: { label: 'Platform partneri', group: 'Partnerler', anchor: 'partnerler', schema: null },
} as const

type Props = {
  kind: Kind
  doc: Doc
  projects: Project[]
  siblings: Doc[]
  /** Sayfanın sonunda önerilecek diğer listeler (ör. sektör sayfasında hizmetler) */
  suggestions?: { title: string; items: { title: string; summary?: string | null; href: string }[] }
}

export function TaxonomyPage({ kind, doc, projects, siblings, suggestions }: Props) {
  const k = KIND[kind]
  const path = docPath(kind, doc.slug)
  const service = kind === 'services' ? (doc as Service) : null
  const partner = kind === 'partners' ? (doc as Partner) : null
  const faqs = collectFaqs(doc.layout)
  const contactHref = kind === 'services' ? `/iletisim?hizmet=${doc.slug}` : '/iletisim'

  return (
    <>
      <SampleNotice show={doc.isSample} what="Bu sayfanın metni" />
      <PageHero
        title={doc.title}
        intro={doc.summary}
        label={k.label}
        crumbs={[
          { name: 'Neler Yapıyoruz', path: `/neler-yapiyoruz` },
          { name: doc.title, path },
        ]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={contactHref} className="btn btn-lg">
            Bu konuda konuşalım <Arrow />
          </Link>
          {partner?.website && (
            <a href={partner.website} target="_blank" rel="noopener" className="btn btn-lg">
              {doc.title} web sitesi <span aria-hidden="true">↗</span>
              <span className="sr-only"> (yeni sekmede açılır)</span>
            </a>
          )}
        </div>
      </PageHero>

      {(doc.intro || doc.highlights?.length) && (
        <section className="container-site pb-16 md:pb-24">
          <div className="grid-site gap-y-10">
            <div className="col-span-4 md:col-span-3">
              <h2 className="text-[16px] font-normal">Kapsam</h2>
            </div>
            <div className="col-span-4 grid gap-12 md:col-span-9 lg:grid-cols-2">
              {doc.intro && <RichText data={doc.intro} />}
              {!!doc.highlights?.length && (
                <ul className="border-t border-line">
                  {doc.highlights.map((h, i) => (
                    <li key={h.id ?? i} className="flex gap-4 border-b border-line py-4">
                      <span className="text-caption muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-normal">{h.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {!!service?.process?.length && (
        <section className="container-site pb-20 md:pb-28" aria-labelledby="surec">
          <div className="grid-site gap-y-10 border-t border-line pt-5">
            <div className="col-span-4 md:col-span-3">
              <h2 id="surec" className="text-[16px] font-normal">
                Nasıl çalışıyoruz
              </h2>
            </div>
            <ol className="col-span-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:col-span-9 lg:grid-cols-4">
              {service.process.map((s, i) => (
                <li key={s.id ?? i} className="flex flex-col gap-3">
                  <span className="t-list muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-[19px] font-medium tracking-tight">{s.title}</h3>
                  {s.text && <p className="text-[16px] text-ink-secondary">{s.text}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <RenderBlocks blocks={doc.layout} />

      {partner && Array.isArray(partner.relatedServices) && partner.relatedServices.length > 0 && (
        <section className="container-site section">
          <h2 className="mb-8 text-[16px] font-normal">İlgili hizmetler</h2>
          <ServiceCards
            items={partner.relatedServices
              .filter((s): s is Service => typeof s === 'object')
              .map((s) => ({ title: s.title, summary: s.summary, href: docPath('services', s.slug) }))}
          />
        </section>
      )}

      <section className="container-site section" aria-labelledby="projeler">
        <div className="mb-10 flex items-baseline justify-between gap-6 border-t border-line pt-5">
          <h2 id="projeler" className="text-[16px] font-normal">
            {doc.title} projeleri <span className="muted">({projects.length})</span>
          </h2>
          <Link href="/portfolyo" className="group shrink-0 text-[16px]">
            <span className="link-line">Tüm işler</span> <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {projects.length ? (
          <GalleryGrid items={projects.slice(0, 4).map(toGalleryItem)} priorityCount={0} />
        ) : (
          <p className="muted max-w-xl">
            Bu alandaki case study&apos;ler hazırlanıyor. Benzer bir proje için{' '}
            <Link href={contactHref} className="underline underline-offset-4">
              bize yazın
            </Link>
            .
          </p>
        )}
      </section>

      {suggestions && suggestions.items.length > 0 && (
        <section className="section">
          <div className="container-site">
            <h2 className="mb-8 text-[16px] font-normal">{suggestions.title}</h2>
            <ServiceCards items={suggestions.items} columns={3} />
          </div>
        </section>
      )}

      <nav aria-label={`Diğer ${k.group.toLocaleLowerCase('tr')}`} className="container-site section">
        <h2 className="mb-6 text-[16px] font-normal">Diğer {k.group.toLocaleLowerCase('tr')}</h2>
        <ul className="flex flex-wrap gap-2">
          {siblings
            .filter((s) => s.id !== doc.id)
            .map((s) => (
              <li key={s.id}>
                <Link href={docPath(kind, s.slug)} className="chip">
                  {s.title}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      <JsonLd
        data={[
          k.schema
            ? {
                '@context': 'https://schema.org',
                '@type': 'Service',
                '@id': absoluteURL(`${path}#service`),
                name: doc.title,
                description: doc.summary,
                url: absoluteURL(path),
                provider: { '@id': ORG_ID },
                areaServed: 'TR',
                serviceType: doc.title,
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: doc.title,
                description: doc.summary,
                url: absoluteURL(path),
                about: { '@type': 'Thing', name: doc.title },
                publisher: { '@id': ORG_ID },
              },
          faqSchema(faqs),
        ]}
      />
    </>
  )
}
