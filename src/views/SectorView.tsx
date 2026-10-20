
import { TaxonomyPage } from '@/components/site/TaxonomyPage'
import { getSector, getSectors, getProjects, getPublishedSlugs, getServices, populated, relId } from '@/lib/data'
import { docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { docMetadata } from '@/lib/seo'

export function meta({ slug }: { slug: string }): PageMeta {
  const doc = getSector(slug)
  if (!doc) return { path: '/' }
  return docMetadata(doc, docPath('sectors', doc.slug), doc.summary)
}

export function SectorPage({ slug }: { slug: string }) {
  const doc = getSector(slug)
  if (!doc) return null
  const [siblings, all] = [getSectors(), getProjects()]
  const projects = all.filter((p) => populated<{ id: number }>(p.sectors).some((x) => relId(x) === doc.id))
  return <TaxonomyPage kind="sectors" doc={doc} siblings={siblings} projects={projects} suggestions={{ title: 'Bu sektörde sunduğumuz hizmetler', items: (getServices()).map((s) => ({ title: s.title, summary: s.summary, href: docPath('services', s.slug) })) }} />
}
