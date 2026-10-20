import Link from '@/shims/Link'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { ProjectFacts, type FactsData } from '@/components/blocks/Blocks'
import { Arrow } from '@/components/site/Arrow'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { JsonLd } from '@/components/site/JsonLd'
import { Lightbox } from '@/components/site/Lightbox'
import { Media } from '@/components/site/Media'
import { SampleNotice } from '@/components/site/SampleNotice'
import { getProject, getProjects, getPublishedSlugs, populated } from '@/lib/data'
import { ORG_ID } from '@/lib/jsonld'
import { absoluteURL, docPath } from '@/lib/paths'
import type { PageMeta } from '@/lib/seo'
import { docMetadata, mediaURL } from '@/lib/seo'
import type { Sector, Service } from '@/payload-types'

export function meta({ slug }: { slug: string }): PageMeta {
    const p = getProject(slug)
  if (!p) return { path: '/' }
  return docMetadata(p, docPath('projects', p.slug), p.excerpt, p.cover, 'article')
}

export function CaseStudyPage({ slug }: { slug: string }) {
    const project = getProject(slug)
  if (!project) return null

  const services = populated<Service>(project.services)
  const sectors = populated<Sector>(project.sectors)
  const facts: FactsData = {
    client: project.client,
    year: project.year,
    liveUrl: project.liveUrl,
    services: services.map((s) => ({ title: s.title, href: docPath('services', s.slug) })),
    sectors: sectors.map((s) => ({ title: s.title, href: docPath('sectors', s.slug) })),
  }

  const summary = [
    { key: 'İhtiyaç', id: 'ihtiyac', text: project.challenge },
    { key: 'Yaklaşım', id: 'yaklasim', text: project.approach },
    { key: 'Uygulama', id: 'uygulama', text: project.execution },
    { key: 'Sonuçlar', id: 'sonuclar', text: project.outcome },
  ].filter((x) => x.text)

  const all = getProjects()
  const idx = all.findIndex((p) => p.id === project.id)
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null
  const related = all.filter((p) => p.id !== project.id && populated<Service>(p.services).some((s) => services.some((x) => x.id === s.id))).slice(0, 2)

  return (
    <article>
      <SampleNotice show={project.isSample} what="Bu case study" />
      <header className="container-site pt-10 md:pt-16">
        <Breadcrumbs items={[{ name: 'Portfolyo', path: '/portfolyo' }, { name: project.client, path: docPath('projects', project.slug) }]} />
        <div className="grid-site mt-14 gap-y-6 md:mt-24">
          <p className="col-span-4 text-[16px] md:col-span-3">{project.client}</p>
          <div className="col-span-4 md:col-span-9">
            <h1 className="t-hero max-w-[22ch] hero-line">{project.title}</h1>
            <p className="mt-8 max-w-2xl text-lead muted">{project.excerpt}</p>
          </div>
        </div>
        <div className="mt-14 md:mt-20">
          <ProjectFacts facts={facts} />
        </div>
      </header>

      <Lightbox>
      {/* Kapak: kenardan kenara */}
      <div className="mt-10 md:mt-14">
        <Media media={project.cover} priority aspect="16/8" sizes="100vw" className="w-full overflow-hidden [&_img]:object-cover" />
      </div>

      {summary.length > 0 && (
        <section aria-labelledby="vaka-ozeti" className="container-site section">
          <div className="grid-site gap-y-8">
            <h2 id="vaka-ozeti" className="col-span-4 text-[16px] font-normal md:col-span-3">
              Vaka özeti
            </h2>
            <dl className="col-span-4 grid gap-x-12 gap-y-10 md:col-span-9 md:grid-cols-2">
              {summary.map((s) => (
                <div key={s.id} id={s.id} className="border-t border-line pt-5">
                  <dt className="text-[19px] font-medium tracking-tight">{s.key}</dt>
                  <dd className="muted mt-3 text-[17px] leading-relaxed whitespace-pre-line">{s.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <RenderBlocks blocks={project.layout} facts={facts} />
      </Lightbox>

      {related.length > 0 && (
        <section className="container-site section" aria-labelledby="ilgili">
          <h2 id="ilgili" className="mb-8 text-[16px] font-normal">
            Benzer işler
          </h2>
          <ul className="grid gap-6 md:grid-cols-2">
            {related.map((p) => (
              <li key={p.id}>
                <Link href={docPath('projects', p.slug)} className="group flex items-center justify-between border-t border-line py-5 text-heading-md">
                  <span>{p.client}</span>
                  <span className="muted text-body">{p.title.slice(0, 60)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {next && next.id !== project.id && (
        <nav aria-label="Sonraki proje" className="container-site pt-10 pb-24 md:pb-32">
          <Link href={docPath('projects', next.slug)} className="group grid-site items-end gap-y-6 border-t border-line pt-5" data-cursor="Sonraki proje">
            <span className="col-span-4 text-[16px] md:col-span-3">Sonraki proje</span>
            <span className="col-span-4 md:col-span-5">
              <span className="t-hero flex items-center gap-4">
                <span className="link-line">{next.client}</span>
                <span className="transition-transform duration-500 group-hover:translate-x-2">
                  <Arrow />
                </span>
              </span>
              <span className="mt-3 block max-w-md text-[16px] muted">{next.title}</span>
            </span>
            <span className="col-span-4 md:col-span-4">
              <Media media={next.cover} aspect="4/3" sizes="(min-width: 768px) 33vw, 100vw" className="media-frame hover-zoom w-full" />
            </span>
          </Link>
        </nav>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          '@id': absoluteURL(`${docPath('projects', project.slug)}#case-study`),
          name: project.title,
          headline: project.title,
          description: project.excerpt,
          url: absoluteURL(docPath('projects', project.slug)),
          image: mediaURL(project.cover, 'og'),
          dateCreated: project.year ? String(project.year) : undefined,
          datePublished: project.publishedAt || undefined,
          dateModified: project.updatedAt,
          inLanguage: 'tr-TR',
          creator: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          sourceOrganization: { '@id': ORG_ID },
          about: [
            ...services.map((s) => ({ '@type': 'Service', name: s.title, url: absoluteURL(docPath('services', s.slug)) })),
          ],
          genre: sectors.map((s) => s.title),
          mentions: { '@type': 'Organization', name: project.client, url: project.liveUrl || undefined },
          abstract: summary.map((s) => `${s.key}: ${s.text}`).join('\n') || undefined,
        }}
      />
    </article>
  )
}
