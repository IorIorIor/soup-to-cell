import { describe, expect, it } from 'vitest'
import { cards, chapters, parseContent } from '../../src/content'

const validCard = {
  id: 'thing',
  name: 'Thing',
  oneLine: 'A thing.',
  howItWorks: 'It works.',
  deeper: 'More.',
  realSize: '1 nm',
  sizeComparison: 'tiny',
  status: 'established',
  simplification: 'None.',
  relatedIds: [],
}

describe('content', () => {
  it('loads every chapter in order, 0 to 8', () => {
    expect(chapters.map((c) => c.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('gives every visible object a card with a status badge', () => {
    for (const ch of chapters) for (const id of ch.objects) expect(cards[id]?.status).toBeTruthy()
  })

  it('keeps card sentences under 20 words', () => {
    for (const card of Object.values(cards)) {
      for (const field of [card.oneLine, card.howItWorks]) {
        for (const sentence of field.split(/(?<=[.!?])\s+/)) {
          expect(sentence.split(/\s+/).length, `${card.id}: "${sentence}"`).toBeLessThan(20)
        }
      }
    }
  })

  it('rejects a malformed card', () => {
    expect(() => parseContent({ './cards/thing.json': { ...validCard, status: 'maybe' } }, {})).toThrow(/status/)
  })

  it('rejects a card whose file name does not match its id', () => {
    expect(() => parseContent({ './cards/other.json': validCard }, {})).toThrow(/file name/)
  })

  it('rejects a dangling related id', () => {
    expect(() => parseContent({ './cards/thing.json': { ...validCard, relatedIds: ['ghost'] } }, {})).toThrow(/ghost/)
  })

  it('rejects a chapter object with no card', () => {
    const chapter = { ...chapters[0], objects: ['ghost'] }
    expect(() => parseContent({}, { './chapters/0.json': chapter })).toThrow(/no card/)
  })
})
