import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Chip } from './primitives'

/** Reusable content blocks shared across the section pages. */

export function Prose({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`space-y-4 text-[15px] leading-relaxed text-[var(--text-muted)] ${className}`}>{children}</div>
}

export function Heading({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <h2 className="mb-3 mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text)] first:mt-0">
      <span className="inline-block h-3 w-0.5 rounded-full" style={{ background: accent ?? 'var(--color-cyan)' }} />
      {children}
    </h2>
  )
}

export function Card({
  children,
  className = '',
  accent,
  index = 0,
}: {
  children: ReactNode
  className?: string
  accent?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      className={`rounded-2xl border border-white/8 bg-white/[0.03] p-5 ${className}`}
      style={accent ? { boxShadow: `inset 3px 0 0 0 ${accent}` } : undefined}
    >
      {children}
    </motion.div>
  )
}

export function TagRow({ items, accent }: { items: string[]; accent?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Chip key={t} accent={accent}>
          {t}
        </Chip>
      ))}
    </div>
  )
}

export function BulletList({ items, accent = 'var(--color-cyan)' }: { items: string[]; accent?: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: Math.min(i * 0.04, 0.3) }}
          className="flex gap-3 text-[15px] leading-relaxed text-[var(--text-muted)]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  )
}

export function StatTile({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
      <div className="text-2xl font-bold tracking-tight" style={{ color: accent ?? 'var(--text)' }}>
        {value}
      </div>
      <div className="mt-0.5 text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

/** A small "info" callout used to explain the honest placeholder policy on some pages. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
      {children}
    </div>
  )
}
