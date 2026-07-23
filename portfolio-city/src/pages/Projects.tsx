import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { districtById } from '@/data/districts'
import { projects, vacantOffices } from '@/data/projects'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note, TagRow } from '@/components/ui/content'
import { Icon } from '@/components/ui/Icon'
import { playCue } from '@/lib/sound'

const d = districtById('tech-park')

export function Projects() {
  useSEO({
    title: 'Projects — Shubham Dambale | Tech Park',
    description:
      'Projects by Shubham Dambale, including the enterprise Employee Self-Service (ESS) Portal built with Spring Boot, PostgreSQL, React.js and Docker.',
    path: '/projects',
  })

  return (
    <DistrictPanel route="/projects" title="Tech Park" kicker="Projects" accent={d.accent} glyph={d.glyph}>
      <Note>
        The Tech Park has one occupied office per project on my résumé. Right now that’s the flagship ESS Portal —
        the empty plots below are honest signposts for what’s coming next, not filler.
      </Note>

      <Heading accent={d.accent}>Flagship project</Heading>
      <div className="space-y-4">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={`/projects/${p.slug}`}
              onClick={() => playCue('open')}
              onMouseEnter={() => playCue('hover')}
              className="group block overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition hover:border-white/20"
              style={{ boxShadow: `inset 3px 0 0 0 ${p.accent}` }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">{p.name}</h3>
                    <p className="text-xs font-medium" style={{ color: p.accent }}>
                      {p.role} · {p.period}
                    </p>
                  </div>
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-white"
                    style={{ background: `${p.accent}1a` }}
                  >
                    <Icon name="arrow-right" size={18} />
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{p.blurb}</p>
                <div className="mt-4">
                  <TagRow items={p.stack.slice(0, 6)} accent={p.accent} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <Heading accent="#5b6d8c">Available plots</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {vacantOffices.map((v) => (
          <div
            key={v.id}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/[0.04] px-4 py-8 text-center"
          >
            <Icon name="sparkles" size={20} className="text-amber-400/70" />
            <p className="mt-2 text-xs text-amber-300/80">Add your next project here</p>
          </div>
        ))}
      </div>
    </DistrictPanel>
  )
}
