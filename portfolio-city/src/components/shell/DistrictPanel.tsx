import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { districtByRoute } from '@/data/districts'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import { Icon } from '@/components/ui/Icon'
import { SectionTag } from '@/components/ui/primitives'
import { playCue } from '@/lib/sound'

interface Props {
  route: string
  title: string
  /** e.g. "Work experience" — shown as the district kicker. */
  kicker: string
  accent: string
  glyph: string
  children: ReactNode
  /** Optional element rendered at the top-right of the header (e.g. a CTA). */
  action?: ReactNode
  /** Back target — defaults to city overview. */
  backTo?: string
  backLabel?: string
}

/**
 * The glass drawer that every content section renders into. It slides in from the right over the
 * live city, focuses the matching district's camera, and traps nothing — the city stays
 * interactive behind it on desktop.
 */
export function DistrictPanel({
  route,
  title,
  kicker,
  accent,
  glyph,
  children,
  action,
  backTo = '/',
  backLabel = 'Back to city',
}: Props) {
  const navigate = useNavigate()
  const focus = useCityStore((s) => s.focus)
  const { exit } = useCityNavigation()

  // Focus the district camera whenever this panel is shown.
  useEffect(() => {
    const district = districtByRoute(route)
    if (district) focus(district.id)
  }, [route, focus])

  return (
    <motion.main
      key={route}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="pointer-events-none fixed inset-0 z-[65] flex justify-end"
    >
      <div
        className="panel pointer-events-auto flex h-[100dvh] w-full flex-col overflow-hidden border-l sm:max-w-xl lg:max-w-2xl"
        style={{ boxShadow: `-30px 0 80px -40px ${accent}, -1px 0 0 0 ${accent}22` }}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden px-6 pt-6 pb-4 sm:px-8">
          <div
            className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
            style={{ background: accent }}
          />
          <div className="flex items-start justify-between gap-4">
            <div>
              <SectionTag accent={accent}>
                <span className="mr-1">{glyph}</span>
                {kicker}
              </SectionTag>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                playCue('close')
                if (backTo === '/') exit()
                else navigate(backTo)
              }}
              onMouseEnter={() => playCue('hover')}
              className="glass grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[var(--text-muted)] transition hover:text-white"
              aria-label={backLabel}
              title={backLabel}
            >
              <Icon name="close" size={20} />
            </button>
          </div>
          {action && <div className="mt-4">{action}</div>}
        </div>

        <div className="h-px shrink-0 bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>

        {/* Footer nav */}
        <div className="shrink-0 border-t border-white/10 px-6 py-3 sm:px-8">
          <button
            type="button"
            onClick={() => {
              playCue('close')
              exit()
            }}
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-white"
          >
            <Icon name="arrow-left" size={16} /> {backLabel}
          </button>
        </div>
      </div>
    </motion.main>
  )
}
