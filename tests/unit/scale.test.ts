import { describe, expect, it } from 'vitest'
import { chapterFromHash } from '../../src/director/routing'
import { formatLength, hairComparison, logLerp, niceLength } from '../../src/ui/scale'

describe('scale ruler', () => {
  it('formats across units', () => {
    expect(formatLength(5e-9)).toBe('5 nm')
    expect(formatLength(2e-6)).toBe('2 µm')
    expect(formatLength(100e-9)).toBe('100 nm')
    expect(formatLength(0.3e-9)).toBe('0.3 nm')
  })

  it('picks 1-2-5 lengths that fit', () => {
    expect(niceLength(7e-9)).toBeCloseTo(5e-9)
    expect(niceLength(150e-9)).toBeCloseTo(100e-9)
    expect(niceLength(3e-6)).toBeCloseTo(2e-6)
  })

  it('compares to a hair', () => {
    expect(hairComparison(25e-9)).toBe('a 4,000th the width of a hair')
    expect(hairComparison(400e-9)).toBe('a 250th the width of a hair')
  })

  it('interpolates in log space', () => {
    expect(logLerp(1e-9, 1e-6, 0.5)).toBeCloseTo(Math.sqrt(1e-15), 20)
  })
})

describe('chapter routing', () => {
  it('parses valid hashes only', () => {
    expect(chapterFromHash('#/4', 9)).toBe(4)
    expect(chapterFromHash('#/9', 9)).toBeNull()
    expect(chapterFromHash('#4', 9)).toBeNull()
    expect(chapterFromHash('', 9)).toBeNull()
  })
})
