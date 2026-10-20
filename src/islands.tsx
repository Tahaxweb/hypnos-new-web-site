import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'

import { islands } from '@/components/site/registry'

document.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => {
  const Comp = islands[el.dataset.island || '']
  if (!Comp) return
  hydrateRoot(el, createElement(Comp, JSON.parse(el.dataset.props || '{}')))
})
