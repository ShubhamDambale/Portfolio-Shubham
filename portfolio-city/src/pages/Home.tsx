import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '@/data/profile'
import { experienceHeadline } from '@/data/experience'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useSEO } from '@/hooks/useSEO'
import { Button, LinkButton } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icon'

/**
 * The hero overlay shown on the city overview (route "/"). It sits over the live 3D city and
 * fades back once the visitor starts exploring a district.
 */
export function Home() {
  const phase = useCityStore((s) => s.phase)
  const focused = useCityStore((s) => s.focused)
  const celebrate = useCityStore((s) => s.celebrate)
  const { enter } = useCityNavigation()
  const { text } = useTypewriter(profile.roles)

  useSEO({
    title: 'Shubham Dambale — Full Stack Developer | Java, Spring Boot, React',
    description: profile.summary,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Shubham Dambale — Portfolio City',
      url: 'https://shubhamdambale.github.io/',
    },
  })

  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = profile.resumeUrl
    a.download = 'shubham-dambale-resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    celebrate()
  }

  const show = phase === 'ready' && !focused

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          key="hero"
          className="pointer-events-none fixed inset-0 z-[55] flex items-end sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          aria-label="Introduction"
        >
          <div className="w-full px-4 pb-28 sm:px-10 sm:pb-0 lg:px-16">
            <motion.div
              className="pointer-events-auto max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[var(--text-muted)]">Open to software engineering roles</span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                <span className="text-gradient">{profile.name}</span>
              </h1>

              <div className="mt-3 flex h-8 items-center text-lg font-semibold text-[var(--text)] sm:text-2xl">
                <span aria-live="polite">{text}</span>
                <span className="ml-1 inline-block h-6 w-[3px] animate-blink bg-cyan-300 sm:h-7" aria-hidden />
              </div>

              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--text-muted)] sm:text-base">
                {profile.tagline} Based in {profile.location}, currently an Associate Engineer building enterprise
                platforms. This portfolio is a living city — every building is a chapter of the story.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button icon="sparkles" iconRight="arrow-right" onClick={() => enter('tech-park')}>
                  Explore the city
                </Button>
                <Button variant="secondary" icon="download" onClick={downloadResume}>
                  Download résumé
                </Button>
                <LinkButton to="/contact" variant="accent">
                  Hire me
                </LinkButton>
              </div>

              {/* At-a-glance stats, all resume-derived. */}
              <div className="mt-8 flex flex-wrap gap-5">
                {[
                  { value: experienceHeadline, label: 'Experience' },
                  { value: String(new Set(skills.filter((s) => s.onResume).map((s) => s.id)).size), label: 'Core skills' },
                  { value: `${projects.length}`, label: 'Flagship project' },
                  { value: '2', label: 'Companies' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-bold tracking-tight text-[var(--text)]">{s.value}</div>
                    <div className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Hint to open the menu / search on desktop. */}
          <motion.div
            className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <Icon name="command" size={18} />
              <span className="font-mono text-[10px] [writing-mode:vertical-rl]">press ⌘K to search</span>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
