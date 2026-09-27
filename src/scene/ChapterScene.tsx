import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Chapter } from '../content'
import { MAX_BLOCKS, type SoupState } from '../sim/chapters/soup'
import { ObjectCluster } from './ObjectCluster'
import { placeholders } from './placeholders'

/** Sim-state bindings: which instance counts follow the chapter's state. */
const bindings: Record<string, Record<string, (state: unknown) => number>> = {
  soup: Object.fromEntries(
    ['nucleotide', 'amino-acid', 'fatty-acid'].map((id) => [
      id,
      (state: unknown) => ((state as SoupState).blocks / MAX_BLOCKS) * placeholders[id].count,
    ]),
  ),
}

const TRANSITION_SECONDS = 2
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Lays out one chapter's placeholder objects. Keyed by chapter, so each new chapter
 * mounts fresh and plays the continuous zoom-in from the previous scale.
 */
export function ChapterScene({ chapter, reducedMotion }: { chapter: Chapter; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const age = useRef(0)

  const layout = useMemo(() => {
    const focused = chapter.objects.filter((id) => placeholders[id].count <= 12)
    return chapter.objects.map((id, i) => {
      const spec = placeholders[id]
      const diffuse = spec.count > 12 || spec.size > 2
      const k = focused.indexOf(id)
      const angle = (k / Math.max(1, focused.length)) * Math.PI * 2 + 0.4
      const ring = focused.length > 1 ? 2.1 : 0
      const center = diffuse
        ? new THREE.Vector3(0, 0, 0)
        : new THREE.Vector3(Math.cos(angle) * ring, Math.sin(k * 1.7) * 0.4, Math.sin(angle) * ring)
      const spread = diffuse ? 3.4 : 0.35 + spec.size * 1.6
      return { id, spec, center, spread, seed: (chapter.number + 1) * 1000 + i * 97 }
    })
  }, [chapter])

  useFrame((_, delta) => {
    age.current = Math.min(TRANSITION_SECONDS, age.current + delta)
    const g = group.current
    if (!g) return
    const t = ease(age.current / TRANSITION_SECONDS)
    // Zoom from "far away and tiny" into place; reduced motion only fades.
    g.scale.setScalar(reducedMotion ? 1 : 0.15 + 0.85 * t)
    g.rotation.y = reducedMotion ? 0 : (1 - t) * 0.6
  })

  return (
    <group ref={group}>
      {layout.map((o) => (
        <ObjectCluster
          key={o.id}
          cardId={o.id}
          spec={o.spec}
          center={o.center}
          spread={o.spread}
          seed={o.seed}
          reducedMotion={reducedMotion}
          visibleCount={bindings[chapter.id]?.[o.id]}
        />
      ))}
    </group>
  )
}
