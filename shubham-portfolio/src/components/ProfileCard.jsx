import { useInView } from '../hooks/useInView'
import { profile } from '../data/portfolio'
import resumeFile from '/assets/shubham_resume.pdf'

export default function ProfileCard() {
  const [ref, visible] = useInView(0.05)

  return (
    <div
      ref={ref}
      className="card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {/* Banner */}
      <div className="relative h-32 md:h-40 overflow-hidden bg-gradient-to-r from-li-blue via-[#0c8ed4] to-[#13c4e4]">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-4 left-1/3 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-10 w-20 h-20 rounded-full bg-white/5" />
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar */}
        <div className="absolute -top-12 left-6 w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white dark:border-[#26292e] bg-gradient-to-br from-li-blue-light to-[#bbdefb] flex items-center justify-center shadow-lg overflow-hidden">
          <img
            src={profile.profilePic}
            alt="Profile"
            className="block w-full h-full object-cover"
            style={{ objectPosition: '50% 22%' }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-3">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto text-center">
            Connect
          </a>
          <a href={`mailto:${profile.email}`} className="btn-outline w-full sm:w-auto text-center">
            Contact
          </a>
          <a href={resumeFile} download className="btn-ghost w-full sm:w-auto text-center">
            ⬇ Resume
          </a>
        </div>

        {/* Info */}
        <div className="mt-12 md:mt-14">
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight text-[#191919] dark:text-[#f0ede8]">
            {profile.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
            {profile.headline}
          </p>

          {/* Location + badge */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              📍 {profile.location}
            </span>
            {profile.openToWork && (
              <span className="bg-li-green-bg dark:bg-[#0d2d1e] text-li-green border-[1.5px] border-li-green rounded-full px-2.5 py-0.5 text-xs font-bold">
                ✦ Open to Work
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            <a href={`mailto:${profile.email}`} className="text-li-blue hover:underline">
              ✉ {profile.email}
            </a>
            <a href={`tel:${profile.phone}`} className="text-li-blue hover:underline">
              📞 {profile.phone}
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="text-li-blue hover:underline">
              🐙 GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-li-blue hover:underline">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
