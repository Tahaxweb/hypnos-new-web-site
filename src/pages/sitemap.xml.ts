import type { APIRoute } from 'astro'

import { getPages, getPartners, getPosts, getProjects, getSectors, getServices } from '@/lib/data'
import { absoluteURL, docPath, type RoutedCollection } from '@/lib/paths'

type Doc = { slug: string; updatedAt: string; isSample?: boolean | null; meta?: { noindex?: boolean | null } | null }
type Entry = { url: string; lastmod?: string; priority: number }

export const GET: APIRoute = () => {
  const [projects, services, sectors, partners, pages, posts] = [getProjects(), getServices(), getSectors(), getPartners(), getPages(), getPosts()]
  // noindex veya örnek içerik olarak işaretlenen sayfalar site haritasına girmez
  const entries = (collection: RoutedCollection, docs: Doc[], priority: number): Entry[] =>
    docs.filter((d) => !d.isSample && !d.meta?.noindex).map((d) => ({ url: absoluteURL(docPath(collection, d.slug)), lastmod: d.updatedAt, priority }))
  const latest = [...projects, ...services, ...pages].map((d) => d.updatedAt).sort().pop()

  const all: Entry[] = [
    { url: absoluteURL('/'), lastmod: latest, priority: 1 },
    { url: absoluteURL('/neler-yapiyoruz'), lastmod: latest, priority: 0.8 },
    { url: absoluteURL('/portfolyo'), lastmod: latest, priority: 0.9 },
    { url: absoluteURL('/iletisim'), priority: 0.6 },
    { url: absoluteURL('/blog'), lastmod: posts[0]?.updatedAt, priority: 0.7 },
    ...entries('projects', projects, 0.8),
    ...entries('services', services, 0.8),
    ...entries('sectors', sectors, 0.7),
    ...entries('partners', partners, 0.6),
    ...entries('pages', pages, 0.5),
    ...entries('posts', posts, 0.6),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all
    .map((e) => `  <url><loc>${e.url}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<priority>${e.priority}</priority></url>`)
    .join('\n')}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
