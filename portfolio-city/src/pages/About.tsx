import { districtById } from '@/data/districts'
import { careerObjective, interests, profile, softSkills } from '@/data/profile'
import { experiences } from '@/data/experience'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Prose, TagRow } from '@/components/ui/content'
import { FactBlock } from '@/components/ui/FactText'

const d = districtById('central-park')

export function About() {
  useSEO({
    title: 'About — Shubham Dambale | Central Park',
    description: profile.summary,
    path: '/about',
  })

  return (
    <DistrictPanel route="/about" title="About Me" kicker="Central Park" accent={d.accent} glyph={d.glyph}>
      {/* Avatar + identity. */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-black text-[#05070d]"
          style={{ background: `linear-gradient(135deg, ${d.accent}, #38e8ff)` }}
        >
          {profile.initials}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm" style={{ color: d.accent }}>
            {profile.title}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">📍 {profile.location}</p>
        </div>
      </div>

      <Heading accent={d.accent}>Biography</Heading>
      <Prose>
        <p>{profile.summary}</p>
        <p>
          I’m currently an {experiences[0].role} at {experiences[0].company}, where I lead development on an
          enterprise HRMS / Employee Self-Service platform — owning it from PostgreSQL schema through React
          dashboards to containerised delivery.
        </p>
      </Prose>

      <Heading accent={d.accent}>Career objective</Heading>
      <FactBlock value={careerObjective} />

      <Heading accent={d.accent}>How I work</Heading>
      <TagRow items={softSkills} accent={d.accent} />

      <Heading accent={d.accent}>Interests & hobbies</Heading>
      <div className="space-y-2">
        {interests.map((interest, i) => (
          <FactBlock key={i} value={interest} />
        ))}
      </div>
    </DistrictPanel>
  )
}
