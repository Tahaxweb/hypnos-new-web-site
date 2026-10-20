import { Fragment, type ReactNode } from 'react'

import { docPath, type RoutedCollection } from '@/lib/paths'
import { Media } from './Media'

type LNode = {
  type: string
  tag?: string
  text?: string
  format?: number | string
  listType?: 'bullet' | 'number' | 'check'
  value?: any
  fields?: any
  children?: LNode[]
}

const hrefOf = (n: LNode) => {
  const f = n.fields
  if (!f) return '#'
  if (f.linkType === 'internal' && f.doc?.slug) return docPath(f.doc.relationTo as RoutedCollection, f.doc.slug)
  return f.url || '#'
}

function renderText(n: LNode, key: number): ReactNode {
  let out: ReactNode = n.text
  const f = typeof n.format === 'number' ? n.format : 0
  if (f & 16) out = <code>{out}</code>
  if (f & 8) out = <u>{out}</u>
  if (f & 4) out = <s>{out}</s>
  if (f & 2) out = <em>{out}</em>
  if (f & 1) out = <strong>{out}</strong>
  return <Fragment key={key}>{out}</Fragment>
}

function renderChildren(nodes?: LNode[]): ReactNode {
  return nodes?.map((n, i) => renderNode(n, i))
}

function renderNode(n: LNode, key: number): ReactNode {
  switch (n.type) {
    case 'text':
      return renderText(n, key)
    case 'linebreak':
      return <br key={key} />
    case 'paragraph':
      return n.children?.length ? <p key={key}>{renderChildren(n.children)}</p> : <p key={key}><br /></p>
    case 'heading': {
      const H = (n.tag || 'h2') as 'h2'
      return <H key={key}>{renderChildren(n.children)}</H>
    }
    case 'quote':
      return <blockquote key={key}>{renderChildren(n.children)}</blockquote>
    case 'list': {
      const L = n.listType === 'number' ? 'ol' : 'ul'
      return <L key={key}>{renderChildren(n.children)}</L>
    }
    case 'listitem':
      return <li key={key}>{renderChildren(n.children)}</li>
    case 'horizontalrule':
      return <hr key={key} />
    case 'link':
    case 'autolink': {
      const ext = n.fields?.newTab
      return (
        <a key={key} href={hrefOf(n)} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {renderChildren(n.children)}
        </a>
      )
    }
    case 'upload': {
      const caption = n.fields?.caption
      if (!n.value || typeof n.value !== 'object') return null
      return (
        <figure key={key} className="not-prose my-10">
          <Media media={n.value} className="media-frame w-full" sizes="(min-width: 768px) 720px, 100vw" />
          {caption && <figcaption className="mt-3 text-[15px] text-ink-muted">{caption}</figcaption>}
        </figure>
      )
    }
    default:
      return n.children ? <Fragment key={key}>{renderChildren(n.children)}</Fragment> : null
  }
}

export function RichText({ data, className = '' }: { data?: unknown; className?: string }) {
  const root = (data as { root?: LNode } | null)?.root
  if (!root) return null
  return <div className={`prose-hypnos ${className}`}>{renderChildren(root.children)}</div>
}
