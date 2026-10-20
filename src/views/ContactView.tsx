
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { getPageTexts, getServices, getSiteSettings } from '@/lib/data'
import { ORG_ID } from '@/lib/jsonld'
import { absoluteURL } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { buildMetadata } from '@/lib/seo'
import { OfficeMap } from '@/components/site/OfficeMap'
import { ContactForm } from './ContactForm'

export function meta(): PageMeta {
  const t = (getPageTexts()).contact
  return buildMetadata({ title: t?.metaTitle || t?.heading || 'İletişim', description: t?.metaDescription || t?.intro, path: '/iletisim' })
}

export function ContactPage() {
  const [texts, services, s] = [getPageTexts(), getServices(), getSiteSettings()]
  const t = texts.contact
  const svc = services.map((x) => ({ slug: x.slug, title: x.title }))
  return (
    <>
      <PageHero title={t?.heading || 'İletişim'} accent={t?.accent} intro={t?.intro} crumbs={[{ name: 'İletişim', path: '/iletisim' }]} />
      <section className="container-site pb-24 md:pb-32">
        <div className="grid-site gap-y-16">
          <aside className="col-span-4 md:col-span-3">
            <h2 className="t-label muted">Doğrudan ulaşın</h2>
            <address className="mt-4 space-y-3 not-italic">
              <a href={`mailto:${s.email}`} className="block font-normal break-all underline-offset-4 hover:underline">
                {s.email}
              </a>
              {s.phone && (
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="block font-normal hover:underline">
                  {s.phone}
                </a>
              )}
              {(s.address || s.city) && (
                <p className="text-ink-secondary">
                  {s.address && <span className="block">{s.address}</span>}
                  <span className="block">{[s.postalCode, [s.district, s.city].filter(Boolean).join('/')].filter(Boolean).join(' ')}</span>
                </p>
              )}
              {s.mapUrl && (
                <a href={s.mapUrl} target="_blank" rel="noopener" className="link-arrow">
                  Haritada aç <span aria-hidden="true">↗</span>
                </a>
              )}
            </address>
            {!!s.socials?.length && (
              <ul className="mt-8 space-y-2">
                {s.socials.map((x) => (
                  <li key={x.url}>
                    <a href={x.url} target="_blank" rel="noopener me" className="link-arrow">
                      {x.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (yeni sekmede açılır)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
          <div className="col-span-4 md:col-span-8 md:col-start-5">
            <h2 className="t-heading-xl mb-10">Proje formu</h2>
            <ContactForm services={svc} />
          </div>
        </div>
      </section>
      {(s.address || (s.lat && s.lng)) && (
        <section aria-label="Ofis konumu" className="container-site pb-24 md:pb-32">
          <OfficeMap
            query={[s.address, s.district, s.city].filter(Boolean).join(', ') || `${s.lat},${s.lng}`}
            mapUrl={s.mapUrl}
            label={[s.address, [s.postalCode, [s.district, s.city].filter(Boolean).join('/')].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
          />
        </section>
      )}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'İletişim', url: absoluteURL('/iletisim'), about: { '@id': ORG_ID } }} />
    </>
  )
}
