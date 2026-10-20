'use client'

import { useSyncExternalStore } from 'react'

const noop = () => () => {}

/** Sunucuda false, tarayıcıda true (portal vb. için). */
export const useIsClient = () => useSyncExternalStore(noop, () => true, () => false)

/** CSS medya sorgusunu dinler; sunucuda `fallback` döner. */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  )
}

/** Adres çubuğundaki sorgu parametresi (sunucuda null). history.replaceState sonrası `notifySearchChange()` çağrılmalı. */
const listeners = new Set<() => void>()
export const notifySearchChange = () => listeners.forEach((l) => l())
export function useSearchParam(name: string) {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      window.addEventListener('popstate', cb)
      return () => {
        listeners.delete(cb)
        window.removeEventListener('popstate', cb)
      }
    },
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  )
}
