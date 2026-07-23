import { isPlaceholder, type Fact } from '@/types'

/**
 * Renders a resume fact, or — when the resume does not carry it — an obvious amber, dashed
 * "add this" chip. This is the mechanism that keeps the promise: nothing is invented, and every
 * gap is visible and labelled instead of quietly filled.
 */
export function FactText({ value, className = '' }: { value: Fact; className?: string }) {
  if (isPlaceholder(value)) {
    return (
      <span className={`placeholder-chip inline-flex items-start gap-2 ${className}`}>
        <span aria-hidden className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">
          add
        </span>
        <span>{value.text}</span>
      </span>
    )
  }
  return <span className={className}>{value}</span>
}

/** Block variant for standalone placeholder paragraphs. */
export function FactBlock({ value, className = '' }: { value: Fact; className?: string }) {
  if (isPlaceholder(value)) {
    return (
      <p className={`placeholder-chip ${className}`}>
        <span aria-hidden className="mr-2 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          To add
        </span>
        {value.text}
      </p>
    )
  }
  return <p className={className}>{value}</p>
}

/** True if any of the given facts is a placeholder — used to badge sections as incomplete. */
export const hasPlaceholders = (...facts: Fact[]) => facts.some(isPlaceholder)
