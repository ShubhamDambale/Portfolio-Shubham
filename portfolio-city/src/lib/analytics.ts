/**
 * Analytics shim.
 *
 * No third-party script is bundled — that keeps the Lighthouse score high and the site
 * cookie-free by default. Point `VITE_ANALYTICS` at a provider to switch it on:
 *
 *   VITE_ANALYTICS=plausible  VITE_ANALYTICS_DOMAIN=yourdomain.com
 *   VITE_ANALYTICS=umami      VITE_ANALYTICS_SRC=https://…/script.js  VITE_ANALYTICS_ID=<id>
 *   VITE_ANALYTICS=ga4        VITE_ANALYTICS_ID=G-XXXXXXX
 *
 * The provider script is injected lazily on first idle so it never competes with the 3D bundle.
 */

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props: Props }) => void
    umami?: { track: (event: string, data?: Props) => void }
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const provider = import.meta.env.VITE_ANALYTICS as string | undefined
let injected = false

function injectScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v))
  document.head.appendChild(s)
}

export function initAnalytics() {
  if (injected || !provider || import.meta.env.DEV) return
  injected = true

  const run = () => {
    const id = import.meta.env.VITE_ANALYTICS_ID as string | undefined
    if (provider === 'plausible') {
      injectScript('https://plausible.io/js/script.js', {
        'data-domain': (import.meta.env.VITE_ANALYTICS_DOMAIN as string) ?? location.hostname,
      })
    } else if (provider === 'umami' && id) {
      injectScript((import.meta.env.VITE_ANALYTICS_SRC as string) ?? '', { 'data-website-id': id })
    } else if (provider === 'ga4' && id) {
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${id}`)
      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', id, { send_page_view: false })
    }
  }

  const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
    .requestIdleCallback
  if (ric) ric(run, { timeout: 4000 })
  else setTimeout(run, 2500)
}

export function trackPageView(path: string, title: string) {
  if (import.meta.env.DEV) return
  window.plausible?.('pageview', { props: { path, title } })
  window.umami?.track('pageview', { path, title })
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title })
}

export function trackEvent(name: string, props: Props = {}) {
  if (import.meta.env.DEV) {
    // Useful while developing; stripped from production behaviour.
    console.debug('[analytics]', name, props)
    return
  }
  window.plausible?.(name, { props })
  window.umami?.track(name, props)
  window.gtag?.('event', name, props)
}
