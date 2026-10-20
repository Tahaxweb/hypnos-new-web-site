import Link from '@/shims/Link'

import { ServiceCards } from '@/components/blocks/Dynamic'
import { ServiceRows } from '@/components/site/ServiceRows'
import { Arrow } from '@/components/site/Arrow'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { getPageTexts, getPartners, getSectors, getServices } from '@/lib/data'
import { ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { buildMetadata } from '@/lib/seo'

export function meta(): PageMeta {
  const t = (getPageTexts()).whatWeDo
  return buildMetadata({ title: t?.metaTitle || t?.heading || 'Neler Yapıyoruz', description: t?.metaDescription || t?.intro, path: '/neler-yapiyoruz' })
}

export function WhatWeDoPage() {
  const [services, sectors, partners, texts] = [getServices(), getSectors(), getPartners(), getPageTexts()]
  const t = texts.whatWeDo

  return (
    <>
      <PageHero title={t?.heading || 'Neler Yapıyoruz'} accent={t?.accent} intro={t?.intro} crumbs={[{ name: 'Neler Yapıyoruz', path: '/neler-yapiyoruz' }]}>
        <nav aria-label="Bu sayfada" className="mt-10 flex flex-wrap gap-2">
          <a href="#hizmetler" className="chip">Hizmetler <span className="ml-2 muted">{services.length}</span></a>
          <a href="#sektorler" className="chip">Sektörler <span className="ml-2 muted">{sectors.length}</span></a>
          <a href="#partnerler" className="chip">Partnerler <span className="ml-2 muted">{partners.length}</span></a>
        </nav>
      </PageHero>

      <section id="hizmetler" className="container-site pb-20 md:pb-28" aria-labelledby="h-hizmetler">
        <div className="grid-site gap-y-8">
          <div className="col-span-4 md:col-span-3">
            <h2 id="h-hizmetler" className="text-[16px] font-normal">Hizmetler</h2>
          </div>
          <div className="col-span-4 md:col-span-9">
            <ServiceCards items={services.map((s) => ({ title: s.title, summary: s.summary, href: docPath('services', s.slug) }))} />
          </div>
        </div>
      </section>

      <section id="sektorler" className="container-site pb-20 md:pb-28" aria-labelledby="h-sektorler">
        <div className="grid-site gap-y-8">
          <div className="col-span-4 md:col-span-3">
            <h2 id="h-sektorler" className="text-[16px] font-normal">Sektörler</h2>
          </div>
          <div className="col-span-4 md:col-span-9">
            <ServiceRows items={sectors.map((s) => ({ title: s.title, summary: s.summary, href: docPath('sectors', s.slug) }))} />
          </div>
        </div>
      </section>

      <section id="partnerler" className="container-site pb-20 md:pb-28" aria-labelledby="h-partnerler">
        <div className="grid-site gap-y-8">
          <div className="col-span-4 md:col-span-3">
            <h2 id="h-partnerler" className="text-[16px] font-normal">Partnerler</h2>
          </div>
          <div className="col-span-4 md:col-span-9">
            <ServiceCards items={partners.map((s) => ({ title: s.title, summary: s.summary, href: docPath('partners', s.slug) }))} />
          </div>
        </div>
      </section>

      <section className="container-site pb-24 md:pb-36">
        <div className="border-t border-line pt-10">
          <p className="t-hero max-w-[26ch]">Hangi hizmetin size uygun olduğundan emin değil misiniz? İhtiyacınızı anlatın, birlikte netleştirelim.</p>
          <Link href="/iletisim" className="btn btn-lg mt-10">
            Projenizi konuşalım <Arrow />
          </Link>
        </div>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: 'Hypnos Interactive hizmetleri',
          url: absoluteURL('/neler-yapiyoruz'),
          provider: { '@id': ORG_ID },
          itemListElement: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, description: s.summary, url: absoluteURL(docPath('services', s.slug)) },
          })),
        }}
      />
    </>
  )
}
