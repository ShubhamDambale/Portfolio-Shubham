import RevealCard from './RevealCard'
import { about } from '../data/portfolio'

export default function AboutSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">About</h2>
        {about.split('\n\n').map((para, i) => (
          <p
            key={i}
            className="text-gray-500 dark:text-gray-400 text-sm leading-7"
            style={{ marginBottom: i < about.split('\n\n').length - 1 ? 12 : 0 }}
          >
            {para}
          </p>
        ))}
      </div>
    </RevealCard>
  )
}
