import { motion } from 'framer-motion'
import { districts } from '@/data/districts'
import { useSEO } from '@/hooks/useSEO'
import { LinkButton } from '@/components/ui/primitives'
import { Link } from 'react-router-dom'
import { playCue } from '@/lib/sound'

/** A themed 404: "you wandered off the map". */
export function NotFound() {
  useSEO({
    title: '404 — Off the map | Shubham Dambale',
    description: 'This street doesn’t exist in the city. Head back to a district.',
    path: '/404',
  })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <motion.div
        className="panel pointer-events-auto max-w-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-6xl font-black text-gradient sm:text-7xl">404</p>
        <h1 className="mt-2 text-xl font-semibold">You wandered off the city map.</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          There’s no street here — but every district is one click away.
        </p>

        <div className="mt-6 flex justify-center">
          <LinkButton to="/" icon="arrow-left">
            Back to the city
          </LinkButton>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {districts.map((d) => (
            <Link
              key={d.id}
              to={d.route}
              onClick={() => playCue('click')}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:text-white"
            >
              {d.glyph} {d.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
