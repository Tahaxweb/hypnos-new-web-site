import type { APIRoute } from 'astro'

import { getPartners, getPosts, getProjects, getSectors, getServices, getSiteSettings, populated } from '@/lib/data'
import { absoluteURL, docPath } from '@/lib/paths'

/**
 * llms.txt: yapay zekâ sistemleri için sitenin kısa, kaynak gösterilebilir özeti.
 * İçerik panelden üretilir; örnek olarak işaretli içerikler dahil edilmez.
 */
export const GET: APIRoute = () => {
  const [s, services, sectors, partners, projects, posts] = [getSiteSettings(), getServices(), getSectors(), getPartners(), getProjects(), getPosts()]
  const real = <T extends { isSample?: boolean | null }>(list: T[]) => list.filter((x) => !x.isSample)

  const lines = [
    `# ${s.siteName}`,
    '',
    `> ${s.description}`,
    '',
    `- Web sitesi: ${absoluteURL('/')}`,
    `- Konum: ${s.city || 'İstanbul'}, Türkiye`,
    `- E-posta: ${s.email}`,
    ...(s.phone ? [`- Telefon: ${s.phone}`] : []),
    ...(s.socials ?? []).map((x) => `- ${x.label}: ${x.url}`),
    '',
    '## Hizmetler',
    ...services.map((x) => `- [${x.title}](${absoluteURL(docPath('services', x.slug))}): ${x.summary}`),
    '',
    '## Sektörler',
    ...sectors.map((x) => `- [${x.title}](${absoluteURL(docPath('sectors', x.slug))}): ${x.summary}`),
    '',
    '## Platform partnerleri',
    ...partners.map((x) => `- [${x.title}](${absoluteURL(docPath('partners', x.slug))}): ${x.summary}`),
    '',
    '## Case study\'ler',
    ...real(projects).map((p) => {
      const svc = populated<{ title: string }>(p.services).map((x) => x.title).join(', ')
      return `- [${p.client} — ${p.title}](${absoluteURL(docPath('projects', p.slug))})${svc ? ` (${svc})` : ''}: ${p.excerpt}`
    }),
    '',
    ...(real(posts).length ? ['## Blog', ...real(posts).map((p) => `- [${p.title}](${absoluteURL(docPath('posts', p.slug))}): ${p.excerpt}`), ''] : []),
    '## Sayfalar',
    `- [Hakkımızda](${absoluteURL('/hakkimizda')})`,
    `- [Portfolyo](${absoluteURL('/portfolyo')})`,
    `- [Blog](${absoluteURL('/blog')})`,
    `- [İletişim](${absoluteURL('/iletisim')})`,
    '',
  ]
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
