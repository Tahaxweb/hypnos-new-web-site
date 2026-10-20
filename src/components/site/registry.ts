import type { ComponentType } from 'react'

import { BlogList } from './BlogList'
import { ContactForm } from './ContactForm'
import { Lightbox } from './Lightbox'
import { OfficeMap } from './OfficeMap'
import { PortfolioFilter } from './PortfolioFilter'

/** Sunucuda HTML'e çizilen ve tarayıcıda aynı adla canlandırılan (hydrate) bileşenler. */
export const islands: Record<string, ComponentType<any>> = { BlogList, ContactForm, Lightbox, OfficeMap, PortfolioFilter }
