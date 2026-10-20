
import { collectFaqs, RenderBlocks } from '@/components/blocks/RenderBlocks'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { SampleNotice } from '@/components/site/SampleNotice'
import { getPage, getPublishedSlugs } from '@/lib/data'
import { faqSchema, ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { docMetadata } from '@/lib/seo'

export function meta({ slug }: { slug: string }): PageMeta {
  const page = getPage(slug)
  if (!page) return { path: '/' }
  return docMetadata(page, docPath('pages', page.slug), page.intro)
}

export function PageView({ slug }: { slug: string }) {
  const page = getPage(slug)
  if (!page) return null

  const isAbout = page.slug === 'hakkimizda'
  return (
    <>
      <SampleNotice show={page.isSample} what="Bu sayfanın metni" />
      <PageHero title={page.heading || page.title} accent={page.accent} intro={page.intro} crumbs={[{ name: page.title, path: docPath('pages', page.slug) }]} />
      <RenderBlocks blocks={page.layout} />
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': isAbout ? 'AboutPage' : 'WebPage',
            name: page.title,
            description: page.meta?.description || page.intro || undefined,
            url: absoluteURL(docPath('pages', page.slug)),
            inLanguage: 'tr-TR',
            ...(isAbout ? { mainEntity: { '@id': ORG_ID } } : { publisher: { '@id': ORG_ID } }),
            dateModified: page.updatedAt,
          },
          faqSchema(collectFaqs(page.layout)),
        ]}
      />
    </>
  )
}
