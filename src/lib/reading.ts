/** Lexical içeriğindeki metinden yaklaşık okuma süresi (dakika, 200 kelime/dk). */
export function readingMinutes(content: unknown): number {
  let words = 0
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return
    const node = n as { text?: string; children?: unknown[]; root?: unknown }
    if (typeof node.text === 'string') words += node.text.trim().split(/\s+/).filter(Boolean).length
    node.children?.forEach(walk)
    if (node.root) walk(node.root)
  }
  walk(content)
  return Math.max(1, Math.round(words / 200))
}

export const formatDate = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso)) : ''
