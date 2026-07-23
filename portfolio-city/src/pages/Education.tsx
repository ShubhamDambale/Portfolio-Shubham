import { districtById } from '@/data/districts'
import { certifications, education, learningJourney } from '@/data/growth'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Card, Heading, Note } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'

const d = districtById('university')

export function Education() {
  useSEO({
    title: 'Education & Certifications — Shubham Dambale | University',
    description: 'Education, certifications and the learning journey of Shubham Dambale.',
    path: '/education',
  })

  return (
    <DistrictPanel route="/education" title="University" kicker="Education & certifications" accent={d.accent} glyph={d.glyph}>
      <Note>
        The résumé PDF has no dedicated education section, so the entries below are marked as
        placeholders for you to complete. (Masai School appears on the résumé as an <em>employer</em>, not as
        schooling, so it lives in the Company HQ instead.)
      </Note>

      <Heading accent={d.accent}>Education</Heading>
      <div className="space-y-3">
        {education.map((e, i) => (
          <Card key={e.id} index={i} accent={d.accent}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--text)]">
                  <FactText value={e.credential} />
                </h3>
                <span className="text-xs text-[var(--text-muted)]">
                  <FactText value={e.period} />
                </span>
              </div>
              <p className="text-sm" style={{ color: d.accent }}>
                <FactText value={e.institution} />
              </p>
              <div className="text-sm text-[var(--text-muted)]">
                <FactText value={e.detail} />
              </div>
              {e.note && <p className="text-[12px] italic text-amber-300/70">{e.note}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Heading accent={d.accent}>Certifications</Heading>
      <div className="space-y-3">
        {certifications.map((c, i) => (
          <Card key={c.id} index={i} accent={d.accent}>
            <h3 className="text-sm font-semibold text-[var(--text)]">
              <FactText value={c.name} />
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              <FactText value={c.issuer} /> · <FactText value={c.year} />
            </p>
          </Card>
        ))}
      </div>

      <Heading accent={d.accent}>Learning journey</Heading>
      <p className="mb-3 text-[13px] text-[var(--text-muted)]">This timeline is fully backed by the résumé.</p>
      <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-amber-400/60 before:to-transparent">
        {learningJourney.map((j, i) => (
          <div key={i} className="relative pl-8">
            <span
              className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2"
              style={{ borderColor: d.accent, background: i === learningJourney.length - 1 ? d.accent : 'var(--bg)' }}
            />
            <Card index={i} accent={d.accent}>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-[var(--text)]">{j.title}</h3>
                <span className="font-mono text-xs" style={{ color: d.accent }}>
                  {j.year}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{j.detail}</p>
            </Card>
          </div>
        ))}
      </div>
    </DistrictPanel>
  )
}
