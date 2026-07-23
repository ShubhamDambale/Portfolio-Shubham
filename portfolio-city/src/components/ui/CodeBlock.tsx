import { useState } from 'react'
import type { CodeSnippet } from '@/types'
import { FactText } from './FactText'
import { Icon } from './Icon'
import { playCue } from '@/lib/sound'

/**
 * A copy-able code block with a tiny, dependency-free token highlighter (keywords / strings /
 * comments / numbers). Deliberately simple — enough to read well, nothing to ship a 100 KB
 * highlighter for.
 */
export function CodeBlock({ snippet }: { snippet: CodeSnippet }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
      setCopied(true)
      playCue('success')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/8 bg-[#070c16]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 font-medium text-[var(--text)]">{snippet.title}</span>
          <span className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">
            {snippet.language}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[var(--text-muted)] transition hover:bg-white/8 hover:text-white"
          aria-label="Copy code"
        >
          <Icon name={copied ? 'check' : 'copy'} size={14} />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>

      <pre className="no-scrollbar overflow-x-auto p-4 text-[12.5px] leading-relaxed">
        <code className="font-mono" dangerouslySetInnerHTML={{ __html: highlight(snippet.code, snippet.language) }} />
      </pre>

      <div className="border-t border-white/8 px-4 py-2.5 text-xs">
        <FactText value={snippet.note} />
      </div>
    </figure>
  )
}

const KEYWORDS =
  /\b(import|from|export|const|let|var|function|return|if|else|for|while|class|new|await|async|public|private|void|final|static|null|true|false|this|extends|implements|interface|type|as|in|of|useEffect|useState)\b/g

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Minimal, safe highlighter. Input is HTML-escaped first (so this can never inject markup),
 * then tokens are wrapped with coloured spans. Comments and strings are matched first so their
 * contents are not re-tokenised as keywords.
 */
function highlight(code: string, _lang: string): string {
  return escapeHtml(code)
    .replace(/(\/\/[^\n]*|#[^\n]*)/g, '<span style="color:#5b6d8c">$1</span>')
    .replace(/(["'`])(?:\\.|(?!\1)[^\\])*\1/g, (m) => `<span style="color:#7ee787">${m}</span>`)
    .replace(/(^|[^\w#])@\w+/g, (m) => `<span style="color:#f5a524">${m}</span>`)
    .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#f78166">$1</span>')
    .replace(KEYWORDS, '<span style="color:#79c0ff">$1</span>')
}
