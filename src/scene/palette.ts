/** The fixed colour language from the build plan. Shape is the second cue, never colour alone. */
export const palette = {
  rna: '#ff7a66',
  dna: '#6a6ff5',
  protein: '#2fc6a4',
  lipid: '#f2b35a',
  energy: '#ffd84a',
  water: '#8fa6c4',
  mineral: '#a88f7a',
  background: '#07080c',
} as const

export type PaletteKey = keyof typeof palette
