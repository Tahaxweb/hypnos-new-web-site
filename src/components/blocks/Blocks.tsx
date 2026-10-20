import Link from '@/shims/Link'

import type {
  CtaBlock as CtaT,
  FaqBlock as FaqT,
  GalleryBlock as GalleryT,
  MediaBlock as MediaT,
  MediaTextBlock as MediaTextT,
  ProjectFactsBlock as FactsT,
  QuoteBlock as QuoteT,
  StatsBlock as StatsT,
  TextBlock as TextT,
  TwoColumnsBlock as TwoColT,
  VideoBlock as VideoT,
} from '@/payload-types'
import { Arrow } from '@/components/site/Arrow'
import { Media } from '@/components/site/Media'
import { RichText } from '@/components/site/RichText'
import { BlockHeading, Section } from './Section'

export function TextBlock({ block }: { block: TextT }) {
  const center = block.appearance?.align === 'center'
  return (
    <Section appearance={block.appearance}>
      <BlockHeading center={center}>{block.heading}</BlockHeading>
      <RichText data={block.content} />
    </Section>
  )
}

export function TwoColumnsBlock({ block }: { block: TwoColT }) {
  return (
    <Section appearance={{ ...block.appearance, width: block.appearance?.width === 'narrow' ? 'default' : block.appearance?.width }}>
      <BlockHeading>{block.heading}</BlockHeading>
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <RichText data={block.left} />
        <RichText data={block.right} />
      </div>
    </Section>
  )
}

export function MediaTextBlock({ block }: { block: MediaTextT }) {
  const right = block.mediaPosition === 'right'
  const cols = block.ratio === 'media' ? ['md:col-span-7', 'md:col-span-5'] : block.ratio === 'text' ? ['md:col-span-5', 'md:col-span-7'] : ['md:col-span-6', 'md:col-span-6']
  return (
    <Section appearance={{ ...block.appearance, width: 'wide', label: null }}>
      {block.appearance?.label && <p className="t-label muted mb-6">{block.appearance.label}</p>}
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-16">
        <figure className={`${cols[0]} ${right ? 'md:order-2' : ''}`}>
          <Media media={block.media} className="media-frame w-full" sizes="(min-width: 768px) 50vw, 100vw" />
          {block.caption && <figcaption className="mt-3 text-caption muted">{block.caption}</figcaption>}
        </figure>
        <div className={cols[1]}>
          <BlockHeading>{block.heading}</BlockHeading>
          <RichText data={block.content} />
        </div>
      </div>
    </Section>
  )
}

export function MediaBlock({ block }: { block: MediaT }) {
  const full = block.appearance?.width === 'full'
  return (
    <Section appearance={block.appearance} fullBleed>
      <figure className={full ? '' : ''}>
        <Media
          media={block.media}
          aspect={block.aspect}
          className={full ? 'w-full overflow-hidden [&_img]:object-cover' : 'media-frame w-full'}
          sizes={full ? '100vw' : '(min-width: 1440px) 1376px, 100vw'}
        />
        {block.caption && <figcaption className={`mt-3 text-caption muted ${full ? 'container-site' : ''}`}>{block.caption}</figcaption>}
      </figure>
    </Section>
  )
}

