import { districts } from '@/data/districts'
import { makeRng, rangeFrom } from '@/lib/random'

/**
 * Deterministic city plan.
 *
 * Roads form a 4×4 grid; each landmark district owns one block; everything else (filler towers,
 * trees, street lights, traffic lights) is generated once from a fixed seed so the skyline is
 * byte-for-byte identical on every load — which is what lets the camera paths be hand-tuned.
 */

export interface Road {
  id: string
  axis: 'x' | 'z'
  /** Fixed coordinate of the road centre line. */
  at: number
  from: number
  to: number
  width: number
}

export const ROAD_Y = 0.02
export const SIDEWALK_Y = 0.16

export const AVENUES_X = [-56, -16, 16, 56]
export const STREETS_Z = [-58, -20, 26, 62]

export const roads: Road[] = [
  ...AVENUES_X.map<Road>((at, i) => ({
    id: `avenue-${i}`,
    axis: 'z',
    at,
    from: -70,
    to: 100,
    width: i === 1 || i === 2 ? 9 : 7,
  })),
  ...STREETS_Z.map<Road>((at, i) => ({
    id: `street-${i}`,
    axis: 'x',
    at,
    from: -70,
    to: 70,
    width: i === 1 || i === 2 ? 9 : 7,
  })),
  // Airport approach road, running south from the ring.
  { id: 'airport-spur', axis: 'z', at: 2, from: 62, to: 92, width: 8 },
]

export interface Lot {
  position: [number, number, number]
  size: [number, number, number]
  rotation: number
  tint: number
  seed: number
}

const DISTRICT_MARGIN = 7

function insideDistrict(x: number, z: number) {
  return districts.some((d) => {
    const [w, h] = d.footprint
    return (
      Math.abs(x - d.position[0]) < w / 2 + DISTRICT_MARGIN &&
      Math.abs(z - d.position[2]) < h / 2 + DISTRICT_MARGIN
    )
  })
}

function onRoad(x: number, z: number, clearance = 5) {
  return roads.some((r) => {
    const half = r.width / 2 + clearance
    if (r.axis === 'z') return Math.abs(x - r.at) < half && z >= r.from - half && z <= r.to + half
    return Math.abs(z - r.at) < half && x >= r.from - half && x <= r.to + half
  })
}

/** Background skyline: instanced towers filling every block the landmarks do not use. */
export function buildFillerLots(): Lot[] {
  const rng = makeRng(20240701)
  const lots: Lot[] = []

  for (let x = -66; x <= 66; x += 9) {
    for (let z = -66; z <= 96; z += 9) {
      const jx = x + rangeFrom(rng, -1.6, 1.6)
      const jz = z + rangeFrom(rng, -1.6, 1.6)
      if (onRoad(jx, jz) || insideDistrict(jx, jz)) continue

      // Density falls off toward the edges so the skyline silhouettes nicely.
      const edge = Math.max(Math.abs(jx) / 70, Math.abs(jz - 15) / 85)
      if (rng() < edge * 0.55) continue

      const centreBoost = 1 - Math.min(1, Math.hypot(jx, jz - 10) / 90)
      const height = rangeFrom(rng, 5, 13) + centreBoost * rangeFrom(rng, 6, 30)
      const w = rangeFrom(rng, 4, 6.6)
      const d = rangeFrom(rng, 4, 6.6)

      lots.push({
        position: [jx, height / 2, jz],
        size: [w, height, d],
        rotation: rng() < 0.22 ? rangeFrom(rng, -0.25, 0.25) : 0,
        tint: rng(),
        seed: Math.floor(rng() * 1000),
      })
    }
  }
  return lots
}

export interface PropPoint {
  position: [number, number, number]
  rotation: number
  scale: number
}

/** Street lights march down both sides of every road. */
export function buildStreetLights(): PropPoint[] {
  const rng = makeRng(553311)
  const points: PropPoint[] = []
  const spacing = 22

  for (const road of roads) {
    const offset = road.width / 2 + 1.6
    for (let t = road.from + 10; t <= road.to - 10; t += spacing) {
      for (const side of [-1, 1]) {
        const position: [number, number, number] =
          road.axis === 'z' ? [road.at + offset * side, 0, t] : [t, 0, road.at + offset * side]
        if (insideDistrict(position[0], position[2])) continue
        points.push({
          position,
          rotation: road.axis === 'z' ? (side > 0 ? Math.PI : 0) : side > 0 ? -Math.PI / 2 : Math.PI / 2,
          scale: 1,
        })
      }
    }
  }
  // Deterministic shuffle-free jitter keeps them tidy but not robotic.
  return points.map((p) => ({ ...p, scale: 0.94 + rng() * 0.12 }))
}

