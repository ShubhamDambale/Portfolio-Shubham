import { Component, type ErrorInfo, type ReactNode } from 'react'
import { profile } from '@/data/profile'

interface Props {
  children: ReactNode
  /** Optional compact fallback for the 3D canvas (keeps the rest of the site alive). */
  variant?: 'page' | 'canvas'
}

interface State {
  hasError: boolean
  message?: string
}

/**
 * Catches render-time crashes. The `canvas` variant is wrapped around the WebGL scene so a GPU
 * or shader failure degrades to a graceful message instead of a white screen — the content
 * pages keep working regardless.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.variant === 'canvas') {
      return (
        <div className="absolute inset-0 grid place-items-center bg-[var(--bg)] p-6 text-center">
          <div>
            <p className="mono-label">3D view unavailable</p>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
              Your browser couldn’t start WebGL. Every section is still reachable from the menu above.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="grid min-h-[100dvh] place-items-center bg-[var(--bg)] p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gradient">Something went sideways.</h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            An unexpected error occurred. Try reloading — and if it persists, reach me at{' '}
            <a className="text-cyan-300 underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-[#05070d]"
          >
            Reload
          </button>
          {import.meta.env.DEV && this.state.message && (
            <pre className="mt-4 overflow-auto rounded-lg bg-black/40 p-3 text-left text-xs text-rose-300">
              {this.state.message}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
