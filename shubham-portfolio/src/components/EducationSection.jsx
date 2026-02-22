import RevealCard from './RevealCard'
import { education } from '../data/portfolio'

export default function EducationSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Education</h2>

        {education.map((edu, idx) => (
          <div
            key={edu.id}
            className={`flex gap-4 py-3.5 ${idx < education.length - 1 ? 'border-b border-gray-200 dark:border-[#3a3d42]' : ''}`}
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-li-blue-light to-[#bbdefb] flex items-center justify-center flex-shrink-0 text-xl">
              {edu.emoji}
            </div>
            <div>
              <p className="font-bold text-sm text-[#191919] dark:text-[#f0ede8]">{edu.degree}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{edu.institution}</p>
              <p className="text-xs text-gray-400 mt-0.5">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    </RevealCard>
  )
}
