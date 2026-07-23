import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCityStore } from '@/store/useCityStore'
import { Icon, type IconName } from '@/components/ui/Icon'
import { playCue, setMuted as applyMuted, startMusic, stopMusic } from '@/lib/sound'

/** Bottom-right dock of environment toggles: theme, day/night, weather, sound, help. */
export function ControlDock() {
  const theme = useCityStore((s) => s.theme)
  const toggleTheme = useCityStore((s) => s.toggleTheme)
  const timeOfDay = useCityStore((s) => s.timeOfDay)
  const toggleTimeOfDay = useCityStore((s) => s.toggleTimeOfDay)
  const weather = useCityStore((s) => s.weather)
  const cycleWeather = useCityStore((s) => s.cycleWeather)
  const muted = useCityStore((s) => s.muted)
  const musicOn = useCityStore((s) => s.musicOn)
  const toggleMuted = useCityStore((s) => s.toggleMuted)
  const toggleMusic = useCityStore((s) => s.toggleMusic)
  const setHelpOpen = useCityStore((s) => s.setHelpOpen)

  // Keep the audio engine in sync with the store, and honour the "muted by default" rule.
  useEffect(() => {
    applyMuted(muted)
    if (muted) stopMusic()
  }, [muted])

  useEffect(() => {
    if (!muted && musicOn) startMusic()
    else stopMusic()
  }, [muted, musicOn])

  const weatherIcon: IconName = weather === 'rain' ? 'cloud-rain' : weather === 'snow' ? 'snow' : 'globe'

  return (
    <motion.div
      className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="glass pointer-events-auto flex items-center gap-0.5 rounded-2xl p-1">
        <DockButton
          icon={theme === 'dark' ? 'moon' : 'sun'}
          label={`Theme: ${theme}`}
          onClick={toggleTheme}
        />
        <DockButton
          icon={timeOfDay === 'night' ? 'moon' : 'sun'}
          label={`Time: ${timeOfDay} (press N)`}
          onClick={toggleTimeOfDay}
          active={timeOfDay === 'night'}
        />
        <DockButton icon={weatherIcon} label={`Weather: ${weather} (press W)`} onClick={cycleWeather} active={weather !== 'clear'} />

        <span className="mx-0.5 h-6 w-px bg-white/10" />

        <DockButton
          icon={muted ? 'muted' : 'volume'}
          label={muted ? 'Unmute (press M)' : 'Mute (press M)'}
          onClick={toggleMuted}
          active={!muted}
        />
        <DockButton
          icon="sparkles"
          label={musicOn ? 'Stop ambient music' : 'Play ambient music'}
          onClick={() => {
            if (muted) toggleMuted()
            toggleMusic()
          }}
          active={musicOn && !muted}
        />

        <span className="mx-0.5 h-6 w-px bg-white/10" />

        <DockButton icon="keyboard" label="Keyboard shortcuts (press ?)" onClick={() => setHelpOpen(true)} />
      </div>
    </motion.div>
  )
}

function DockButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: IconName
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => {
        playCue('click')
        onClick()
      }}
      onMouseEnter={() => playCue('hover')}
      className={`group relative grid h-9 w-9 place-items-center rounded-xl transition-colors ${
        active ? 'bg-cyan-400/15 text-cyan-300' : 'text-[var(--text-muted)] hover:bg-white/8 hover:text-white'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon name={icon} size={18} />
    </button>
  )
}
