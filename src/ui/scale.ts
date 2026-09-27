/** Pure helpers for the always-on scale ruler. */

const HAIR_WIDTH_M = 100e-6

const UNITS = [
  { unit: 'mm', size: 1e-3 },
  { unit: 'µm', size: 1e-6 },
  { unit: 'nm', size: 1e-9 },
] as const

export function formatLength(meters: number): string {
  const u = UNITS.find((x) => meters >= x.size) ?? UNITS[UNITS.length - 1]
  const v = meters / u.size
  const rounded = v >= 10 ? Math.round(v) : Math.round(v * 10) / 10
  return `${rounded} ${u.unit}`
}

/** Largest 1–2–5 × 10ⁿ length that fits within `maxMeters`. */
export function niceLength(maxMeters: number): number {
  const exp = Math.floor(Math.log10(maxMeters))
  const base = Math.pow(10, exp)
  for (const m of [5, 2, 1]) if (m * base <= maxMeters * (1 + 1e-9)) return m * base
  return base
}

/** "a 5,000th the width of a hair" style comparison for a length. */
export function hairComparison(meters: number): string {
  const ratio = HAIR_WIDTH_M / meters
  if (ratio < 1.5) return `about ${Math.round(meters / HAIR_WIDTH_M)} hair widths`
  if (ratio < 10) return `about 1/${Math.round(ratio)} the width of a hair`
  const sig = Number(ratio.toPrecision(ratio < 100 ? 1 : 2))
  return `a ${sig.toLocaleString('en-US')}th the width of a hair`
}

/** Interpolates in log space, so a zoom from nm to µm ticks over evenly. */
export function logLerp(a: number, b: number, t: number): number {
  return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t)
}
