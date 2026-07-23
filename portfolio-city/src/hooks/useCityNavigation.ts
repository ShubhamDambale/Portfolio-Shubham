import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { districts } from '@/data/districts'
import { useCityStore } from '@/store/useCityStore'
import { playCue } from '@/lib/sound'
import { trackEvent } from '@/lib/analytics'
import type { DistrictId } from '@/types'

/** How long the camera flight is allowed to read before the panel slides in. */
const CAMERA_LEAD_MS = 460

/**
 * Single entry point for "go to a district", shared by the 3D city, the isometric mobile map,
 * the minimap, the nav bar, the command palette and the keyboard handler — so every surface
 * produces exactly the same camera move, sound and analytics event.
 */
export function useCityNavigation() {
  const navigate = useNavigate()
  const focus = useCityStore((s) => s.focus)
  const setHovered = useCityStore((s) => s.setHovered)

  const enter = useCallback(
    (id: DistrictId, opts: { instant?: boolean } = {}) => {
      const district = districts.find((d) => d.id === id)
      if (!district) return
      focus(id)
      playCue('open')
      trackEvent('district_open', { district: id })
      if (opts.instant) navigate(district.route)
      else window.setTimeout(() => navigate(district.route), CAMERA_LEAD_MS)
    },
    [focus, navigate],
  )

  const exit = useCallback(() => {
    focus(null)
    setHovered(null)
    playCue('close')
    navigate('/')
  }, [focus, navigate, setHovered])

  const hover = useCallback(
    (id: DistrictId | null) => {
      const previous = useCityStore.getState().hovered
      if (previous !== id) {
        setHovered(id)
        if (id) playCue('hover')
      }
    },
    [setHovered],
  )

  return { enter, exit, hover }
}
