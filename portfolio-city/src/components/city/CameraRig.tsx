import { useEffect, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { cameraHome, cameraHomeTarget, cameraStart, districts } from '@/data/districts'
import { useCityStore } from '@/store/useCityStore'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

type Controls = ComponentRef<typeof OrbitControls>

/**
 * The cinematic camera.
 *
 * Three modes, in priority order:
 *   1. Intro     — a scripted fly-in from above the skyline down to the city overview.
 *   2. Focused   — a GSAP tween to the district's parking spot when a building is opened.
 *   3. Free      — OrbitControls with damping, plus a slow idle drift when nobody touches it.
 */
export function CameraRig() {
  const controls = useRef<Controls>(null)
  const { camera } = useThree()
  const reducedMotion = usePrefersReducedMotion()

  const phase = useCityStore((s) => s.phase)
  const focused = useCityStore((s) => s.focused)
  const setPhase = useCityStore((s) => s.setPhase)

  const tween = useRef<gsap.core.Timeline | null>(null)
  const idleSince = useRef(0)
  const userDriving = useRef(false)

  // ---- intro fly-in -------------------------------------------------------
  useEffect(() => {
    if (phase !== 'intro') return
    const c = controls.current
    camera.position.set(...cameraStart)
    c?.target.set(0, 6, 40)

    if (reducedMotion) {
      camera.position.set(...cameraHome)
      c?.target.set(...cameraHomeTarget)
      c?.update()
      setPhase('ready')
      return
    }

    if (c) c.enabled = false
    const tl = gsap.timeline({
      onComplete: () => {
        if (c) c.enabled = true
        setPhase('ready')
      },
    })

    tl.to(camera.position, {
      x: cameraHome[0],
      y: cameraHome[1],
      z: cameraHome[2],
      duration: 4.2,
      ease: 'power3.inOut',
    })
    if (c) {
      tl.to(
        c.target,
        { x: cameraHomeTarget[0], y: cameraHomeTarget[1], z: cameraHomeTarget[2], duration: 4.2, ease: 'power3.inOut' },
        0,
      )
      // A gentle banked approach: swing wide, then straighten out.
      tl.to(camera.position, { x: cameraHome[0] + 26, duration: 2.1, ease: 'sine.inOut' }, 0)
      tl.to(camera.position, { x: cameraHome[0], duration: 2.1, ease: 'sine.inOut' }, 2.1)
    }

    tween.current = tl
    return () => {
      tl.kill()
    }
  }, [phase, camera, setPhase, reducedMotion])

  // ---- focus / unfocus ----------------------------------------------------
  useEffect(() => {
    if (phase !== 'ready') return
    const c = controls.current
    const district = focused ? districts.find((d) => d.id === focused) : null
    const position = district ? district.cameraPosition : cameraHome
    const target = district ? district.cameraTarget : cameraHomeTarget

    tween.current?.kill()

    if (reducedMotion) {
      camera.position.set(...position)
      c?.target.set(...target)
      c?.update()
      return
    }

    if (c) c.enabled = false
    const tl = gsap.timeline({
      onComplete: () => {
        if (c) c.enabled = true
        idleSince.current = performance.now()
      },
    })
    tl.to(camera.position, {
      x: position[0],
      y: position[1],
      z: position[2],
      duration: 1.25,
      ease: 'power3.inOut',
    })
    if (c) {
      tl.to(c.target, { x: target[0], y: target[1], z: target[2], duration: 1.25, ease: 'power3.inOut' }, 0)
    }
    tween.current = tl
    return () => {
      tl.kill()
    }
  }, [focused, phase, camera, reducedMotion])

  // ---- idle drift ---------------------------------------------------------
  useFrame((_, delta) => {
    const c = controls.current
    if (!c) return
    c.update()

    if (phase !== 'ready' || focused || reducedMotion || userDriving.current) return
    const idleFor = (performance.now() - idleSince.current) / 1000
    if (idleFor < 6) return

    // Orbit the city centre very slowly so the scene never feels frozen.
    const offset = new THREE.Vector3().subVectors(camera.position, c.target)
    const angle = delta * 0.018
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
    camera.position.copy(c.target).add(offset)
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      minDistance={22}
      maxDistance={190}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI / 2.22}
      target={new THREE.Vector3(...cameraHomeTarget)}
      onStart={() => {
        userDriving.current = true
      }}
      onEnd={() => {
        userDriving.current = false
        idleSince.current = performance.now()
      }}
    />
  )
}
