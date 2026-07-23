import { AnimatePresence, motion } from 'framer-motion'
import { useCityStore } from '@/store/useCityStore'
import { Icon } from '@/components/ui/Icon'

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ['⌘', 'K'], label: 'Open search / command palette' },
  { keys: ['/'], label: 'Quick search' },
  { keys: ['1', '–', '9'], label: 'Jump to a district' },
  { keys: ['←', '→'], label: 'Cycle building focus' },
  { keys: ['Enter'], label: 'Enter the focused building' },
  { keys: ['H'], label: 'Return to city overview' },
  { keys: ['N'], label: 'Toggle day / night' },
  { keys: ['W'], label: 'Cycle weather' },
  { keys: ['T'], label: 'Toggle light / dark theme' },
  { keys: ['M'], label: 'Mute / unmute sound' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close / go back' },
]

/** Keyboard shortcut cheat-sheet, opened with “?” or from the dock. */
export function HelpOverlay() {
  const open = useCityStore((s) => s.helpOpen)
  const setOpen = useCityStore((s) => s.setHelpOpen)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="panel relative w-full max-w-lg p-6"
            initial={{ scale: 0.95, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Icon name="keyboard" size={20} className="text-cyan-300" /> Keyboard shortcuts
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-white/8 hover:text-white"
                aria-label="Close"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <ul className="grid gap-1.5 sm:grid-cols-2">
              {SHORTCUTS.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5">
                  <span className="text-sm text-[var(--text-muted)]">{s.label}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="min-w-[22px] rounded border border-white/15 bg-white/8 px-1.5 py-0.5 text-center font-mono text-[11px] text-[var(--text)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
              Tip: hover a building to preview it, click to fly in. The city drifts on its own when idle.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
