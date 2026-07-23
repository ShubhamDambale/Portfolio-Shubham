import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { districts } from '@/data/districts'
import { profile } from '@/data/profile'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import { Icon } from '@/components/ui/Icon'
import { playCue } from '@/lib/sound'

/** Top navigation: brand home, the nine districts, and the command-palette trigger. */
export function NavBar() {
  const { pathname } = useLocation()
  const { exit } = useCityNavigation()
  const setSearchOpen = useCityStore((s) => s.setSearchOpen)
  const [open, setOpen] = useState(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Primary"
        className="glass pointer-events-auto flex w-full max-w-5xl items-center gap-2 rounded-2xl px-3 py-2 sm:gap-3 sm:px-4"
      >
        <Link
          to="/"
          onClick={() => {
            exit()
            playCue('click')
          }}
          className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1.5 py-1"
          aria-label="Shubham Dambale — city overview"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-[#05070d]">
            SD
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            Shubham<span className="text-[var(--text-muted)]"> Dambale</span>
          </span>
        </Link>

        {/* Desktop district links. */}
        <div className="mx-auto hidden items-center gap-0.5 lg:flex">
          {districts.map((d) => {
            const active = pathname === d.route || pathname.startsWith(d.route + '/')
            return (
              <Link
                key={d.id}
                to={d.route}
                onMouseEnter={() => playCue('hover')}
                className={`relative rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active ? 'text-white' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-white/8"
                    style={{ boxShadow: `inset 0 0 0 1px ${d.accent}55` }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{d.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            onMouseEnter={() => playCue('hover')}
            className="glass hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-muted)] transition hover:text-white sm:flex"
            aria-label="Search the city (Command or Control K)"
          >
            <Icon name="search" size={14} />
            <span>Search</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>

          <a
            href={profile.resumeUrl}
            className="hidden rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-1.5 text-xs font-semibold text-[#05070d] sm:inline-flex"
            download
          >
            Resume
          </a>

          {/* Mobile menu toggle. */}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-[var(--text-muted)] hover:text-white lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass pointer-events-auto fixed inset-x-3 top-[70px] z-[80] rounded-2xl p-3 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {districts.map((d) => (
                <Link
                  key={d.id}
                  to={d.route}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-white/8"
                >
                  <span className="text-base">{d.glyph}</span>
                  <span>
                    <span className="block font-medium">{d.name}</span>
                    <span className="block text-[11px] text-[var(--text-muted)]">{d.subtitle}</span>
                  </span>
                </Link>
              ))}
            </div>
            <a
              href={profile.resumeUrl}
              download
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-3 py-2.5 text-sm font-semibold text-[#05070d]"
            >
              <Icon name="download" size={16} /> Download Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
