'use client'

import Image from '@/shims/Image'
import Link from '@/shims/Link'

import { notifySearchChange, useSearchParam } from '@/lib/hooks'

export type BlogCard = {
  href: string
  title: string
  excerpt: string
  date: string
  dateISO?: string | null
  minutes: number
  categories: { slug: string; title: string }[]
  image?: { url: string; alt: string }
}

/** Blog listesi; kategori filtresi adres çubuğuna yazılır (?kategori=…). Tüm yazılar HTML'de bulunur. */
export function BlogList({ posts, categories }: { posts: BlogCard[]; categories: { slug: string; title: string }[] }) {
  const active = useSearchParam('kategori')
  const choose = (slug: string | null) => {
    const url = new URL(window.location.href)
    if (slug) url.searchParams.set('kategori', slug)
    else url.searchParams.delete('kategori')
    window.history.replaceState(null, '', url)
    notifySearchChange()
  }
  const used = categories.filter((c) => posts.some((p) => p.categories.some((x) => x.slug === c.slug)))
  const visible = active ? posts.filter((p) => p.categories.some((c) => c.slug === active)) : posts
  const [lead, ...rest] = visible

  return (
    <>
      {used.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5" role="group" aria-label="Kategoriye göre filtrele">
          <button type="button" className="chip" aria-pressed={!active} onClick={() => choose(null)}>
            Tümü
          </button>
          {used.map((c) => (
            <button key={c.slug} type="button" className="chip" aria-pressed={active === c.slug} onClick={() => choose(c.slug)}>
              {c.title}
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {visible.length} yazı gösteriliyor
      </p>

      {lead && (
        <article className="group relative mt-12 grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="media-frame hover-zoom relative aspect-[16/10] md:col-span-7">
            {lead.image && <Image src={lead.image.url} alt={lead.image.alt} fill priority sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />}
          </div>
          <div className="flex flex-col md:col-span-5">
            <Meta post={lead} />
            <h2 className="mt-4 text-[clamp(1.75rem,1.2rem+1.8vw,2.75rem)] leading-[1.1] tracking-[-0.025em]">
              <Link href={lead.href} className="link-line after:absolute after:inset-0 after:content-['']">
                {lead.title}
              </Link>
            </h2>
            <p className="mt-5 max-w-[46ch] text-[18px] leading-relaxed text-ink-secondary">{lead.excerpt}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[17px]" aria-hidden="true">
              Yazıyı oku <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <ul className="mt-16 grid gap-x-6 gap-y-14 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <li key={p.href}>
              <article className="group relative">
                <div className="media-frame hover-zoom relative aspect-[4/3]">
                  {p.image && <Image src={p.image.url} alt={p.image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
                </div>
                <div className="mt-4">
                  <Meta post={p} />
                  <h2 className="mt-2 text-[21px] leading-snug font-medium tracking-tight">
                    <Link href={p.href} className="link-line after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[16px] leading-relaxed text-ink-secondary">{p.excerpt}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {visible.length === 0 && <p className="mt-12 text-[18px] text-ink-secondary">Bu kategoride henüz yazı yok.</p>}
    </>
  )
}

function Meta({ post }: { post: BlogCard }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-ink-muted">
      {post.categories[0] && <span className="text-ink">{post.categories[0].title}</span>}
      {post.date && <time dateTime={post.dateISO || undefined}>{post.date}</time>}
      <span>{post.minutes} dk okuma</span>
    </p>
  )
}
