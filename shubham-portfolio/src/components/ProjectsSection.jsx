import { useState } from 'react'
import RevealCard from './RevealCard'
import { projects } from '../data/portfolio'

function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-xl p-4 border-[1.5px] transition-all duration-250 bg-[#f3f2ef] dark:bg-[#1b1f23] cursor-default
        ${hovered
          ? 'border-li-blue shadow-[0_8px_24px_rgba(10,102,194,0.12)] -translate-y-0.5'
          : 'border-gray-200 dark:border-[#3a3d42]'
        }`}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-li-blue to-[#13a8e4]" />

      <p className="font-bold text-[0.95rem] text-[#191919] dark:text-[#f0ede8] mb-1.5">
        {project.emoji} {project.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
        {project.desc}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tags.map(t => <span key={t} className="tech-tag">{t}</span>)}
      </div>
      <div className="flex gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-li-blue hover:underline"
        >
          ⭐ GitHub
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-li-blue hover:underline"
          >
            🌐 Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </div>
    </RevealCard>
  )
}
