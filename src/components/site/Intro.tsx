import { HypnosMark } from './Logo'

/**
 * Açılış animasyonu (Fol tarzı): siyah perde, ortada beliren işaret, perde yukarı kayarak siteyi açar.
 * - Ziyaret başına bir kez oynar (sessionStorage); azaltılmış harekette hiç oynamaz.
 * - Karar boyamadan önce satır içi betikle verilir; perde yalnız html[data-intro] varken görünür.
 * - Saf CSS; içerik arkada yüklenmeye devam eder, perde tıklamayı engellemez.
 */
const script = `try{var h=document.documentElement;if(!sessionStorage.getItem('hypnos-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){h.setAttribute('data-intro','');sessionStorage.setItem('hypnos-intro','1');setTimeout(function(){h.removeAttribute('data-intro')},2100)}}catch(e){}`

export function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="intro" aria-hidden="true">
        <HypnosMark size={96} className="intro-mark text-ink-inverse" />
      </div>
    </>
  )
}
