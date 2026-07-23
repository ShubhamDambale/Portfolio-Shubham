import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

interface SEO {
  title: string
  description: string
  /** Path only, e.g. "/projects". Combined with the deployed origin for the canonical URL. */
  path: string
  image?: string
  /** Extra JSON-LD injected for this route (removed on unmount). */
  jsonLd?: Record<string, unknown>
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Per-route document head management — no extra dependency, ~1 KB. */
export function useSEO({ title, description, path, image, jsonLd }: SEO) {
  useEffect(() => {
    const url = `${window.location.origin}${path}`
    document.title = title

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    if (image) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', image)
      setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image)
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url

    let script: HTMLScriptElement | null = null
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.route = path
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }

    trackPageView(path, title)

    return () => {
      script?.remove()
    }
  }, [title, description, path, image, jsonLd])
}
