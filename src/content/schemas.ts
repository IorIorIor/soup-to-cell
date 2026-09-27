import { z } from 'zod'

export const cardStatus = z.enum(['established', 'likely', 'open-question'])
export type CardStatus = z.infer<typeof cardStatus>

const kebabId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are kebab-case')

/** One learn card per tappable object type. Copy lives here, never in code. */
export const cardSchema = z
  .object({
    id: kebabId,
    name: z.string().min(1),
    oneLine: z.string().min(1).max(120),
    howItWorks: z
      .string()
      .min(1)
      .refine((s) => s.trim().split(/\s+/).length <= 60, 'howItWorks must be under 60 words'),
    deeper: z.string().min(1),
    realSize: z.string().min(1),
    sizeComparison: z.string().min(1),
    status: cardStatus,
    simplification: z.string().min(1),
    miniAnimation: z.string().optional(),
    relatedIds: z.array(kebabId).default([]),
  })
  .strict()
export type Card = z.infer<typeof cardSchema>

export const envSliderSchema = z
  .object({
    id: kebabId,
    label: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number().positive(),
    unit: z.string().default(''),
  })
  .strict()
export type EnvSlider = z.infer<typeof envSliderSchema>

export const chapterSchema = z
  .object({
    id: kebabId,
    number: z.number().int().min(0).max(8),
    title: z.string(),
    tagline: z.string(),
    /** Width of the view in metres; drives the scale ruler. */
    viewWidthMeters: z.number().positive(),
    hypothesis: z.boolean(),
    /** Real duration of the chapter's key process, for the time-compression caption. */
    realDuration: z.string(),
    guidance: z.array(z.string()).min(1),
    /** Card ids of the tappable objects shown in this chapter. */
    objects: z.array(kebabId).min(1),
    sliders: z.array(envSliderSchema).default([]),
  })
  .strict()
export type Chapter = z.infer<typeof chapterSchema>

export interface ContentBundle {
  cards: Record<string, Card>
  chapters: Chapter[]
}

/** Parses raw JSON and checks cross-references. Throws with every problem listed. */
export function parseContent(
  rawCards: Record<string, unknown>,
  rawChapters: Record<string, unknown>,
): ContentBundle {
  const errors: string[] = []
  const cards: Record<string, Card> = {}

  for (const [file, raw] of Object.entries(rawCards)) {
    const result = cardSchema.safeParse(raw)
    if (!result.success) {
      errors.push(`${file}: ${z.prettifyError(result.error)}`)
      continue
    }
    const card = result.data
    if (!file.endsWith(`/${card.id}.json`)) errors.push(`${file}: file name must match id "${card.id}"`)
    if (cards[card.id]) errors.push(`${file}: duplicate card id "${card.id}"`)
    cards[card.id] = card
  }

  const chapters: Chapter[] = []
  for (const [file, raw] of Object.entries(rawChapters)) {
    const result = chapterSchema.safeParse(raw)
    if (!result.success) {
      errors.push(`${file}: ${z.prettifyError(result.error)}`)
      continue
    }
    chapters.push(result.data)
  }
  chapters.sort((a, b) => a.number - b.number)

  chapters.forEach((ch, i) => {
    if (ch.number !== i) errors.push(`chapters: expected chapter number ${i}, found ${ch.number} (${ch.id})`)
    for (const id of ch.objects) {
      if (!cards[id]) errors.push(`chapter ${ch.id}: object "${id}" has no card`)
    }
  })
  for (const card of Object.values(cards)) {
    for (const rel of card.relatedIds) {
      if (!cards[rel]) errors.push(`card ${card.id}: relatedIds references missing card "${rel}"`)
    }
  }

  if (errors.length) throw new Error(`Content is invalid:\n- ${errors.join('\n- ')}`)
  return { cards, chapters }
}
