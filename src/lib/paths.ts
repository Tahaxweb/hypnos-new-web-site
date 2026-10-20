export type RoutedCollection = 'projects' | 'services' | 'sectors' | 'partners' | 'pages' | 'posts'

export const COLLECTION_PREFIX: Record<RoutedCollection, string> = {
  projects: '/portfolyo',
  services: '/hizmetler',
  sectors: '/sektorler',
  partners: '/partnerler',
  pages: '',
  posts: '/blog',
}

export function docPath(collection: RoutedCollection, slug?: string | null): string {
  if (!slug) return COLLECTION_PREFIX[collection] || '/'
  return `${COLLECTION_PREFIX[collection]}/${slug}`
}

export function getServerURL(): string {
  const url = import.meta.env.PUBLIC_SERVER_URL || 'https://www.hypnosinteractive.com'
  return String(url).replace(/\/$/, '')
}

export const absoluteURL = (path: string) =>
  /^https?:\/\//.test(path) ? path : `${getServerURL()}${path.startsWith('/') ? path : `/${path}`}`

/** Medya adresleri artık sitenin kendi /media klasöründen sunulur; olduğu gibi döndürülür. */
export function localURL(url?: string | null): string {
  return url || ''
}
