
import { TaxonomyPage } from '@/components/site/TaxonomyPage'
import { getPartner, getPartners, getProjects, getPublishedSlugs, relId } from '@/lib/data'
import { docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { docMetadata } from '@/lib/seo'

export function meta({ slug }: { slug: string }): PageMeta {
  const doc = getPartner(slug)
  if (!doc) return { path: '/' }
  return docMetadata(doc, docPath('partners', doc.slug), doc.summary)
}

export function PartnerPage({ slug }: { slug: string }) {
  const doc = getPartner(slug)
  if (!doc) return null
  const [siblings, all] = [getPartners(), getProjects()]
  const projects = all.filter((p) => (p.partners ?? []).some((x) => relId(x) === doc.id))
  return <TaxonomyPage kind="partners" doc={doc} siblings={siblings} projects={projects} suggestions={undefined} />
}
