import { motion } from 'framer-motion'
import { districtById } from '@/data/districts'
import { achievements } from '@/data/growth'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'
import type { Achievement } from '@/types'

const d = districtById('museum')

const KIND_GLYPH: Record<Achievement['kind'], string> = {
  impact: '📈',
  award: '🏆',
  badge: '🎖️',
  certificate: '📜',
}

export function Achievements() {
  useSEO({
    title: 'Achievements — Shubham Dambale | Achievement Museum',
    description:
      'Impact and recognition: 40% manual-effort reduction, leading an enterprise ESS platform, and shipping automated CI/CD pipelines.',
    path: '/achievements',
  })

  const resumeBacked = achievements.filter((a) => a.source === 'resume')
  const toAdd = achievements.filter((a) => a.source === 'placeholder')

  return (
    <DistrictPanel route="/achievements" title="Achievement Museum" kicker="Impact & recognition" accent={d.accent} glyph={d.glyph}>
      <Note>
        The exhibits below are drawn from measurable impact stated on the résumé. The empty display cases at the
        bottom are ready for awards or badges once you add them.
      </Note>

      <Heading accent={d.accent}>On display</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {resumeBacked.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.05] to-transparent p-5"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
              style={{ background: d.accent }}
            />
            <div className="mb-3 text-2xl">{KIND_GLYPH[a.kind]}</div>
            <h3 className="text-base font-semibold leading-snug text-[var(--text)]">
              <FactText value={a.title} />
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              <FactText value={a.context} />
            </p>
            <p className="mt-3 font-mono text-xs" style={{ color: d.accent }}>
              <FactText value={a.year} />
            </p>
          </motion.div>
        ))}
      </div>

      <Heading accent="#5b6d8c">Empty display cases</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {toAdd.map((a) => (
          <div key={a.id} className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/[0.04] p-5">
            <div className="mb-2 text-2xl opacity-60">{KIND_GLYPH[a.kind]}</div>
            <div className="text-sm">
              <FactText value={a.title} />
            </div>
          </div>
        ))}
      </div>
    </DistrictPanel>
  )
}
