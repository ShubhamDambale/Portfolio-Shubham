import { districtById } from '@/data/districts'
import { experiences, experienceHeadline } from '@/data/experience'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { BulletList, Card, Heading, StatTile, TagRow } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'
import { Chip } from '@/components/ui/primitives'

const d = districtById('hq')

export function Experience() {
  useSEO({
    title: 'Experience — Shubham Dambale | Company HQ',
    description:
      'Work experience of Shubham Dambale: Associate Engineer at Alphavima Technologies and Software Engineer at Masai School — Java, Spring Boot, React, REST APIs, CI/CD.',
    path: '/experience',
  })

  return (
    <DistrictPanel route="/experience" title="Company HQ" kicker="Work experience" accent={d.accent} glyph={d.glyph}>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatTile value={experienceHeadline} label="Total experience" accent={d.accent} />
        <StatTile value={String(experiences.length)} label="Companies" accent={d.accent} />
        <StatTile value="Full-time" label="Engagement" accent={d.accent} />
      </div>

      <div className="relative space-y-5 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-cyan-400/60 before:to-transparent">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="relative pl-8">
            <span
              className="absolute left-0 top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border-2"
              style={{ borderColor: d.accent, background: exp.current ? d.accent : 'var(--bg)' }}
            />
            <Card index={i} accent={d.accent}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text)]">{exp.role}</h2>
                  <p className="text-sm font-medium" style={{ color: d.accent }}>
                    {exp.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-[var(--text)]">{exp.period}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {exp.locationType} · {exp.location}
                  </p>
                </div>
              </div>

              {exp.current && (
                <Chip accent="#34d399" className="mt-2">
                  Current role
                </Chip>
              )}

              <Heading accent={d.accent}>Responsibilities</Heading>
              <BulletList items={exp.responsibilities} accent={d.accent} />

              <Heading accent={d.accent}>Achievements</Heading>
              <ul className="space-y-2.5">
                {exp.achievements.map((a, j) => (
                  <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: d.accent }} />
                    <FactText value={a} />
                  </li>
                ))}
              </ul>

              <Heading accent={d.accent}>Technologies</Heading>
              <TagRow items={exp.technologies} accent={d.accent} />
            </Card>
          </div>
        ))}
      </div>
    </DistrictPanel>
  )
}
