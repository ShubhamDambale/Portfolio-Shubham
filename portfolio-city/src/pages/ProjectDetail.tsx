import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getProject } from '@/data/projects'
import { isPlaceholder } from '@/types'
import { useSEO } from '@/hooks/useSEO'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { BulletList, Card, Heading, Prose, TagRow } from '@/components/ui/content'
import { FactBlock, FactText } from '@/components/ui/FactText'
import { ArchitectureDiagram } from '@/components/ui/ArchitectureDiagram'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { ExternalLink } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icon'
import { factText } from '@/types'

export function ProjectDetail() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined
  const [lightbox, setLightbox] = useState<number | null>(null)

  useSEO({
    title: project ? `${project.name} — Shubham Dambale` : 'Project — Shubham Dambale',
    description: project?.overview ?? 'Project case study.',
    path: `/projects/${slug ?? ''}`,
    jsonLd: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: project.name,
          description: project.overview,
          programmingLanguage: project.stack.join(', '),
          author: { '@type': 'Person', name: 'Shubham Dambale' },
        }
      : undefined,
  })

  if (!project) return <Navigate to="/projects" replace />

  return (
    <DistrictPanel
      route="/projects"
      title={project.name}
      kicker={`Project · ${project.role}`}
      accent={project.accent}
      glyph="🧩"
      backTo="/projects"
      backLabel="Back to Tech Park"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="mono-label">{project.period}</span>
      </div>

      <Prose>
        <p className="text-[var(--text)]">{project.blurb}</p>
      </Prose>

      <Heading accent={project.accent}>Overview</Heading>
      <Prose>
        <p>{project.overview}</p>
      </Prose>

      <Heading accent={project.accent}>Business problem</Heading>
      <FactBlock value={project.businessProblem} />

      <Heading accent={project.accent}>Solution</Heading>
      <Prose>
        <p>{project.solution}</p>
      </Prose>

      <Heading accent={project.accent}>Architecture</Heading>
      <div className="mb-3">
        <FactBlock value={project.architecture.summary} />
      </div>
      <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} accent={project.accent} />

      <Heading accent={project.accent}>Tech stack</Heading>
      <TagRow items={project.stack} accent={project.accent} />

      <Heading accent={project.accent}>Features</Heading>
      <BulletList items={project.features} accent={project.accent} />

      <Heading accent={project.accent}>Screenshots</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {project.screenshots.map((shot, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative overflow-hidden rounded-xl border border-white/8 text-left"
          >
            <img
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className="aspect-video w-full object-cover transition group-hover:scale-[1.03]"
            />
            {shot.placeholder && (
              <span className="absolute left-2 top-2 rounded bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-black">
                Placeholder
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-white/90">
              <FactText value={shot.caption} />
            </span>
          </button>
        ))}
      </div>

      <Heading accent={project.accent}>Code snippets</Heading>
      <div className="space-y-4">
        {project.snippets.map((snippet, i) => (
          <CodeBlock key={i} snippet={snippet} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card accent={project.accent}>
          <Heading accent={project.accent}>Challenges</Heading>
          <div className="space-y-2">
            {project.challenges.map((c, i) => (
              <FactBlock key={i} value={c} />
            ))}
          </div>
        </Card>
        <Card accent={project.accent}>
          <Heading accent={project.accent}>Results</Heading>
          <div className="space-y-2">
            {project.results.map((r, i) => (
              <FactBlock key={i} value={r} />
            ))}
          </div>
        </Card>
        <Card accent={project.accent}>
          <Heading accent={project.accent}>Learnings</Heading>
          <div className="space-y-2">
            {project.learnings.map((l, i) => (
              <FactBlock key={i} value={l} />
            ))}
          </div>
        </Card>
      </div>

      <Heading accent={project.accent}>Links</Heading>
      <div className="flex flex-wrap gap-3">
        {isPlaceholder(project.links.github) ? (
          <FactText value={project.links.github} />
        ) : (
          <ExternalLink href={factText(project.links.github)} icon="github">
            Source code
          </ExternalLink>
        )}
        {isPlaceholder(project.links.demo) ? (
          <FactText value={project.links.demo} />
        ) : (
          <ExternalLink href={factText(project.links.demo)} icon="external">
            Live demo
          </ExternalLink>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[115] flex items-center justify-center bg-black/85 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl text-white/80 hover:bg-white/10"
              aria-label="Close"
            >
              <Icon name="close" size={22} />
            </button>
            <motion.img
              key={lightbox}
              src={project.screenshots[lightbox].src}
              alt={project.screenshots[lightbox].alt}
              className="max-h-[80vh] max-w-full rounded-xl border border-white/10"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DistrictPanel>
  )
}
