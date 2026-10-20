import type { Project } from '@/payload-types'
import { populated } from '@/lib/data'
import { docPath, localURL } from '@/lib/paths'
import type { GalleryItem } from './GalleryGrid'

export function projectServiceNames(p: Project) {
  return populated<{ title: string }>(p.services).map((s) => s.title)
}

/** Projeyi galeri öğesine çevirir (kapak görselinin kart boyutu ve odak noktası kullanılır). */
export function toGalleryItem(p: Project): GalleryItem {
  const cover = p.cover && typeof p.cover === 'object' ? p.cover : null
  return {
    href: docPath('projects', p.slug),
    client: p.client,
    title: p.title,
    services: projectServiceNames(p).join(', '),
    year: p.year,
    image: cover?.url
      ? { url: localURL(cover.sizes?.card?.url || cover.url), alt: cover.alt, focal: `${cover.focalX ?? 50}% ${cover.focalY ?? 50}%` }
      : undefined,
  }
}
