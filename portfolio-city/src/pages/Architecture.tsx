import { districtById } from '@/data/districts'
import { projects } from '@/data/projects'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note } from '@/components/ui/content'
import { ArchitectureDiagram } from '@/components/ui/ArchitectureDiagram'

const d = districtById('data-center')

/**
 * The Data Center visualises the architecture patterns evidenced by the résumé: a layered
 * request path (client → RBAC → REST → services → data) plus the CI/CD delivery loop, drawn as a
 * generic reference model, and then the concrete diagram from the flagship project.
 */
const REFERENCE = {
  nodes: [
    { id: 'client', label: 'React SPA', kind: 'client' as const, detail: 'Redux, Hooks, Tailwind UI' },
    { id: 'auth', label: 'Auth / RBAC', kind: 'gateway' as const, detail: 'Spring Security, roles' },
    { id: 'rest', label: 'REST API', kind: 'service' as const, detail: 'Spring Boot controllers' },
    { id: 'svc', label: 'Microservices', kind: 'service' as const, detail: 'Domain services' },
    { id: 'db', label: 'PostgreSQL', kind: 'data' as const, detail: 'Schema + JPA/JDBC' },
    { id: 'cache', label: 'MongoDB / SQL', kind: 'data' as const, detail: 'Polyglot storage' },
    { id: 'ci', label: 'GitHub Actions', kind: 'infra' as const, detail: 'CI/CD pipelines' },
    { id: 'docker', label: 'Docker', kind: 'infra' as const, detail: 'Containerised services' },
  ],
  edges: [
    { from: 'client', to: 'auth', label: 'HTTPS' },
    { from: 'auth', to: 'rest', label: 'authorised' },
    { from: 'rest', to: 'svc', label: 'invoke' },
    { from: 'svc', to: 'db', label: 'JPA' },
    { from: 'svc', to: 'cache', label: 'query' },
    { from: 'ci', to: 'docker', label: 'build' },
    { from: 'docker', to: 'svc', label: 'deploy' },
  ],
}

export function Architecture() {
  useSEO({
    title: 'Architecture — Shubham Dambale | Data Center',
    description:
      'How Shubham Dambale architects systems: layered REST + microservices over PostgreSQL, secured with RBAC and delivered via GitHub Actions and Docker.',
    path: '/architecture',
  })

  const flagship = projects[0]

  return (
    <DistrictPanel route="/architecture" title="Data Center" kicker="How I architect systems" accent={d.accent} glyph={d.glyph}>
      <Note>
        This is a reference model assembled from the patterns my résumé evidences — REST + microservices,
        RBAC, polyglot storage, and containerised CI/CD. It is a way of thinking, shown visually, not a claim
        about a specific unnamed system.
      </Note>

      <Heading accent={d.accent}>Reference architecture</Heading>
      <ArchitectureDiagram nodes={REFERENCE.nodes} edges={REFERENCE.edges} accent={d.accent} />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: 'Request path', v: 'Client → RBAC → REST' },
          { k: 'Services', v: 'Spring Boot microservices' },
          { k: 'Data', v: 'PostgreSQL · MySQL · MongoDB' },
          { k: 'Delivery', v: 'GitHub Actions · Docker' },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <p className="mono-label">{s.k}</p>
            <p className="mt-1 text-[13px] font-medium text-[var(--text)]">{s.v}</p>
          </div>
        ))}
      </div>

      {flagship && (
        <>
          <Heading accent={d.accent}>In production: {flagship.name}</Heading>
          <ArchitectureDiagram
            nodes={flagship.architecture.nodes}
            edges={flagship.architecture.edges}
            accent={flagship.accent}
          />
        </>
      )}
    </DistrictPanel>
  )
}
