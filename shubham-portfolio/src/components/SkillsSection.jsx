import RevealCard from './RevealCard'
import { skills } from '../data/portfolio'

export default function SkillsSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Skills</h2>

        <div className="space-y-5">
          {skills.map(group => (
            <div key={group.category}>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map(item => (
                  <span key={item} className="skill-badge">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </RevealCard>
  )
}
