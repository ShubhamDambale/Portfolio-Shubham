import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { districtById } from '@/data/districts'
import { skillMatrix, skills, skillWeight } from '@/data/skills'
import { experiences } from '@/data/experience'
import { projects } from '@/data/projects'
import { isPlaceholder, type Skill } from '@/types'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note, TagRow } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'
import { Icon } from '@/components/ui/Icon'
import { playCue } from '@/lib/sound'

const d = districtById('skill-bank')

export function Skills() {
  const { hash } = useLocation()
  const [open, setOpen] = useState<string | null>(null)

  useSEO({
    title: 'Skills — Shubham Dambale | Skill Bank',
    description:
      'Technical skills of Shubham Dambale: Java, Spring Boot, React.js, SQL, REST APIs, microservices, .NET/C#, DevOps and more — each backed by résumé evidence.',
    path: '/skills',
  })

  // Deep link from the command palette (/skills#java) opens that vault.
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      if (skills.some((s) => s.id === id)) setOpen(id)
    }
  }, [hash])

  return (
    <DistrictPanel route="/skills" title="Skill Bank" kicker="Skills & tooling" accent={d.accent} glyph={d.glyph}>
      <Note>
        No invented percentage bars here. Every vault shows <strong className="text-[var(--text)]">evidence</strong> —
        the exact résumé lines and the roles or projects where the skill was used. Vault size reflects how much of
        that evidence exists.
      </Note>

      <Heading accent={d.accent}>The vaults</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {skills.map((skill, i) => (
          <VaultCard key={skill.id} skill={skill} index={i} open={open === skill.id} onToggle={() => setOpen(open === skill.id ? null : skill.id)} />
        ))}
      </div>

      <Heading accent={d.accent}>Everything on the résumé</Heading>
      <div className="space-y-4">
        {skillMatrix.map((group) => (
          <div key={group.category}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{group.category}</p>
            <TagRow items={group.items} accent={d.accent} />
          </div>
        ))}
      </div>
    </DistrictPanel>
  )
}

function VaultCard({ skill, index, open, onToggle }: { skill: Skill; index: number; open: boolean; onToggle: () => void }) {
  const weight = skillWeight(skill)
  const usedExp = experiences.filter((e) => skill.usedIn.experienceIds.includes(e.id))
  const usedProj = projects.filter((p) => skill.usedIn.projectIds.includes(p.id))

  return (
    <motion.div
      id={skill.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]"
      style={{ boxShadow: open ? `inset 0 0 0 1px ${skill.accent}55` : undefined }}
    >
      <button
        type="button"
        onClick={() => {
          playCue(open ? 'close' : 'open')
          onToggle()
        }}
        onMouseEnter={() => playCue('hover')}
        className="flex w-full items-center gap-3 p-4 text-left"
        aria-expanded={open}
      >
        {/* Vault door dial. */}
        <span
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2"
          style={{ borderColor: skill.accent, background: `${skill.accent}12` }}
        >
          <span className="h-4 w-4 rounded-full" style={{ background: skill.accent, boxShadow: `0 0 10px ${skill.accent}` }} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">{skill.name}</span>
            {!skill.onResume && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                empty
              </span>
            )}
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">{skill.category}</span>
          {/* Evidence weight as a row of pips — derived, not invented. */}
          <span className="mt-1.5 flex gap-1">
            {Array.from({ length: 6 }).map((_, k) => (
              <span
                key={k}
                className="h-1 w-4 rounded-full"
                style={{ background: k < weight ? skill.accent : 'rgba(255,255,255,0.08)' }}
              />
            ))}
          </span>
        </span>
        <Icon name={open ? 'close' : 'arrow-right'} size={16} className="text-[var(--text-muted)]" />
      </button>

      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <div className="space-y-3 border-t border-white/8 px-4 py-4">
          <div className="text-sm leading-relaxed text-[var(--text-muted)]">
            <FactText value={skill.summary} />
          </div>

          <div>
            <p className="mono-label mb-1.5">Since</p>
            <p className="text-sm text-[var(--text)]">
              <FactText value={skill.since} />
            </p>
          </div>

          {skill.evidence.length > 0 && (
            <div>
              <p className="mono-label mb-1.5">Résumé evidence</p>
              <ul className="space-y-1.5">
                {skill.evidence.map((e, k) => (
                  <li key={k} className="flex gap-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: skill.accent }} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(usedExp.length > 0 || usedProj.length > 0) && (
            <div>
              <p className="mono-label mb-1.5">Used in</p>
              <div className="flex flex-wrap gap-1.5">
                {usedExp.map((e) => (
                  <span key={e.id} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px]">
                    {e.company}
                  </span>
                ))}
                {usedProj.map((p) => (
                  <span key={p.id} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px]">
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isPlaceholder(skill.summary) && skill.evidence.length === 0 && (
            <p className="text-[12px] text-amber-300/80">This vault is empty because the résumé has no evidence for it yet.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
