'use client'

import Link from '@/shims/Link'
import { useEffect, useRef, useState } from 'react'

import { useSearchParam } from '@/lib/hooks'

import { Arrow } from '@/components/site/Arrow'
import type { ContactState } from '@/lib/contact'

const BUDGETS = ['Belirsiz / konuşalım', '50.000 TL altı', '50.000 – 150.000 TL', '150.000 – 500.000 TL', '500.000 TL üzeri']

const inputCls =
  'mt-2 block w-full rounded-none border-0 border-b border-line bg-transparent px-0 py-3 text-lead font-normal text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-ink'

function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="t-label muted">
        {label} {optional ? <span className="normal-case tracking-normal">(opsiyonel)</span> : <span aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-hata`} className="mt-2 text-caption font-normal text-ink">
          <span aria-hidden="true">— </span>
          {error}
        </p>
      )}
    </div>
  )
}

type Svc = { slug: string; title: string }

export function ContactForm({ services }: { services: Svc[] }) {
  const [state, setState] = useState<ContactState>({ status: 'idle' })
  const [pending, setPending] = useState(false)
  const submit = async (fd: FormData) => {
    setPending(true)
    try {
      const res = await fetch('/api/iletisim', { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
      setState((await res.json()) as ContactState)
    } catch {
      setState({ status: 'error', message: 'Mesajınız şu anda iletilemedi. Lütfen e-posta ile yazın.', values: Object.fromEntries(fd.entries()) as Record<string, string> })
    } finally {
      setPending(false)
    }
  }
  // Hizmet sayfalarından gelindiğinde (?hizmet=…) ilgili hizmet önceden seçilir
  const presetSlug = useSearchParam('hizmet')
  const preset = services.find((s) => s.slug === presetSlug)
  const [picked, setPicked] = useState<string | null>(null)
  const service = picked ?? state.values?.service ?? preset?.title ?? ''
  // Bot koruması için formun açıldığı an (yalnız JS açıkken gönderilir)
  const startedAt = useRef(0)
  const statusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])
  useEffect(() => {
    if (state.status !== 'idle') statusRef.current?.focus()
  }, [state])

  if (state.status === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="card outline-none">
        <p className="t-heading-xl">{state.message}</p>
        <Link href="/portfolyo" className="link-arrow mt-8 text-lead">
          Bu arada projelerimize göz atın <Arrow />
        </Link>
      </div>
    )
  }

  const e = state.fieldErrors ?? {}
  const v = state.values ?? {}
  const err = (k: keyof typeof e) => (e[k] ? { 'aria-invalid': true, 'aria-describedby': `${k}-hata` } : {})

  return (
    <form
      method="post"
      action="/api/iletisim"
      // JS açıkken React'in otomatik form sıfırlamasını engelle: hatalı gönderimde girilen değerler korunur
      onSubmit={(ev) => {
        ev.preventDefault()
        const fd = new FormData(ev.currentTarget)
        fd.set('startedAt', String(startedAt.current))
        void submit(fd)
      }}
      noValidate
      className="grid gap-8"
    >
      {state.status === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border-l-2 border-ink pl-4 font-normal outline-none">
          {state.message}
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <Field id="name" label="Ad soyad" error={e.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={v.name} className={inputCls} {...err('name')} />
        </Field>
        <Field id="company" label="Şirket / marka" optional>
          <input id="company" name="company" autoComplete="organization" defaultValue={v.company} className={inputCls} />
        </Field>
        <Field id="email" label="E-posta" error={e.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputCls} {...err('email')} />
        </Field>
        <Field id="phone" label="Telefon" optional error={e.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} className={inputCls} {...err('phone')} />
        </Field>
        <Field id="service" label="İlgilendiğiniz hizmet" optional>
          <select id="service" name="service" value={service} onChange={(e) => setPicked(e.target.value)} className={`${inputCls} appearance-none`}>
            <option value="">Seçin</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Diğer">Diğer / emin değilim</option>
          </select>
        </Field>
        <Field id="budget" label="Bütçe aralığı" optional>
          <select id="budget" name="budget" defaultValue={v.budget ?? ''} className={`${inputCls} appearance-none`}>
            <option value="">Seçin</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="message" label="Projenizden bahsedin" error={e.message}>
        <textarea id="message" name="message" rows={5} required defaultValue={v.message} className={`${inputCls} resize-y`} placeholder="Marka, hedef, zaman planı…" {...err('message')} />
      </Field>

      {/* Bal küpü: ekran okuyuculardan ve gözden gizli */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Web siteniz</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="sourcePage" value={preset ? `/hizmetler/${preset.slug}` : '/iletisim'} />

      <div>
        <label className="flex items-start gap-3 font-normal">
          <input type="checkbox" name="consent" required className="mt-1 size-5 accent-black" {...err('consent')} />
          <span>
            Kişisel verilerimin talebime yanıt verilmesi amacıyla işlenmesine ilişkin{' '}
            <Link href="/kvkk" className="underline underline-offset-4" target="_blank">
              KVKK aydınlatma metnini
            </Link>{' '}
            okudum.
          </span>
        </label>
        {e.consent && (
          <p id="consent-hata" className="mt-2 text-caption font-normal">
            — {e.consent}
          </p>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-lg disabled:opacity-60" disabled={pending}>
          {pending ? 'Gönderiliyor…' : 'Gönder'} <Arrow />
        </button>
      </div>
    </form>
  )
}
