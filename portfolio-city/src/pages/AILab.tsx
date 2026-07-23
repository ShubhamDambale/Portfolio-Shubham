import { districtById } from '@/data/districts'
import { aiLabNote, roadmap } from '@/data/growth'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note, TagRow } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'
import type { RoadmapItem } from '@/types'

const d = districtById('ai-lab')

const STATUS_META: Record<RoadmapItem['status'], { label: string; color: string }> = {
  foundation: { label: 'Foundation · résumé-backed', color: '#34d399' },
  building: { label: 'Building now', color: '#f5a524' },
  next: { label: 'Next up', color: '#f472b6' },
}

export function AILab() {
  useSEO({
    title: 'AI Lab — Shubham Dambale | What I am building toward',
    description: 'The technologies Shubham Dambale is learning next: cloud, AI/LLMs, system design and observability.',
    path: '/ai-lab',
  })

  return (
    <DistrictPanel route="/ai-lab" title="AI Lab" kicker="What I am building toward" accent={d.accent} glyph={d.glyph}>
      <Note>{aiLabNote}</Note>

      <Heading accent={d.accent}>Roadmap</Heading>
      <div className="space-y-3">
        {roadmap.map((item, i) => {
          const meta = STATUS_META[item.status]
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
              style={{ boxShadow: `inset 3px 0 0 0 ${meta.color}` }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-[var(--text)]">{item.title}</h3>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: `${meta.color}1a`, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
              <div className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                <FactText value={item.detail} />
              </div>
              <div className="mt-3">
                <TagRow items={item.tags} accent={meta.color} />
              </div>
              {/* progress index just for rhythm */}
              <span className="sr-only">Roadmap item {i + 1}</span>
            </div>
          )
        })}
      </div>
    </DistrictPanel>
  )
}
