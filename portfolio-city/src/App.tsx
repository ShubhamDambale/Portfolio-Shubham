import { Suspense, lazy, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useCityStore } from '@/store/useCityStore'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { ErrorBoundary } from '@/components/shell/ErrorBoundary'
import { Loader } from '@/components/shell/Loader'
import { NavBar } from '@/components/shell/NavBar'
import { MiniMap } from '@/components/shell/MiniMap'
import { ControlDock } from '@/components/shell/ControlDock'
import { CommandPalette } from '@/components/shell/CommandPalette'
import { HelpOverlay } from '@/components/shell/HelpOverlay'
import { Fireworks } from '@/components/shell/Fireworks'
import { CustomCursor } from '@/components/shell/CustomCursor'
import { ScrollIndicator } from '@/components/shell/ScrollIndicator'
import { IsometricCity } from '@/components/city/IsometricCity'

import { Home } from '@/pages/Home'
import { Experience } from '@/pages/Experience'
import { Projects } from '@/pages/Projects'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Skills } from '@/pages/Skills'
import { Education } from '@/pages/Education'
import { About } from '@/pages/About'
import { Contact } from '@/pages/Contact'
import { NotFound } from '@/pages/NotFound'

// The 3D engine is the heaviest chunk — load it lazily so the shell + hero paint first.
const CityCanvas = lazy(() =>
  import('@/components/city/CityCanvas').then((m) => ({ default: m.CityCanvas })),
)

export function App() {
  const isMobile = useIsMobile()
  useKeyboardNavigation()

  return (
    <ErrorBoundary>
      <div className="relative min-h-[100dvh]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Skip to content
        </a>

        {isMobile ? <MobileExperience /> : <DesktopExperience />}

        {/* Global overlays shared by both experiences. */}
        <CommandPalette />
        <HelpOverlay />
        <Fireworks />
        <CustomCursor />
      </div>
    </ErrorBoundary>
  )
}

/* ------------------------------------------------------------- desktop */

function DesktopExperience() {
  const phase = useCityStore((s) => s.phase)
  const location = useLocation()

  // Deep links / refreshes to a section should show content immediately — skip the loader +
  // intro fly-in, which are reserved for a first visit to the city overview. The camera then
  // flies straight to the focused district instead.
  const landedDeep = useRef(location.pathname !== '/')
  useEffect(() => {
    if (landedDeep.current && useCityStore.getState().phase === 'loading') {
      useCityStore.getState().setPhase('ready')
    }
  }, [])

  return (
    <>
      {!landedDeep.current && <Loader />}

      {/* The persistent 3D city sits behind everything. */}
      <div className="fixed inset-0 z-0" id="main-content">
        <ErrorBoundary variant="canvas">
          <Suspense fallback={<CanvasFallback />}>
            <CityCanvas />
          </Suspense>
        </ErrorBoundary>
      </div>

      <NavBar />
      {phase === 'ready' && (
        <>
          <MiniMap />
          <ControlDock />
          <ScrollIndicator />
        </>
      )}

      {/* Section panels slide over the city. */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

/* -------------------------------------------------------------- mobile */

/**
 * On phones we skip WebGL entirely and serve the lightweight isometric city plus the same
 * content pages, rendered as full-screen routes rather than floating panels.
 */
function MobileExperience() {
  const setPhase = useCityStore((s) => s.setPhase)
  const location = useLocation()

  // No loader/intro on mobile — content should be instantly reachable.
  useEffect(() => {
    setPhase('ready')
  }, [setPhase])

  return (
    <>
      <NavBar />
      <ControlDock />
      <div id="main-content">
        <Routes location={location}>
          <Route path="/" element={<IsometricCity />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  )
}

function CanvasFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[var(--bg)]">
      <div className="grid-floor absolute inset-0 opacity-30" />
    </div>
  )
}
