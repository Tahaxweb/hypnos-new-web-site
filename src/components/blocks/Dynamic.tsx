import Link from '@/shims/Link'

import type { Project, ProjectsShowcaseBlock as ShowcaseT, ServicesListBlock as ServicesListT } from '@/payload-types'
import { Arrow } from '@/components/site/Arrow'
import { GalleryGrid } from '@/components/site/GalleryGrid'
import { toGalleryItem } from '@/components/site/ProjectCard'
import { ServiceRows } from '@/components/site/ServiceRows'
import { getPartners, getProjects, getSectors, getServices, populated } from '@/lib/data'
import { docPath } from '@/lib/paths'
import { BlockHeading, Section } from './Section'

export function ServicesListBlock({ block }: { block: ServicesListT }) {
  const source = block.source ?? 'services'
  const items = source === 'sectors' ? getSectors() : source === 'partners' ? getPartners() : getServices()
  return (
    <Section appearance={{ ...block.appearance, width: 'wide' }}>
      <BlockHeading>{block.heading}</BlockHeading>
      <ServiceCards items={items.map((i) => ({ title: i.title, summary: i.summary, href: docPath(source, i.slug) }))} />
    </Section>
  )
}

export function ServiceCards({ items }: { items: { title: string; summary?: string | null; href: string }[]; columns?: 2 | 3 }) {
  return <ServiceRows items={items} />
}

export function ProjectsShowcaseBlock({ block }: { block: ShowcaseT }) {
  let projects = populated<Project>(block.projects).filter((p) => p._status === 'published' || !p._status)
  if (!projects.length) {
    const all = getProjects()
    projects = (all.filter((p) => p.featured).length ? all.filter((p) => p.featured) : all).slice(0, 4)
  }
  if (!projects.length) return null
  return (
    <Section appearance={{ ...block.appearance, width: 'full' }}>
      <div className="flex items-end justify-between gap-6">
        <BlockHeading>{block.heading || 'Seçili işler'}</BlockHeading>
        <Link href="/portfolyo" className="link-arrow mb-8 shrink-0">
          Tüm projeler <Arrow />
        </Link>
      </div>
      <ProjectGrid projects={projects} />
    </Section>
  )
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return <GalleryGrid items={projects.map(toGalleryItem)} priorityCount={0} />
}
