import { getPartners, getProjects, getSectors, getServices, populated } from '@/lib/data'
import { docPath, localURL } from '@/lib/paths'
import type { NavGroup } from './NavClient'

/** Menü grupları: her hizmet için o hizmetin verildiği ilk projenin kapak görseli önizleme olur. */
export function buildNavGroups(): NavGroup[] {
  const [services, sectors, partners, projects] = [getServices(), getSectors(), getPartners(), getProjects()]
  const coverFor = (serviceId: number) => {
    const p = projects.find((x) => populated<{ id: number }>(x.services).some((s) => s.id === serviceId) && typeof x.cover === 'object' && x.cover?.url)
    const c = p && typeof p.cover === 'object' ? p.cover : null
    return c?.url ? { url: localURL(c.sizes?.card?.url || c.url), alt: c.alt, project: p!.client } : undefined
  }
  return [
    {
      title: 'Hizmetler',
      href: '/neler-yapiyoruz#hizmetler',
      items: services.map((s) => ({ label: s.title, href: docPath('services', s.slug), summary: s.summary, image: coverFor(s.id) })),
    },
    { title: 'Sektörler', href: '/neler-yapiyoruz#sektorler', items: sectors.map((s) => ({ label: s.title, href: docPath('sectors', s.slug) })) },
    { title: 'Partnerler', href: '/neler-yapiyoruz#partnerler', items: partners.map((s) => ({ label: s.title, href: docPath('partners', s.slug) })) },
  ]
}
