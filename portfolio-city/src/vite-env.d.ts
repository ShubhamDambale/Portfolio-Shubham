/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string
  readonly VITE_ANALYTICS?: 'plausible' | 'umami' | 'ga4'
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_ANALYTICS_DOMAIN?: string
  readonly VITE_ANALYTICS_SRC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
