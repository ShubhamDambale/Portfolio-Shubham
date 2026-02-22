import RevealCard from './RevealCard'
import { certifications } from '../data/portfolio'

export default function CertificationsSection() {
  return (
    <RevealCard>
      <div className="p-6">
        <h2 className="section-title">Certifications & Achievements</h2>

        {certifications.map((cert, idx) => (
          <div
            key={cert.id}
            className={`flex items-start gap-3.5 py-3 ${idx < certifications.length - 1 ? 'border-b border-gray-200 dark:border-[#3a3d42]' : ''}`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#fff3e0] to-[#ffe0b2] flex items-center justify-center flex-shrink-0 text-base">
              {cert.emoji}
            </div>
            <div>
              <p className="font-bold text-sm text-[#191919] dark:text-[#f0ede8]">{cert.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cert.desc}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cert.issuer}</p>
            </div>
          </div>
        ))}
      </div>
    </RevealCard>
  )
}
