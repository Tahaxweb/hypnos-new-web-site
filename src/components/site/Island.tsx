import { createElement } from 'react'
import { renderToString } from 'react-dom/server'

import { islands } from './registry'

/**
 * Etkileşimli bileşenleri sayfa içinde bir "ada" olarak yerleştirir: HTML derlemede üretilir (SEO), tarayıcıda src/islands.tsx canlandırır.
 * Props JSON olarak aktarılır, bu yüzden yalnız düz veri içermelidir.
 */
export function Island({ name, props = {} }: { name: keyof typeof islands & string; props?: Record<string, unknown> }) {
  const html = renderToString(createElement(islands[name], props))
  return <div data-island={name} data-props={JSON.stringify(props)} style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
}
