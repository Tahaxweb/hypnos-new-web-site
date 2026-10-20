
import { TaxonomyPage } from '@/components/site/TaxonomyPage'
import { getService, getServices, getProjects, getPublishedSlugs, getSectors, populated, relId } from '@/lib/data'
import { docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { docMetadata } from '@/lib/seo'

export function meta({ slug }: { slug: string }): PageMeta {
  const doc = getService(slug)
  if (!doc) return { path: '/' }
  return docMetadata(doc, docPath('services', doc.slug), doc.summary)
}

export function ServicePage({ slug }: { slug: string }) {
  const doc = getService(slug)
  if (!doc) return null
  const [siblings, all] = [getServices(), getProjects()]
  const projects = all.filter((p) => populated<{ id: number }>(p.services).some((x) => relId(x) === doc.id))
  return <TaxonomyPage kind="services" doc={doc} siblings={siblings} projects={projects} suggestions={{ title: 'Bu hizmetin uygulandığı sektörler', items: (getSectors()).map((s) => ({ title: s.title, summary: s.summary, href: docPath('sectors', s.slug) })) }} />
}
