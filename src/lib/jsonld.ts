import { absoluteURL } from './paths'

type Settings = {
  siteName?: string | null
  description?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  district?: string | null
  postalCode?: string | null
  mapUrl?: string | null
  lat?: number | null
  lng?: number | null
  foundingYear?: number | null
  socials?: { label: string; url: string }[] | null
}

export const ORG_ID = absoluteURL('/#organization')

export function organizationSchema(s: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: s.siteName || 'Hypnos Interactive',
    url: absoluteURL('/'),
    logo: absoluteURL('/icon.svg'),
    description: s.description || undefined,
    email: s.email || undefined,
    telephone: s.phone || undefined,
    foundingDate: s.foundingYear ? String(s.foundingYear) : undefined,
    address: s.address || s.city
      ? {
          '@type': 'PostalAddress',
          streetAddress: s.address || undefined,
          addressLocality: s.district || s.city || undefined,
          addressRegion: s.city || undefined,
          postalCode: s.postalCode || undefined,
          addressCountry: 'TR',
        }
      : undefined,
    hasMap: s.mapUrl || undefined,
    geo: s.lat && s.lng ? { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } : undefined,
    areaServed: 'TR',
    knowsLanguage: ['tr'],
    sameAs: s.socials?.map((x) => x.url).filter(Boolean),
  }
}

export function websiteSchema(name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteURL('/#website'),
    name,
    url: absoluteURL('/'),
    inLanguage: 'tr-TR',
    publisher: { '@id': ORG_ID },
  }
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteURL(it.path),
    })),
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }
}
