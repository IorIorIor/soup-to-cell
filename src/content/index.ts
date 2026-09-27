import { parseContent } from './schemas'

const rawCards = import.meta.glob('./cards/*.json', { eager: true, import: 'default' })
const rawChapters = import.meta.glob('./chapters/*.json', { eager: true, import: 'default' })

export const content = parseContent(rawCards, rawChapters)
export const { cards, chapters } = content
export * from './schemas'
