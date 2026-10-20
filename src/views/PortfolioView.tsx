
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { PortfolioFilter, type PortfolioItem } from '@/components/site/PortfolioFilter'
import { getPageTexts, getProjects, getSectors, getServices, populated } from '@/lib/data'
import { absoluteURL, docPath } from '@/lib/paths'
import { toGalleryItem } from '@/components/site/ProjectCard'
import type { PageMeta } from '@/lib/seo'
import { buildMetadata } from '@/lib/seo'

export function meta(): PageMeta {
  const t = (getPageTexts()).portfolio
  return buildMetadata({ title: t?.metaTitle || t?.heading || 'Portfolyo', description: t?.metaDescription || t?.intro, path: '/portfolyo' })
}

export function PortfolioPage() {
  const [projects, services, sectors, texts] = [getProjects(), getServices(), getSectors(), getPageTexts()]
  const t = texts.portfolio

  const items: PortfolioItem[] = projects.map((p) => ({
    ...toGalleryItem(p),
    serviceSlugs: populated<{ slug: string }>(p.services).map((s) => s.slug),
    sectorSlugs: populated<{ slug: string }>(p.sectors).map((s) => s.slug),
  }))

  return (
    <>
      <PageHero title={t?.heading || 'Portfolyo'} accent={t?.accent} intro={t?.intro} crumbs={[{ name: 'Portfolyo', path: '/portfolyo' }]} label={`${projects.length} proje`} />
      <section className="container-site pb-28 md:pb-40">
        <PortfolioFilter
          items={items}
          services={services.map((s) => ({ slug: s.slug, title: s.title }))}
          sectors={sectors.map((s) => ({ slug: s.slug, title: s.title }))}
        />
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: t?.heading || 'Portfolyo',
          url: absoluteURL('/portfolyo'),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteURL(docPath('projects', p.slug)), name: p.title })),
          },
        }}
      />
    </>
  )
}
