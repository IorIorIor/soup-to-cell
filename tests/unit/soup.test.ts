import { describe, expect, it } from 'vitest'
import { equilibriumBlocks, soupModel } from '../../src/sim/chapters/soup'

const env = (temperature: number, uv: number, minerals = 0.3) => ({ temperature, uv, minerals })

function run(e: ReturnType<typeof env>, seconds: number) {
  let s = soupModel.initialState
  for (let i = 0; i < seconds * 10; i++) s = soupModel.step(s, e, 0.1)
  return s.blocks
}

describe('soup rules', () => {
  it('makes more building blocks with more energy', () => {
    expect(equilibriumBlocks(env(60, 0.5))).toBeGreaterThan(equilibriumBlocks(env(20, 0.1)))
  })

  it('breaks them apart again when energy is too high', () => {
    expect(equilibriumBlocks(env(100, 1))).toBeLessThan(equilibriumBlocks(env(60, 0.5)) / 2)
  })

  it('mineral surfaces help', () => {
    expect(equilibriumBlocks(env(40, 0.3, 1))).toBeGreaterThan(equilibriumBlocks(env(40, 0.3, 0)))
  })

  it('shows a visible change within 2 seconds of an edit', () => {
    const start = soupModel.initialState.blocks
    expect(Math.abs(run(env(80, 0.8), 2) - start)).toBeGreaterThan(3)
  })

  it('settles near the equilibrium', () => {
    expect(run(env(50, 0.4), 60)).toBeCloseTo(equilibriumBlocks(env(50, 0.4)), 0)
  })

  it('captions each direction of change', () => {
    expect(soupModel.captionForEnvChange!(env(20, 0.1), env(60, 0.5))).toMatch(/More energy/)
    expect(soupModel.captionForEnvChange!(env(60, 0.5), env(20, 0.1))).toMatch(/Less energy/)
    expect(soupModel.captionForEnvChange!(env(60, 0.5), env(100, 1))).toMatch(/Too much energy/)
  })
})
