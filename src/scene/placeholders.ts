import type { PaletteKey } from './palette'

export type PlaceholderShape = 'sphere' | 'capsule' | 'box' | 'torus' | 'ico' | 'cone'

export interface PlaceholderSpec {
  color: PaletteKey
  shape: PlaceholderShape
  /** Instances drawn for this object type. */
  count: number
  size: number
  opacity?: number
}

/**
 * Milestone 1 stand-in geometry for every tappable card id.
 * Real geometry replaces these chapter by chapter from milestone 2 on.
 */
export const placeholders: Record<string, PlaceholderSpec> = {
  water: { color: 'water', shape: 'sphere', count: 60, size: 0.12, opacity: 0.35 },
  salt: { color: 'water', shape: 'ico', count: 14, size: 0.1, opacity: 0.6 },
  nucleotide: { color: 'rna', shape: 'box', count: 20, size: 0.22 },
  'amino-acid': { color: 'protein', shape: 'ico', count: 20, size: 0.2 },
  'fatty-acid': { color: 'lipid', shape: 'capsule', count: 20, size: 0.14 },
  clay: { color: 'mineral', shape: 'box', count: 6, size: 0.9 },
  'rna-strand': { color: 'rna', shape: 'capsule', count: 5, size: 0.28 },
  'base-pair': { color: 'rna', shape: 'box', count: 8, size: 0.2 },
  'rna-hairpin': { color: 'rna', shape: 'torus', count: 3, size: 0.45 },
  ribozyme: { color: 'rna', shape: 'torus', count: 2, size: 0.55 },
  replicator: { color: 'rna', shape: 'cone', count: 2, size: 0.5 },
  'copying-error': { color: 'energy', shape: 'box', count: 4, size: 0.18 },
  bilayer: { color: 'lipid', shape: 'torus', count: 2, size: 0.8, opacity: 0.6 },
  vesicle: { color: 'lipid', shape: 'sphere', count: 3, size: 0.9, opacity: 0.4 },
  protocell: { color: 'lipid', shape: 'sphere', count: 6, size: 0.7, opacity: 0.45 },
  ribosome: { color: 'rna', shape: 'sphere', count: 6, size: 0.45 },
  mrna: { color: 'rna', shape: 'capsule', count: 3, size: 0.2 },
  trna: { color: 'rna', shape: 'cone', count: 8, size: 0.22 },
  codon: { color: 'rna', shape: 'box', count: 9, size: 0.14 },
  protein: { color: 'protein', shape: 'ico', count: 14, size: 0.3 },
  dna: { color: 'dna', shape: 'torus', count: 1, size: 1.2 },
  gene: { color: 'dna', shape: 'capsule', count: 4, size: 0.2 },
  promoter: { color: 'dna', shape: 'cone', count: 4, size: 0.18 },
  polymerase: { color: 'protein', shape: 'sphere', count: 3, size: 0.4 },
  atp: { color: 'energy', shape: 'sphere', count: 30, size: 0.07 },
  'transport-gate': { color: 'protein', shape: 'cone', count: 8, size: 0.25 },
  'minimal-cell': { color: 'lipid', shape: 'sphere', count: 1, size: 3.2, opacity: 0.15 },
}

/** Deterministic pseudo-random numbers so layouts are stable between renders. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
