import { describe, expect, it } from 'vitest'
import { advanceClock, initialClock, TICK_SECONDS } from '../../src/sim/clock'

describe('clock', () => {
  it('runs 10 ticks per simulated second at 1×', () => {
    const { ticks, clock } = advanceClock(initialClock, 1)
    expect(ticks).toBe(10)
    expect(clock.simTime).toBeCloseTo(1)
  })

  it('carries leftover time between frames', () => {
    let clock = initialClock
    let total = 0
    for (let i = 0; i < 60; i++) {
      const r = advanceClock(clock, 1 / 60)
      clock = r.clock
      total += r.ticks
    }
    expect(total).toBe(10)
    expect(clock.accumulator).toBeLessThan(TICK_SECONDS)
  })

  it('scales with speed and stops when paused', () => {
    expect(advanceClock({ ...initialClock, speed: 8 }, 0.5).ticks).toBe(20)
    expect(advanceClock({ ...initialClock, speed: 0.25 }, 1).ticks).toBe(2)
    expect(advanceClock({ ...initialClock, playing: false }, 1).ticks).toBe(0)
  })

  it('caps catch-up after a long stall', () => {
    expect(advanceClock({ ...initialClock, speed: 8 }, 10).ticks).toBe(20)
  })
})
