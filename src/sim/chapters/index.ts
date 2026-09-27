import type { Chapter } from '../../content'
import type { ChapterModel } from '../types'
import { soupModel } from './soup'

const models: Record<string, ChapterModel<any>> = {
  soup: soupModel,
}

/** Chapters not yet built get a static model whose env comes from their sliders' midpoints. */
function placeholderModel(chapter: Chapter): ChapterModel<null> {
  return {
    id: chapter.id,
    initialEnv: Object.fromEntries(chapter.sliders.map((s) => [s.id, (s.min + s.max) / 2])),
    initialState: null,
    step: (state) => state,
  }
}

export function modelFor(chapter: Chapter): ChapterModel<any> {
  return models[chapter.id] ?? placeholderModel(chapter)
}
