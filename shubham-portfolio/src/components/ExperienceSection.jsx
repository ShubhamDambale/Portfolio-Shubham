import RevealCard from './RevealCard'
import { experience } from '../data/portfolio'

export default function ExperienceSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Experience</h2>

        {experience.map((exp, idx) => (
          <div
            key={exp.id}
            className={`flex gap-4 py-4 ${idx < experience.length - 1 ? 'border-b border-gray-200 dark:border-[#3a3d42]' : ''}`}
          >
            {/* Logo */}
            <div
              className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
              style={{ background: `linear-gradient(135deg, ${exp.gradientFrom}, ${exp.gradientTo})` }}
            >
              {exp.initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-[0.95rem] text-[#191919] dark:text-[#f0ede8]">{exp.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{exp.company}</p>
              <p className="text-xs text-gray-400 mt-0.5">📅 {exp.period} · {exp.location}</p>

              <ul className="mt-2.5 pl-4 list-disc text-gray-500 dark:text-gray-400 text-sm space-y-1">
                {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {exp.tags.map(tag => (
                  <span key={tag} className="tech-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </RevealCard>
  )
}
