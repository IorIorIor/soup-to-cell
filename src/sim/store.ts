import { createStore, useStore } from 'zustand'
import { chapters as allChapters, type Chapter } from '../content'
import { advanceClock, initialClock, TICK_SECONDS, type ClockState, type Speed } from './clock'
import { modelFor } from './chapters'
import type { ChapterModel, Env } from './types'

interface Snapshot {
  env: Env
  state: unknown
  label: string
  /** Edits with the same key in quick succession (one slider drag) share one undo step. */
  key: string
  at: number
}

export interface Caption {
  text: string
  /** Increments so the same text can re-trigger display. */
  seq: number
}

export interface SimStore {
  chapters: Chapter[]
  chapterIndex: number
  model: ChapterModel
  env: Env
  state: unknown
  history: Snapshot[]
  clock: ClockState
  selection: string | null
  caption: Caption | null
  guidanceStep: number
  guidanceDone: boolean

  loadChapter(index: number): void
  setEnv(id: string, value: number, now?: number): void
  /** Generic structural edit (add/remove/mutate). Later chapters build on this. */
  applyEdit(label: string, edit: (state: unknown, env: Env) => { state: unknown; env: Env }, caption?: string): void
  undo(): void
  reset(): void
  tick(realDt: number): void
  select(id: string | null): void
  setPlaying(playing: boolean): void
  setSpeed(speed: Speed): void
  advanceGuidance(): void
  skipGuidance(): void
}

const COALESCE_MS = 1500

export function createSimStore(chapters: Chapter[] = allChapters, startIndex = 0) {
  return createStore<SimStore>()((set, get) => {
    let captionSeq = 0
    const caption = (text: string | null | undefined): Caption | null =>
      text ? { text, seq: ++captionSeq } : null

    const fresh = (index: number) => {
      const model = modelFor(chapters[index])
      return {
        chapterIndex: index,
        model,
        env: { ...model.initialEnv },
        state: model.initialState,
        history: [],
        clock: { ...initialClock },
        selection: null,
        guidanceStep: 0,
        guidanceDone: false,
      }
    }

    const push = (label: string, key: string, now: number) => {
      const { history, env, state } = get()
      const last = history[history.length - 1]
      if (last && last.key === key && now - last.at < COALESCE_MS) {
        return { history: [...history.slice(0, -1), { ...last, at: now }], before: last.env }
      }
      return { history: [...history, { env, state, label, key, at: now }], before: env }
    }

    return {
      chapters,
      ...fresh(startIndex),
      caption: null,

      loadChapter(index) {
        const clamped = Math.max(0, Math.min(chapters.length - 1, index))
        set({ ...fresh(clamped), caption: null })
      },

      setEnv(id, value, now = Date.now()) {
        const { env, model, chapterIndex } = get()
        if (env[id] === value) return
        const label = chapters[chapterIndex].sliders.find((s) => s.id === id)?.label ?? id
        const { history, before } = push(`Change ${label.toLowerCase()}`, `env:${id}`, now)
        const next = { ...env, [id]: value }
        const text = model.captionForEnvChange?.(before, next)
        set({ env: next, history, ...(text ? { caption: caption(text) } : {}) })
      },

      applyEdit(label, edit, text) {
        const { history } = push(label, `edit:${label}:${Math.random()}`, Date.now())
        const { state, env } = edit(get().state, get().env)
        set({ state, env, history, ...(text ? { caption: caption(text) } : {}) })
      },

      undo() {
        const { history } = get()
        const last = history[history.length - 1]
        if (!last) return
        set({
          env: last.env,
          state: last.state,
          history: history.slice(0, -1),
          caption: caption(`Undone: ${last.label.toLowerCase()}.`),
        })
      },

      reset() {
        set({ ...fresh(get().chapterIndex), caption: caption('Chapter reset.') })
      },

      tick(realDt) {
        const { clock, model } = get()
        const { clock: next, ticks } = advanceClock(clock, realDt)
        if (next === clock) return
        let { state } = get()
        const { env } = get()
        for (let i = 0; i < ticks; i++) state = model.step(state, env, TICK_SECONDS)
        set({ clock: next, state })
      },

      select(id) {
        set({ selection: id })
      },
      setPlaying(playing) {
        set({ clock: { ...get().clock, playing } })
      },
      setSpeed(speed) {
        set({ clock: { ...get().clock, speed } })
      },
      advanceGuidance() {
        const { guidanceStep, chapterIndex } = get()
        const last = chapters[chapterIndex].guidance.length - 1
        set(guidanceStep >= last ? { guidanceDone: true } : { guidanceStep: guidanceStep + 1 })
      },
      skipGuidance() {
        set({ guidanceDone: true })
      },
    }
  })
}

export const simStore = createSimStore()

export function useSim<T>(selector: (s: SimStore) => T): T {
  return useStore(simStore, selector)
}

export const currentChapter = (s: SimStore) => s.chapters[s.chapterIndex]
