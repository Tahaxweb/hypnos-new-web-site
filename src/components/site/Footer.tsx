import Link from '@/shims/Link'

import { getPartners, getSectors, getServices, getSiteSettings } from '@/lib/data'
import { docPath } from '@/lib/paths'
import { Arrow } from './Arrow'

export function Footer() {
  const [services, sectors, partners, s] = [getServices(), getSectors(), getPartners(), getSiteSettings()]
  const year = new Date().getFullYear()

  const cols = [
    { title: 'Hizmetler', links: services.map((x) => ({ label: x.title, href: docPath('services', x.slug) })) },
    { title: 'Sektörler', links: sectors.map((x) => ({ label: x.title, href: docPath('sectors', x.slug) })) },
    {
      title: 'Stüdyo',
      links: [
        { label: 'Neler yapıyoruz', href: '/neler-yapiyoruz' },
        { label: 'Portfolyo', href: '/portfolyo' },
        { label: 'Blog', href: '/blog' },
        { label: 'Hakkımızda', href: '/hakkimizda' },
        { label: 'İletişim', href: '/iletisim' },
        ...partners.map((x) => ({ label: `${x.title} partnerliği`, href: docPath('partners', x.slug) })),
      ],
    },
  ]

  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="container-site pt-20 md:pt-28">
        {/* Kapanış çağrısı */}
        <div className="grid-site gap-y-8">
          <p className="col-span-4 text-[16px] md:col-span-3">Yeni bir proje mi?</p>
          <div className="col-span-4 md:col-span-9">
            <Link href="/iletisim" className="group inline-flex items-baseline gap-4">
              <span className="t-hero link-line">Projenizi konuşalım</span>
              <span className="t-hero transition-transform duration-500 group-hover:translate-x-2">
                <Arrow />
              </span>
            </Link>
            <p className="mt-6">
              <a href={`mailto:${s.email}`} className="link-line text-lead">
                {s.email}
              </a>
              {s.phone && (
                <>
                  <span className="muted"> · </span>
                  <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="link-line text-lead">
                    {s.phone}
                  </a>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid-site mt-24 gap-y-10 border-t border-line pt-6">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="col-span-2 md:col-span-3">
              <p className="text-[16px] text-ink-secondary">{c.title}</p>
              <ul className="mt-4 space-y-1.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-line text-[16px]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-2 md:col-span-3">
            <p className="text-[16px] text-ink-secondary">Takip edin</p>
            {!!s.socials?.length && (
              <ul className="mt-4 space-y-1.5">
                {s.socials.map((x) => (
                  <li key={x.url}>
                    <a href={x.url} className="group link-line text-[16px]" rel="noopener me" target="_blank">
                      {x.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (yeni sekmede açılır)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {(s.address || s.city) && (
              <address className="mt-6 text-[16px] not-italic leading-relaxed text-ink-secondary">
                <span className="block text-caption text-ink-muted">Ofis</span>
                {s.address && <span className="block">{s.address}</span>}
                <span className="block">{[s.postalCode, [s.district, s.city].filter(Boolean).join('/')].filter(Boolean).join(' ')}</span>
                {s.mapUrl && (
                  <a href={s.mapUrl} target="_blank" rel="noopener" className="link-line mt-1 inline-block text-ink">
                    Haritada aç <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (yeni sekmede açılır)</span>
                  </a>
                )}
              </address>
            )}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 text-caption muted md:flex-row md:items-center md:justify-between">
          <p>© {year} Hypnos Interactive. Tüm hakları saklıdır.</p>
          <ul className="flex gap-6">
            <li>
              <Link href="/kvkk" className="link-line">KVKK Aydınlatma Metni</Link>
            </li>
            <li>
              <Link href="/cerez-politikasi" className="link-line">Çerez Politikası</Link>
            </li>
          </ul>
        </div>

        {/* Ekran genişliğinde marka yazısı */}
        {/*
          Yazı boyutu footer'ın iç genişliğine bağlı (cqw): her ekranda kenardan kenara sığar, sağdan taşmaz.
          Alttan %25'i kesik: harfler 0,077em–0,961em arasında; üstte © için 0,14em pay bırakılır.
        */}
        <div aria-hidden="true" className="@container mt-8 select-none">
          <div className="t-wordmark flex h-[0.88em] justify-center overflow-hidden pt-[0.14em]" style={{ fontSize: '11.2cqw' }}>
            <span className="block">
              Hypnos Interactive<sup className="ml-[0.04em] align-top text-[0.3em] leading-none tracking-normal">©</sup>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