export function buildTrees(): PropPoint[] {
  const rng = makeRng(88117)
  const points: PropPoint[] = []

  // Avenue trees between the street lights.
  for (const road of roads) {
    const offset = road.width / 2 + 3.4
    for (let t = road.from + 21; t <= road.to - 12; t += 11) {
      for (const side of [-1, 1]) {
        const x = road.axis === 'z' ? road.at + offset * side : t
        const z = road.axis === 'z' ? t : road.at + offset * side
        if (insideDistrict(x, z) || rng() < 0.3) continue
        points.push({ position: [x, 0, z], rotation: rng() * Math.PI, scale: rangeFrom(rng, 0.8, 1.35) })
      }
    }
  }

  // Central Park canopy.
  const park = districts.find((d) => d.id === 'central-park')!
  for (let i = 0; i < 70; i++) {
    const angle = rng() * Math.PI * 2
    const radius = 4 + rng() * 12
    const x = park.position[0] + Math.cos(angle) * radius * 1.15
    const z = park.position[2] + Math.sin(angle) * radius
    points.push({ position: [x, 0, z], rotation: rng() * Math.PI, scale: rangeFrom(rng, 0.9, 1.7) })
  }

  return points
}

/** Traffic lights at the four inner intersections. */
export function buildTrafficLights(): PropPoint[] {
  const inner = [
    [-16, -20],
    [16, -20],
    [-16, 26],
    [16, 26],
  ] as const
  return inner.flatMap(([x, z], i) => [
    { position: [x + 6, 0, z + 6] as [number, number, number], rotation: Math.PI * 0.25 + i, scale: 1 },
    { position: [x - 6, 0, z - 6] as [number, number, number], rotation: Math.PI * 1.25 + i, scale: 1 },
  ])
}

export interface CarPath {
  /** Straight-line lane, travelled at constant speed then wrapped. */
  from: [number, number]
  to: [number, number]
  speed: number
  offset: number
  colorIndex: number
}

/** Traffic lanes: one per direction on every road, cars evenly distributed. */
export function buildCarPaths(): CarPath[] {
  const rng = makeRng(4242)
  const paths: CarPath[] = []

  roads.forEach((road, ri) => {
    const lane = road.width / 4
    for (const dir of [1, -1]) {
      const carsOnLane = road.axis === 'z' ? 4 : 3
      for (let c = 0; c < carsOnLane; c++) {
        const a = dir > 0 ? road.from : road.to
        const b = dir > 0 ? road.to : road.from
        const from: [number, number] = road.axis === 'z' ? [road.at + lane * dir, a] : [a, road.at - lane * dir]
        const to: [number, number] = road.axis === 'z' ? [road.at + lane * dir, b] : [b, road.at - lane * dir]
        paths.push({
          from,
          to,
          speed: rangeFrom(rng, 7, 13),
          offset: (c / carsOnLane + rng() * 0.08) % 1,
          colorIndex: Math.floor(rng() * 6) + ri * 0,
        })
      }
    }
  })

  return paths
}

/** Pedestrian loops around Central Park and the plazas. */
export function buildWalkers() {
  const rng = makeRng(9091)
  const park = districts.find((d) => d.id === 'central-park')!
  return Array.from({ length: 16 }, (_, i) => ({
    radius: 15 + (i % 4) * 2.4,
    centre: [park.position[0], park.position[2]] as [number, number],
    speed: rangeFrom(rng, 0.09, 0.2) * (i % 2 === 0 ? 1 : -1),
    phase: rng() * Math.PI * 2,
    tint: Math.floor(rng() * 5),
  }))
}

export const cityPlan = {
  fillerLots: buildFillerLots(),
  streetLights: buildStreetLights(),
  trees: buildTrees(),
  trafficLights: buildTrafficLights(),
  carPaths: buildCarPaths(),
  walkers: buildWalkers(),
}
