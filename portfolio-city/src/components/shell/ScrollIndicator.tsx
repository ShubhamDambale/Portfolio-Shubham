import { AnimatePresence, motion } from 'framer-motion'
import { useCityStore } from '@/store/useCityStore'

/** A brief "drag to explore" hint on the overview once the intro flight lands. */
export function ScrollIndicator() {
  const phase = useCityStore((s) => s.phase)
  const focused = useCityStore((s) => s.focused)
  const show = phase === 'ready' && !focused

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center sm:bottom-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.4 }}
        >
          <motion.div
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-[var(--text-muted)]"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
            Drag to explore · click a building to enter
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
