import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { districts } from '@/data/districts'
import { projects } from '@/data/projects'
import { skills } from '@/data/skills'
import { profile } from '@/data/profile'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from '@/hooks/useCityNavigation'
import { Icon } from '@/components/ui/Icon'
import { playCue } from '@/lib/sound'

interface Command {
  id: string
  title: string
  hint: string
  keywords: string
  run: () => void
  glyph: string
}

/** ⌘K / “/” command palette: search every building, project, skill and quick action. */
export function CommandPalette() {
  const open = useCityStore((s) => s.searchOpen)
  const setOpen = useCityStore((s) => s.setSearchOpen)
  const { enter } = useCityNavigation()
  const navigate = useNavigate()
  const store = useCityStore
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(() => {
    const districtCmds = districts.map<Command>((d) => ({
      id: `d-${d.id}`,
      title: d.name,
      hint: d.subtitle,
      keywords: d.keywords.join(' '),
      glyph: d.glyph,
      run: () => enter(d.id, { instant: true }),
    }))

    const projectCmds = projects.map<Command>((p) => ({
      id: `p-${p.id}`,
      title: p.name,
      hint: `Project · ${p.role}`,
      keywords: `${p.name} ${p.stack.join(' ')} project`,
      glyph: '🧩',
      run: () => {
        store.getState().focus('tech-park')
        navigate(`/projects/${p.slug}`)
      },
    }))

    const skillCmds = skills.map<Command>((s) => ({
      id: `s-${s.id}`,
      title: s.name,
      hint: `Skill · ${s.category}`,
      keywords: `${s.name} ${s.category} skill vault`,
      glyph: '🏦',
      run: () => {
        store.getState().focus('skill-bank')
        navigate(`/skills#${s.id}`)
      },
    }))

    const actions: Command[] = [
      {
        id: 'a-resume',
        title: 'Download résumé (PDF)',
        hint: 'Action',
        keywords: 'resume cv download pdf',
        glyph: '📄',
        run: () => {
          const a = document.createElement('a')
          a.href = profile.resumeUrl
          a.download = 'shubham-dambale-resume.pdf'
          a.click()
          store.getState().celebrate()
        },
      },
      {
        id: 'a-theme',
        title: 'Toggle light / dark theme',
        hint: 'Action',
        keywords: 'theme dark light mode',
        glyph: '🌓',
        run: () => store.getState().toggleTheme(),
      },
      {
        id: 'a-night',
        title: 'Toggle day / night',
        hint: 'Action',
        keywords: 'day night time',
        glyph: '🌙',
        run: () => store.getState().toggleTimeOfDay(),
      },
      {
        id: 'a-weather',
        title: 'Change weather',
        hint: 'Action',
        keywords: 'weather rain snow clear',
        glyph: '🌦️',
        run: () => store.getState().cycleWeather(),
      },
      {
        id: 'a-help',
        title: 'Keyboard shortcuts',
        hint: 'Action',
        keywords: 'help shortcuts keyboard keys',
        glyph: '⌨️',
        run: () => store.getState().setHelpOpen(true),
      },
    ]

    return [...districtCmds, ...projectCmds, ...skillCmds, ...actions]
  }, [enter, store, navigate])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands
      .map((c) => {
        const hay = `${c.title} ${c.hint} ${c.keywords}`.toLowerCase()
        const score = hay.includes(q) ? (c.title.toLowerCase().startsWith(q) ? 3 : hay.startsWith(q) ? 2 : 1) : 0
        return { c, score }
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.c)
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      // Focus after the enter animation so the ring isn't visually clipped.
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setCursor(0), [query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(results.length - 1, c + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = results[cursor]
      if (cmd) {
        playCue('click')
        setOpen(false)
        cmd.run()
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the city"
            className="panel relative w-full max-w-xl overflow-hidden"
            initial={{ scale: 0.96, y: -12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Icon name="search" size={18} className="text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search buildings, projects, skills, actions…"
                className="w-full bg-transparent text-[15px] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none"
                aria-label="Search query"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]">esc</kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">No matches for “{query}”.</p>
              )}
              {results.map((cmd, i) => (
                <button
                  key={cmd.id}
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => {
                    playCue('click')
                    setOpen(false)
                    cmd.run()
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    i === cursor ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/6 text-base">{cmd.glyph}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[var(--text)]">{cmd.title}</span>
                    <span className="block truncate text-[11px] text-[var(--text-muted)]">{cmd.hint}</span>
                  </span>
                  {i === cursor && <Icon name="arrow-right" size={16} className="text-cyan-300" />}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
