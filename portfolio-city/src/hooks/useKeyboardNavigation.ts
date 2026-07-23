import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { districts } from '@/data/districts'
import { useCityStore } from '@/store/useCityStore'
import { useCityNavigation } from './useCityNavigation'

const isTypingTarget = (el: EventTarget | null) => {
  const node = el as HTMLElement | null
  if (!node) return false
  return (
    node.tagName === 'INPUT' ||
    node.tagName === 'TEXTAREA' ||
    node.tagName === 'SELECT' ||
    node.isContentEditable
  )
}

/**
 * Global keyboard layer. Every 3D interaction has a keyboard equivalent so the city is
 * navigable without a mouse (and by screen-reader users, via the skip-link + nav landmarks).
 */
export function useKeyboardNavigation() {
  const { pathname } = useLocation()
  const { enter, exit, hover } = useCityNavigation()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const store = useCityStore.getState()

      // Command palette is allowed to open from anywhere, including inputs.
      if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        store.setSearchOpen(!store.searchOpen)
        return
      }

      if (isTypingTarget(event.target)) return

      switch (event.key) {
        case 'Escape':
          if (store.searchOpen) store.setSearchOpen(false)
          else if (store.helpOpen) store.setHelpOpen(false)
          else if (pathname !== '/') exit()
          break

        case '/':
          event.preventDefault()
          store.setSearchOpen(true)
          break

        case '?':
          event.preventDefault()
          store.setHelpOpen(!store.helpOpen)
          break

        case 'ArrowRight':
        case ']': {
          event.preventDefault()
          const current = store.hovered ?? store.focused
          const i = districts.findIndex((d) => d.id === current)
          hover(districts[(i + 1 + districts.length) % districts.length].id)
          break
        }

        case 'ArrowLeft':
        case '[': {
          event.preventDefault()
          const current = store.hovered ?? store.focused
          const i = districts.findIndex((d) => d.id === current)
          const next = i <= 0 ? districts.length - 1 : i - 1
          hover(districts[next].id)
          break
        }

        case 'Enter': {
          const target = store.hovered
          if (target) {
            event.preventDefault()
            enter(target)
          }
          break
        }

        case 'm':
        case 'M':
          store.toggleMuted()
          break

        case 'n':
        case 'N':
          store.toggleTimeOfDay()
          break

        case 'w':
        case 'W':
          store.cycleWeather()
          break

        case 't':
        case 'T':
          store.toggleTheme()
          break

        case 'h':
        case 'H':
          exit()
          break

        default: {
          // 1–9 jump straight to a district.
          const digit = Number.parseInt(event.key, 10)
          if (!Number.isNaN(digit) && digit >= 1 && digit <= districts.length) {
            enter(districts[digit - 1].id)
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enter, exit, hover, pathname])
}
