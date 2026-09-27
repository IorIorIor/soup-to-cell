/** Environment values, keyed by slider id from the chapter's content file. */
export type Env = Record<string, number>

export interface Vital {
  label: string
  value: string
}

/**
 * A chapter's simulation: a small state model advanced on a fixed tick.
 * Every function here must be pure so it can be unit-tested without a renderer.
 */
export interface ChapterModel<S = unknown> {
  id: string
  initialEnv: Env
  initialState: S
  /** Advance one fixed tick. `dt` is simulated seconds (always TICK_SECONDS). */
  step(state: S, env: Env, dt: number): S
  /** One-line consequence caption for an environment edit, or null for none. */
  captionForEnvChange?(prev: Env, next: Env): string | null
  vitals?(state: S, env: Env): Vital[]
}
