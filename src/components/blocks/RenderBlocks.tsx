import type { Page, Project } from '@/payload-types'
import { CtaBlock, FaqBlock, GalleryBlock, MediaBlock, MediaTextBlock, ProjectFactsBlock, QuoteBlock, StatsBlock, TextBlock, TwoColumnsBlock, VideoBlock, type FactsData } from './Blocks'
import { ProjectsShowcaseBlock, ServicesListBlock } from './Dynamic'

type AnyBlock = NonNullable<Project['layout']>[number] | NonNullable<Page['layout']>[number]

/** Katmanları panelde belirlenen sırayla çizer. */
export function RenderBlocks({ blocks, facts }: { blocks?: AnyBlock[] | null; facts?: FactsData }) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = block.id ?? `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'text':
            return <TextBlock key={key} block={block} />
          case 'twoColumns':
            return <TwoColumnsBlock key={key} block={block} />
          case 'mediaText':
            return <MediaTextBlock key={key} block={block} />
          case 'media':
            return <MediaBlock key={key} block={block} />
          case 'gallery':
            return <GalleryBlock key={key} block={block} />
          case 'video':
            return <VideoBlock key={key} block={block} />
          case 'stats':
            return <StatsBlock key={key} block={block} />
          case 'quote':
            return <QuoteBlock key={key} block={block} />
          case 'projectFacts':
            return <ProjectFactsBlock key={key} block={block} facts={facts} />
          case 'cta':
            return <CtaBlock key={key} block={block} />
          case 'faq':
            return <FaqBlock key={key} block={block} />
          case 'servicesList':
            return <ServicesListBlock key={key} block={block} />
          case 'projectsShowcase':
            return <ProjectsShowcaseBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}

/** Katmanlardaki SSS bloklarından FAQPage verisi için soruları toplar. */
export function collectFaqs(blocks?: AnyBlock[] | null) {
  return (blocks ?? []).flatMap((b) => (b.blockType === 'faq' ? (b.items ?? []).map((q) => ({ question: q.question, answer: q.answer })) : []))
}
