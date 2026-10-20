import Image from '@/shims/Image'
import Link from '@/shims/Link'

import { getPartners, getProjects, getSectors, getServices, getSiteSettings, populated } from '@/lib/data'
import { docPath, localURL } from '@/lib/paths'
import { NavClient, type NavGroup } from './NavClient'

export function Header({ pathname }: { pathname: string }) {
  const [services, sectors, partners, settings, projects] = [getServices(), getSectors(), getPartners(), getSiteSettings(), getProjects()]

  // Menü önizlemesi: her hizmet için o hizmetin verildiği ilk projenin kapak görseli
  const coverFor = (serviceId: number) => {
    const p = projects.find((x) => populated<{ id: number }>(x.services).some((s) => s.id === serviceId) && typeof x.cover === 'object' && x.cover?.url)
    const c = p && typeof p.cover === 'object' ? p.cover : null
    return c?.url ? { url: localURL(c.sizes?.card?.url || c.url), alt: c.alt, project: p!.client } : undefined
  }

  const groups: NavGroup[] = [
    {
      title: 'Hizmetler',
      href: '/neler-yapiyoruz#hizmetler',
      items: services.map((s) => ({ label: s.title, href: docPath('services', s.slug), summary: s.summary, image: coverFor(s.id) })),
    },
    { title: 'Sektörler', href: '/neler-yapiyoruz#sektorler', items: sectors.map((s) => ({ label: s.title, href: docPath('sectors', s.slug) })) },
    { title: 'Partnerler', href: '/neler-yapiyoruz#partnerler', items: partners.map((s) => ({ label: s.title, href: docPath('partners', s.slug) })) },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface/85 backdrop-blur-md">
      <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Ana sayfa">
          {/* Resmî yatay logo (Kurumsal İletişim/Hypnos Logo/hypnos-black-logo.svg) */}
          <Image src="/brand/hypnos-logo-black.svg" alt="Hypnos Interactive" width={1189} height={146} priority className="h-[22px] w-auto md:h-6" />
        </Link>
        <NavClient groups={groups} availability={settings.availability} pathname={pathname} />
      </div>
    </header>
  )
}
