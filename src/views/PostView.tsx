import Link from '@/shims/Link'

import { Arrow } from '@/components/site/Arrow'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { GalleryGrid } from '@/components/site/GalleryGrid'
import { JsonLd } from '@/components/site/JsonLd'
import { Lightbox } from '@/components/site/Lightbox'
import { Media } from '@/components/site/Media'
import { toGalleryItem } from '@/components/site/ProjectCard'
import { RichText } from '@/components/site/RichText'
import { SampleNotice } from '@/components/site/SampleNotice'
import { getPost, getPosts, getPublishedSlugs, populated } from '@/lib/data'
import { ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath } from '@/lib/paths'
import { formatDate, readingMinutes } from '@/lib/reading'
import type { PageMeta } from '@/lib/seo'
import { docMetadata, mediaURL } from '@/lib/seo'
import type { Category, Project } from '@/payload-types'

export function meta({ slug }: { slug: string }): PageMeta {
  const post = getPost(slug)
  if (!post) return { path: '/' }
  return docMetadata(post, docPath('posts', post.slug), post.excerpt, post.cover, 'article')
}

export function PostPage({ slug }: { slug: string }) {
  const post = getPost(slug)
  if (!post) return null

  const categories = populated<Category>(post.categories)
  const related = populated<Project>(post.relatedProjects).filter((p) => p._status !== 'draft')
  const minutes = readingMinutes(post.content)
  const others = (getPosts()).filter((p) => p.id !== post.id).slice(0, 3)
  const path = docPath('posts', post.slug)

  return (
    <article>
      <SampleNotice show={post.isSample} what="Bu yazı" />
      <header className="container-site pt-10 md:pt-14">
        <Breadcrumbs items={[{ name: 'Blog', path: '/blog' }, { name: post.title, path }]} />
        <div className="mx-auto mt-14 max-w-3xl md:mt-20">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[16px] text-ink-muted">
            {categories.map((c) => (
              <Link key={c.id} href={`/blog?kategori=${c.slug}`} className="link-line text-ink">
                {c.title}
              </Link>
            ))}
            {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
            <span>{minutes} dk okuma</span>
          </p>
          <h1 className="t-hero mt-6 hero-line">{post.title}</h1>
          <p className="mt-6 text-[20px] leading-relaxed text-ink-secondary">{post.excerpt}</p>
          {post.byline && <p className="mt-6 text-[16px] text-ink-muted">Yazan: <span className="text-ink">{post.byline}</span></p>}
        </div>
      </header>

      <Lightbox>
        {post.cover && (
          <div className="container-site mt-12 md:mt-16">
            <Media media={post.cover} priority aspect="16/9" sizes="(min-width: 1440px) 1376px, 100vw" className="media-frame w-full" />
          </div>
        )}
        <div className="container-site py-14 md:py-20">
          <RichText data={post.content} className="mx-auto" />
        </div>
      </Lightbox>

      {related.length > 0 && (
        <section className="container-site pb-20" aria-labelledby="ilgili-projeler">
          <h2 id="ilgili-projeler" className="mb-8 border-t border-line pt-5 text-[16px] font-normal">
            İlgili projeler
          </h2>
          <GalleryGrid items={related.map(toGalleryItem)} priorityCount={0} />
        </section>
      )}

      {others.length > 0 && (
        <nav aria-label="Diğer yazılar" className="container-site pb-24 md:pb-32">
          <div className="mb-6 flex items-baseline justify-between gap-6 border-t border-line pt-5">
            <h2 className="text-[16px] font-normal">Diğer yazılar</h2>
            <Link href="/blog" className="group text-[16px]">
              <span className="link-line">Tüm yazılar</span> <Arrow />
            </Link>
          </div>
          <ul className="divide-y divide-line border-b border-line">
            {others.map((p) => (
              <li key={p.id}>
                <Link href={docPath('posts', p.slug)} className="group flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                  <span className="text-[clamp(1.25rem,1rem+0.8vw,1.6rem)] leading-snug tracking-tight transition-transform duration-500 group-hover:translate-x-2">{p.title}</span>
                  <span className="shrink-0 text-[15px] text-ink-muted">{formatDate(p.publishedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': absoluteURL(`${path}#post`),
          headline: post.title,
          description: post.excerpt,
          url: absoluteURL(path),
          image: mediaURL(post.cover, 'og'),
          datePublished: post.publishedAt || undefined,
          dateModified: post.updatedAt,
          inLanguage: 'tr-TR',
          timeRequired: `PT${minutes}M`,
          author: post.byline ? post.byline.split(', ').map((name) => ({ '@type': 'Person', name })) : { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          articleSection: categories.map((c) => c.title),
          mainEntityOfPage: absoluteURL(path),
        }}
      />
    </article>
  )
}
