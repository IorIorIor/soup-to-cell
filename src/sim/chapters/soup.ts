import type { ChapterModel, Env } from '../types'

/**
 * Chapter 0 rule: energy (heat + UV) makes building blocks, mineral surfaces help,
 * and past a threshold the same energy breaks them apart again.
 */
export interface SoupState {
  /** Building blocks currently in view (nucleotides, amino acids, fatty acids). */
  blocks: number
}

export const MAX_BLOCKS = 60
const BASE_DECAY = 0.1
const DAMAGE_THRESHOLD = 0.7
const DAMAGE_STRENGTH = 8

/** 0..1: how much usable energy reaches the pool. */
export function soupEnergy(env: Env): number {
  return 0.6 * (env.temperature / 100) + 0.4 * env.uv
}

export function productionRate(env: Env): number {
  return 4 * soupEnergy(env) * (1 + env.minerals)
}

export function breakdownRate(env: Env): number {
  const excess = Math.max(0, soupEnergy(env) - DAMAGE_THRESHOLD)
  return BASE_DECAY + DAMAGE_STRENGTH * excess * excess
}

/** The count the pool settles at under a given environment. */
export function equilibriumBlocks(env: Env): number {
  return Math.min(MAX_BLOCKS, productionRate(env) / breakdownRate(env))
}

export const soupModel: ChapterModel<SoupState> = {
  id: 'soup',
  initialEnv: { temperature: 40, uv: 0.3, minerals: 0.3 },
  initialState: { blocks: 12 },
  step(state, env, dt) {
    const next = state.blocks + (productionRate(env) - breakdownRate(env) * state.blocks) * dt
    return { blocks: Math.min(MAX_BLOCKS, Math.max(0, next)) }
  },
  captionForEnvChange(prev, next) {
    const before = equilibriumBlocks(prev)
    const after = equilibriumBlocks(next)
    const overheated = soupEnergy(next) > DAMAGE_THRESHOLD
    if (overheated && after < before) return 'Too much energy: building blocks break apart as fast as they form.'
    if (after > before + 0.5) return 'More energy: more building blocks form in the pool.'
    if (after < before - 0.5) return 'Less energy: fewer building blocks form.'
    return null
  },
  vitals(state, env) {
    return [
      { label: 'Building blocks', value: String(Math.round(state.blocks)) },
      { label: 'Energy', value: `${Math.round(soupEnergy(env) * 100)}%` },
    ]
  },
}
