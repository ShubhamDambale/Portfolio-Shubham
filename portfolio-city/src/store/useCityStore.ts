import { create } from 'zustand'
import type { DistrictId } from '@/types'

export type Phase = 'loading' | 'intro' | 'ready'
export type TimeOfDay = 'day' | 'night'
export type Weather = 'clear' | 'rain' | 'snow'
export type Theme = 'dark' | 'light'
export type Quality = 'high' | 'medium' | 'low'

interface CityState {
  phase: Phase
  progress: number
  theme: Theme
  timeOfDay: TimeOfDay
  weather: Weather
  quality: Quality
  muted: boolean
  musicOn: boolean

  hovered: DistrictId | null
  /** District the camera is currently parked at (null = city overview). */
  focused: DistrictId | null
  searchOpen: boolean
  minimapOpen: boolean
  helpOpen: boolean
  /** Bumped to fire a fireworks burst (resume download). */
  celebration: number

  setPhase: (p: Phase) => void
  setProgress: (n: number) => void
  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setTimeOfDay: (t: TimeOfDay) => void
  toggleTimeOfDay: () => void
  cycleWeather: () => void
  setWeather: (w: Weather) => void
  setQuality: (q: Quality) => void
  setMuted: (m: boolean) => void
  toggleMuted: () => void
  toggleMusic: () => void
  setHovered: (id: DistrictId | null) => void
  focus: (id: DistrictId | null) => void
  setSearchOpen: (open: boolean) => void
  setMinimapOpen: (open: boolean) => void
  setHelpOpen: (open: boolean) => void
  celebrate: () => void
}

const STORAGE_KEY = 'sd-city-prefs'

interface Prefs {
  theme: Theme
  timeOfDay: TimeOfDay
  muted: boolean
  quality: Quality
}

function readPrefs(): Partial<Prefs> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Prefs>
  } catch {
    return {}
  }
}

function writePrefs(prefs: Partial<Prefs>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readPrefs(), ...prefs }))
  } catch {
    /* storage disabled — preferences simply do not persist */
  }
}

/** Coarse device probe so low-power hardware never has to render the full city. */
function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'high'
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const coarse = window.matchMedia('(pointer: coarse)').matches
  if (cores <= 4 || memory <= 4) return 'low'
  if (coarse || cores <= 6) return 'medium'
  return 'high'
}

const saved = readPrefs()

export const useCityStore = create<CityState>((set, get) => ({
  phase: 'loading',
  progress: 0,
  theme: saved.theme ?? 'dark',
  timeOfDay: saved.timeOfDay ?? 'night',
  weather: 'clear',
  quality: saved.quality ?? detectQuality(),
  muted: saved.muted ?? true, // audio is muted by default, always
  musicOn: false,

  hovered: null,
  focused: null,
  searchOpen: false,
  minimapOpen: true,
  helpOpen: false,
  celebration: 0,

  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress }),

  setTheme: (theme) => {
    writePrefs({ theme })
    document.documentElement.dataset.theme = theme
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),

  setTimeOfDay: (timeOfDay) => {
    writePrefs({ timeOfDay })
    set({ timeOfDay })
  },
  toggleTimeOfDay: () => get().setTimeOfDay(get().timeOfDay === 'night' ? 'day' : 'night'),

  setWeather: (weather) => set({ weather }),
  cycleWeather: () => {
    const order: Weather[] = ['clear', 'rain', 'snow']
    set({ weather: order[(order.indexOf(get().weather) + 1) % order.length] })
  },

  setQuality: (quality) => {
    writePrefs({ quality })
    set({ quality })
  },

  setMuted: (muted) => {
    writePrefs({ muted })
    set({ muted, musicOn: muted ? false : get().musicOn })
  },
  toggleMuted: () => get().setMuted(!get().muted),
  toggleMusic: () => set((s) => ({ musicOn: !s.musicOn, muted: s.musicOn ? s.muted : false })),

  setHovered: (hovered) => set({ hovered }),
  focus: (focused) => set({ focused }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setMinimapOpen: (minimapOpen) => set({ minimapOpen }),
  setHelpOpen: (helpOpen) => set({ helpOpen }),
  celebrate: () => set((s) => ({ celebration: s.celebration + 1 })),
}))

/** Apply the persisted theme before React paints, avoiding a flash. */
export function bootstrapTheme() {
  const { theme } = useCityStore.getState()
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
}
