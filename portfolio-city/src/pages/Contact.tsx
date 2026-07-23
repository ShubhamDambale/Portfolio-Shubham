import { districtById } from '@/data/districts'
import { profile } from '@/data/profile'
import { isPlaceholder, factText } from '@/types'
import { useCityStore } from '@/store/useCityStore'
import { useSEO } from '@/hooks/useSEO'
import { trackEvent } from '@/lib/analytics'
import { DistrictPanel } from '@/components/shell/DistrictPanel'
import { Heading, Note } from '@/components/ui/content'
import { FactText } from '@/components/ui/FactText'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Button } from '@/components/ui/primitives'
import { playCue } from '@/lib/sound'

const d = districtById('airport')

const ICON_MAP: Record<string, IconName> = {
  mail: 'mail',
  phone: 'phone',
  whatsapp: 'whatsapp',
  linkedin: 'linkedin',
  github: 'github',
  globe: 'globe',
  file: 'file',
  pin: 'pin',
}

export function Contact() {
  const celebrate = useCityStore((s) => s.celebrate)

  useSEO({
    title: 'Contact — Shubham Dambale | Airport',
    description: `Get in touch with Shubham Dambale — email ${profile.email}, phone, LinkedIn, GitHub and WhatsApp. Download the résumé.`,
    path: '/contact',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      mainEntity: { '@type': 'Person', name: profile.name, email: profile.email },
    },
  })

  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = profile.resumeUrl
    a.download = 'shubham-dambale-resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    trackEvent('resume_download', { from: 'contact' })
    celebrate()
  }

  const primary = profile.links.filter((l) => l.primary)
  const secondary = profile.links.filter((l) => !l.primary)

  return (
    <DistrictPanel
      route="/contact"
      title="Airport"
      kicker="Contact & résumé"
      accent={d.accent}
      glyph={d.glyph}
      action={
        <Button icon="download" onClick={downloadResume}>
          Download résumé (PDF)
        </Button>
      }
    >
      <div className="mb-6 rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-transparent p-6 text-center">
        <p className="text-lg font-semibold text-[var(--text)]">Ready for departure ✈️</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">
          I’m open to software engineering roles. The fastest way to reach me is email or WhatsApp — downloading the
          résumé sets off a little celebration.
        </p>
      </div>

      <Heading accent={d.accent}>Direct lines</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {primary.map((link) => {
          const disabled = isPlaceholder(link.href)
          const href = disabled ? undefined : factText(link.href)
          return (
            <a
              key={link.id}
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (disabled) {
                  e.preventDefault()
                  return
                }
                playCue('click')
                trackEvent('contact_click', { channel: link.id })
              }}
              onMouseEnter={() => !disabled && playCue('hover')}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                disabled
                  ? 'cursor-default border-dashed border-amber-500/40 bg-amber-500/[0.04]'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                style={{ background: `${d.accent}18`, color: d.accent }}
              >
                <Icon name={ICON_MAP[link.icon] ?? 'globe'} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[var(--text)]">{link.label}</span>
                <span className="block truncate text-xs text-[var(--text-muted)]">
                  <FactText value={link.handle} />
                </span>
              </span>
              {!disabled && <Icon name="arrow-right" size={16} className="text-[var(--text-muted)]" />}
            </a>
          )
        })}
      </div>

      <Heading accent={d.accent}>Elsewhere</Heading>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {secondary.map((link) => {
          const disabled = isPlaceholder(link.href)
          const href = disabled ? undefined : factText(link.href)
          return (
            <a
              key={link.id}
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={(e) => disabled && e.preventDefault()}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                disabled
                  ? 'cursor-default border-dashed border-amber-500/40 bg-amber-500/[0.04]'
                  : 'border-white/8 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/6 text-[var(--text-muted)]">
                <Icon name={ICON_MAP[link.icon] ?? 'globe'} size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-[var(--text)]">{link.label}</span>
                <span className="block truncate text-xs text-[var(--text-muted)]">
                  <FactText value={link.handle} />
                </span>
              </span>
            </a>
          )
        })}
      </div>

      <div className="mt-6">
        <Note>
          Some links above are placeholders because the résumé PDF links the word (e.g. “LinkedIn”) without exposing
          the URL. Add your real profile URLs in <code className="text-[var(--text)]">src/data/profile.ts</code>.
        </Note>
      </div>
    </DistrictPanel>
  )
}
