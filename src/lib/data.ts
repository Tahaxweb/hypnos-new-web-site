import type { Category, Page, Partner, Post, Project, Sector, Service } from '@/payload-types'
import type { RoutedCollection } from './paths'

/**
 * İçerik src/content altındaki JSON dosyalarından okunur (Payload'dan dışa aktarıldı).
 * İlişkiler yüklenirken nesneye çevrilir; böylece bileşenler eskisi gibi `populated(...)` ile çalışır.
 */
const files = import.meta.glob('/src/content/**/*.json', { eager: true, import: 'default' }) as Record<string, any>

type Any = Record<string, any>

/** Medya nesnesi: sizes {ad: url} -> {ad: {url}} ve kimlik */
function fixMedia(v: any): any {
  if (Array.isArray(v)) return v.map(fixMedia)
  if (v && typeof v === 'object') {
    if (v.mimeType && v.url && v.sizes) {
      const sizes: Any = {}
      for (const [k, u] of Object.entries<any>(v.sizes)) sizes[k] = { url: u }
      return { ...v, id: v.url, sizes }
    }
    const o: Any = {}
    for (const [k, x] of Object.entries<any>(v)) o[k] = fixMedia(x)
    return o
  }
  return v
}

const collect = (dir: string): Any[] =>
  Object.entries(files)
    .filter(([p]) => p.startsWith(`/src/content/${dir}/`))
    .map(([, d]) => fixMedia(d) as Any)
    .map((d) => ({ ...d, id: d.slug, _status: 'published' }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

const data = (name: string): Any => fixMedia(files[`/src/content/data/${name}.json`])

const raw = {
  projects: collect('projects'),
  services: collect('services'),
  sectors: collect('sectors'),
  partners: collect('partners'),
  pages: collect('pages'),
  posts: collect('posts'),
  categories: collect('categories'),
}

const bySlug = (list: Any[]) => new Map(list.map((d) => [d.slug as string, d]))
const maps = {
  projects: bySlug(raw.projects),
  services: bySlug(raw.services),
  sectors: bySlug(raw.sectors),
  partners: bySlug(raw.partners),
  categories: bySlug(raw.categories),
}
const pick = (map: Map<string, Any>, slugs?: string[]) => (slugs ?? []).map((s) => map.get(s)).filter(Boolean)

// İlişkileri nesneye çevir (tek seviye; iç içe döngü oluşmasın diye projelerin hizmetleri düz kalır)
for (const p of raw.projects) {
  p.sectors = pick(maps.sectors, p.sectors)
  p.services = pick(maps.services, p.services)
  p.partners = pick(maps.partners, p.partners)
}
for (const p of raw.posts) {
  p.categories = pick(maps.categories, p.categories)
  p.relatedProjects = pick(maps.projects, p.relatedProjects)
}
const showcase = (layout?: Any[]) =>
  layout?.forEach((b) => {
    if (b.blockType === 'projectsShowcase') b.projects = pick(maps.projects, b.projects)
  })
;[...raw.services, ...raw.sectors, ...raw.partners, ...raw.pages].forEach((d) => showcase(d.layout))

const home = data('home')
home.featuredProjects = pick(maps.projects, home.featuredProjects)

const asList = <T,>(l: Any[]) => l as unknown as T[]

export const getProject = (slug: string) => (maps.projects.get(slug) as unknown as Project) ?? null
export const getService = (slug: string) => (maps.services.get(slug) as unknown as Service) ?? null
export const getSector = (slug: string) => (maps.sectors.get(slug) as unknown as Sector) ?? null
export const getPartner = (slug: string) => (maps.partners.get(slug) as unknown as Partner) ?? null
export const getPage = (slug: string) => (raw.pages.find((p) => p.slug === slug) as unknown as Page) ?? null
export const getPost = (slug: string) => (raw.posts.find((p) => p.slug === slug) as unknown as Post) ?? null

export const getProjects = () => asList<Project>(raw.projects)
export const getServices = () => asList<Service>(raw.services)
export const getSectors = () => asList<Sector>(raw.sectors)
export const getPartners = () => asList<Partner>(raw.partners)
export const getPages = () => asList<Page>(raw.pages)
export const getPosts = () => asList<Post>(raw.posts)
export const getCategories = () => asList<Category>(raw.categories)

export const getSiteSettings = () => data('site') as import('@/payload-types').SiteSetting
export const getHomePage = () => home as import('@/payload-types').HomePage
export const getPageTexts = () => data('page-texts') as import('@/payload-types').PageText

export const getPublishedSlugs = (collection: RoutedCollection) => ((raw as Any)[collection] as Any[]).map((d) => d.slug as string)

type Redirect = { from: string; type?: string; to: string | { relationTo: RoutedCollection; slug: string } | null }
export const getRedirects = () => (files['/src/content/data/redirects.json'] ?? []) as Redirect[]

/** İlişki alanındaki değerin kimliğini döndürür (kimlik veya nesne olabilir). */
export const relId = (v: unknown): number | string | undefined =>
  v && typeof v === 'object' && 'id' in v ? (v as { id: number | string }).id : (v as number | string | undefined)

/** İlişkili dokümanları yalnız nesneye dönüştürülmüş (populate edilmiş) olanlarla döndürür. */
export function populated<T extends object>(list: unknown): T[] {
  if (!Array.isArray(list)) return []
  return list.filter((x): x is T => Boolean(x) && typeof x === 'object')
}
