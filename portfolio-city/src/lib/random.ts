/**
 * Deterministic PRNG (mulberry32).
 *
 * The city is generated procedurally, so it MUST look identical on every load and on every
 * machine — `Math.random()` would reshuffle the skyline on each refresh and break the layout
 * guarantees the camera paths rely on.
 */
export function makeRng(seed: number) {
  let a = seed >>> 0
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const rangeFrom = (rng: () => number, min: number, max: number) => min + rng() * (max - min)

export const pick = <T,>(rng: () => number, items: readonly T[]): T =>
  items[Math.floor(rng() * items.length) % items.length]
