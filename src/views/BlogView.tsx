
import { BlogList, type BlogCard } from '@/components/site/BlogList'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { getCategories, getPosts, populated } from '@/lib/data'
import { ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath, localURL } from '@/lib/paths'
import { formatDate, readingMinutes } from '@/lib/reading'
import type { PageMeta } from '@/lib/seo'
import { buildMetadata } from '@/lib/seo'

export const meta: PageMeta = buildMetadata({
  title: 'Blog',
  description: 'Marka, reklam, dijital pazarlama, web ve e-ticaret üzerine Hypnos Interactive ekibinden yazılar.',
  path: '/blog',
})

export function BlogPage() {
  const [posts, categories] = [getPosts(), getCategories()]
  const cards: BlogCard[] = posts.map((p) => {
    const cover = p.cover && typeof p.cover === 'object' ? p.cover : null
    return {
      href: docPath('posts', p.slug),
      title: p.title,
      excerpt: p.excerpt,
      date: formatDate(p.publishedAt),
      dateISO: p.publishedAt,
      minutes: readingMinutes(p.content),
      categories: populated<{ slug: string; title: string }>(p.categories).map((c) => ({ slug: c.slug, title: c.title })),
      image: cover?.url ? { url: localURL(cover.sizes?.card?.url || cover.url), alt: cover.alt } : undefined,
    }
  })

  return (
    <>
      <PageHero title="Blog" accent="Blog" intro="Marka, reklam ve dijital üzerine notlar." crumbs={[{ name: 'Blog', path: '/blog' }]} label={`${posts.length} yazı`} />
      <section className="container-site pb-28 md:pb-40">
        {cards.length ? (
          <BlogList posts={cards} categories={categories.map((c) => ({ slug: c.slug, title: c.title }))} />
        ) : (
          <p className="border-t border-line pt-8 text-[18px] text-ink-secondary">İlk yazılar hazırlanıyor.</p>
        )}
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Hypnos Interactive Blog',
          url: absoluteURL('/blog'),
          publisher: { '@id': ORG_ID },
          blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: absoluteURL(docPath('posts', p.slug)), datePublished: p.publishedAt || undefined })),
        }}
      />
    </>
  )
}