export function GalleryBlock({ block }: { block: GalleryT }) {
  const items = block.items ?? []
  const layout = block.layout ?? 'grid2'
  const grid = layout === 'grid3' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <Section appearance={{ ...block.appearance, width: block.appearance?.width === 'narrow' ? 'default' : block.appearance?.width }}>
      <BlockHeading>{block.heading}</BlockHeading>
      <ul className={`grid grid-cols-1 gap-4 md:gap-6 ${grid}`}>
        {items.map((it, i) => {
          const big = layout === 'mosaic' && i === 0
          return (
            <li key={it.id ?? i} className={big ? 'sm:col-span-2' : ''}>
              <figure>
                <Media
                  media={it.media}
                  aspect={big ? '16/9' : '4/3'}
                  className="media-frame w-full"
                  sizes={big ? '100vw' : layout === 'grid3' ? '(min-width: 1024px) 33vw, 50vw' : '50vw'}
                />
                {it.caption && <figcaption className="mt-3 text-caption muted">{it.caption}</figcaption>}
              </figure>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

function embedSrc(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu')) {
      const id = u.hostname === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') || u.pathname.split('/').pop()
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null
    }
    if (u.hostname.includes('vimeo')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${encodeURIComponent(id)}?dnt=1` : null
    }
  } catch {}
  return null
}

export function VideoBlock({ block }: { block: VideoT }) {
  const src = block.source === 'embed' && block.embedUrl ? embedSrc(block.embedUrl) : null
  return (
    <Section appearance={block.appearance} fullBleed>
      <figure>
        {src ? (
          <div className="media-frame aspect-video">
            <iframe
              src={src}
              title={block.caption || 'Proje videosu'}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <Media media={block.file} poster={block.poster} ambient={Boolean(block.ambient)} aspect="16/9" className="media-frame w-full" />
        )}
        {block.caption && <figcaption className="mt-3 text-caption muted">{block.caption}</figcaption>}
      </figure>
    </Section>
  )
}

export function StatsBlock({ block }: { block: StatsT }) {
  const items = block.items ?? []
  return (
    <Section appearance={{ ...block.appearance, width: block.appearance?.width === 'narrow' ? 'default' : block.appearance?.width }}>
      <BlockHeading>{block.heading}</BlockHeading>
      {block.intro && <RichText data={block.intro} className="mb-10" />}
      <dl className={`grid gap-px overflow-hidden ${items.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {items.map((it, i) => (
          <div key={it.id ?? i} className="flex flex-col border-t border-current/20 pt-6 pb-8 pr-6">
            <dd className="order-1 t-display-sm">{it.value}</dd>
            <dt className="order-2 mt-3 text-lead font-normal">{it.label}</dt>
            <dd className="order-3 mt-3 text-caption muted">Kaynak: {it.source}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

export function QuoteBlock({ block }: { block: QuoteT }) {
  return (
    <Section appearance={block.appearance}>
      <figure>
        <blockquote className="t-heading-xl">
          <p>“{block.quote}”</p>
        </blockquote>
        <figcaption className="mt-8 flex flex-col">
          <span className="text-heading-sm font-semibold">{block.author}</span>
          {block.role && <span className="muted">{block.role}</span>}
        </figcaption>
      </figure>
    </Section>
  )
}

export type FactsData = {
  client?: string | null
  sectors?: { title: string; href: string }[]
  services?: { title: string; href: string }[]
  year?: number | null
  liveUrl?: string | null
}

export function ProjectFactsBlock({ block, facts }: { block: FactsT; facts?: FactsData }) {
  if (!facts) return null
  return (
    <Section appearance={{ ...block.appearance, width: 'wide' }}>
      <ProjectFacts facts={facts} />
    </Section>
  )
}

export function ProjectFacts({ facts }: { facts: FactsData }) {
  const rows: { k: string; v: React.ReactNode }[] = []
  if (facts.client) rows.push({ k: 'Müşteri', v: facts.client })
  if (facts.sectors?.length)
    rows.push({ k: 'Sektör', v: facts.sectors.map((s, i) => <span key={s.href}>{i > 0 && ', '}<Link href={s.href} className="underline-offset-4 hover:underline">{s.title}</Link></span>) })
  if (facts.services?.length)
    rows.push({ k: 'Hizmetler', v: facts.services.map((s, i) => <span key={s.href}>{i > 0 && ', '}<Link href={s.href} className="underline-offset-4 hover:underline">{s.title}</Link></span>) })
  if (facts.year) rows.push({ k: 'Yıl', v: facts.year })
  if (facts.liveUrl)
    rows.push({
      k: 'Proje',
      v: (
        <a href={facts.liveUrl} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
          {facts.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} <span aria-hidden="true">↗</span>
          <span className="sr-only"> (yeni sekmede açılır)</span>
        </a>
      ),
    })
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-current/20 pt-5 md:grid-cols-5">
      {rows.map((r) => (
        <div key={r.k}>
          <dt className="text-caption muted">{r.k}</dt>
          <dd className="mt-1.5 text-[16px] font-normal">{r.v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function CtaBlock({ block }: { block: CtaT }) {
  const center = block.appearance?.align === 'center'
  return (
    <Section appearance={block.appearance}>
      <div className={center ? 'flex flex-col items-center' : ''}>
        <h2 className="t-heading-xl max-w-3xl">{block.heading}</h2>
        {block.text && <p className="t-intro muted mt-6 max-w-2xl">{block.text}</p>}
        {block.linkUrl && (
          <Link href={block.linkUrl} className="btn btn-lg mt-10">
            {block.linkLabel || 'Projenizi konuşalım'} <Arrow />
          </Link>
        )}
      </div>
    </Section>
  )
}

export function FaqBlock({ block }: { block: FaqT }) {
  return (
    <Section appearance={block.appearance}>
      <BlockHeading>{block.heading || 'Sık sorulan sorular'}</BlockHeading>
      <div className="divide-y divide-current/15 border-y border-current/15">
        {(block.items ?? []).map((q, i) => (
          <details key={q.id ?? i} className="group/faq">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-heading-sm font-semibold [&::-webkit-details-marker]:hidden">
              <h3>{q.question}</h3>
              <span aria-hidden="true" className="mt-0.5 text-xl leading-none transition-transform group-open/faq:rotate-45">+</span>
            </summary>
            <p className="muted pb-6 max-w-3xl whitespace-pre-line">{q.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
