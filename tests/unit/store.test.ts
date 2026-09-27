import { describe, expect, it } from 'vitest'
import { createSimStore } from '../../src/sim/store'

describe('sim store', () => {
  it('coalesces one slider drag into a single undo step', () => {
    const store = createSimStore()
    const s = () => store.getState()
    s().setEnv('temperature', 50, 1000)
    s().setEnv('temperature', 60, 1100)
    s().setEnv('temperature', 70, 1200)
    expect(s().history).toHaveLength(1)
    s().undo()
    expect(s().env.temperature).toBe(40)
    expect(s().history).toHaveLength(0)
  })

  it('keeps separate edits as separate undo steps', () => {
    const store = createSimStore()
    const s = () => store.getState()
    s().setEnv('temperature', 50, 1000)
    s().setEnv('uv', 0.9, 1100)
    s().setEnv('temperature', 60, 5000)
    expect(s().history).toHaveLength(3)
    s().undo()
    expect(s().env).toMatchObject({ temperature: 50, uv: 0.9 })
  })

  it('captions an edit and the undo', () => {
    const store = createSimStore()
    store.getState().setEnv('temperature', 90, 0)
    expect(store.getState().caption?.text).toMatch(/energy/)
    store.getState().undo()
    expect(store.getState().caption?.text).toMatch(/^Undone/)
  })

  it('undo restores the sim state from before the edit', () => {
    const store = createSimStore()
    const s = () => store.getState()
    const before = s().state
    s().applyEdit('Add blocks', (state, env) => ({ state: { blocks: (state as { blocks: number }).blocks + 10 }, env }))
    expect(s().state).not.toEqual(before)
    s().undo()
    expect(s().state).toEqual(before)
  })

  it('reset returns the chapter to its defaults', () => {
    const store = createSimStore()
    const s = () => store.getState()
    s().setEnv('uv', 1, 0)
    s().tick(3)
    s().select('water')
    s().reset()
    expect(s().env).toEqual(s().model.initialEnv)
    expect(s().state).toEqual(s().model.initialState)
    expect(s().history).toHaveLength(0)
    expect(s().selection).toBeNull()
  })

  it('ticks the model while playing, not while paused', () => {
    const store = createSimStore()
    const s = () => store.getState()
    s().setEnv('temperature', 90, 0)
    s().setPlaying(false)
    s().tick(1)
    expect(s().state).toEqual(s().model.initialState)
    s().setPlaying(true)
    s().tick(1)
    expect(s().state).not.toEqual(s().model.initialState)
  })

  it('loads every chapter with its own env and clears history', () => {
    const store = createSimStore()
    const s = () => store.getState()
    s().setEnv('temperature', 90, 0)
    for (let i = 0; i < s().chapters.length; i++) {
      s().loadChapter(i)
      expect(s().chapterIndex).toBe(i)
      expect(s().history).toHaveLength(0)
      for (const slider of s().chapters[i].sliders) expect(s().env[slider.id]).toBeTypeOf('number')
    }
  })

  it('walks through guidance steps', () => {
    const store = createSimStore()
    const s = () => store.getState()
    const steps = s().chapters[0].guidance.length
    for (let i = 0; i < steps; i++) s().advanceGuidance()
    expect(s().guidanceDone).toBe(true)
  })
})
