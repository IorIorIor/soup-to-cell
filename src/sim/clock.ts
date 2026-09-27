/** Simulation ticks 10 times per simulated second; visuals interpolate between ticks. */
export const TICK_SECONDS = 0.1
export const SPEEDS = [0.25, 0.5, 1, 2, 4, 8] as const
export type Speed = (typeof SPEEDS)[number]

/** Guards against a long stall (tab in background) replaying thousands of ticks. */
const MAX_TICKS_PER_ADVANCE = 20

export interface ClockState {
  playing: boolean
  speed: Speed
  /** Unspent simulated time, always in [0, TICK_SECONDS). */
  accumulator: number
  simTime: number
}

export const initialClock: ClockState = { playing: true, speed: 1, accumulator: 0, simTime: 0 }

/**
 * Converts elapsed real time into a whole number of ticks to run.
 * Pure: returns the next clock state and how many ticks to apply.
 */
export function advanceClock(clock: ClockState, realDt: number): { clock: ClockState; ticks: number } {
  if (!clock.playing || realDt <= 0) return { clock, ticks: 0 }
  let acc = clock.accumulator + realDt * clock.speed
  let ticks = Math.floor(acc / TICK_SECONDS + 1e-9)
  acc -= ticks * TICK_SECONDS
  if (ticks > MAX_TICKS_PER_ADVANCE) {
    ticks = MAX_TICKS_PER_ADVANCE
    acc = 0
  }
  return {
    clock: { ...clock, accumulator: Math.max(0, acc), simTime: clock.simTime + ticks * TICK_SECONDS },
    ticks,
  }
}

/** Fraction of the way to the next tick, for interpolating visuals. */
export function tickAlpha(clock: ClockState): number {
  return clock.accumulator / TICK_SECONDS
}
