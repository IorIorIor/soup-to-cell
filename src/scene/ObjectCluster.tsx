import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { simStore } from '../sim/store'
import { palette } from './palette'
import { seeded, type PlaceholderSpec } from './placeholders'

export interface ClusterProps {
  cardId: string
  spec: PlaceholderSpec
  center: THREE.Vector3
  spread: number
  seed: number
  reducedMotion: boolean
  /** Instances to show right now; defaults to all. Read every frame from the sim state. */
  visibleCount?: (state: unknown) => number
}

/** Where each cluster sits, so the camera can ease toward a selection. */
export const clusterCenters = new Map<string, THREE.Vector3>()

const GREY = new THREE.Color('#5a5f6b')
const tmp = new THREE.Object3D()
const tmpColor = new THREE.Color()

function geometryFor(shape: PlaceholderSpec['shape'], size: number): THREE.BufferGeometry {
  switch (shape) {
    case 'sphere':
      return new THREE.SphereGeometry(size, 24, 16)
    case 'capsule':
      return new THREE.CapsuleGeometry(size * 0.5, size * 2.2, 4, 12)
    case 'box':
      return new THREE.BoxGeometry(size, size * 1.4, size * 0.6)
    case 'torus':
      return new THREE.TorusGeometry(size, size * 0.18, 12, 48)
    case 'ico':
      return new THREE.IcosahedronGeometry(size, 0)
    case 'cone':
      return new THREE.ConeGeometry(size * 0.6, size * 1.6, 12)
  }
}

export function ObjectCluster({ cardId, spec, center, spread, seed, reducedMotion, visibleCount }: ClusterProps) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const bounded = useRef(false)
  const geometry = useMemo(() => geometryFor(spec.shape, spec.size), [spec.shape, spec.size])
  const baseColor = useMemo(() => new THREE.Color(palette[spec.color]), [spec.color])
  const baseOpacity = spec.opacity ?? 1

  // Stable per-instance layout: home position, rotation, and jitter phase.
  const instances = useMemo(() => {
    const rand = seeded(seed)
    return Array.from({ length: spec.count }, () => {
      const r = spread * Math.cbrt(rand())
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      return {
        home: new THREE.Vector3(
          center.x + r * Math.sin(phi) * Math.cos(theta),
          center.y + r * Math.cos(phi) * 0.6,
          center.z + r * Math.sin(phi) * Math.sin(theta),
        ),
        rot: new THREE.Euler(rand() * 6.28, rand() * 6.28, rand() * 6.28),
        phase: rand() * 100,
        spin: (rand() - 0.5) * 0.6,
      }
    })
  }, [seed, spec.count, spread, center])

  useEffect(() => {
    clusterCenters.set(cardId, center)
    return () => {
      clusterCenters.delete(cardId)
    }
  }, [cardId, center])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ clock }, delta) => {
    const m = mesh.current
    if (!m) return
    const { selection, state } = simStore.getState()
    const t = clock.elapsedTime
    // Brownian-looking jitter: layered sines per instance. Reduced motion calms it right down.
    const amp = (reducedMotion ? 0.015 : 0.08) * Math.max(0.4, spec.size * 2)
    const shown = Math.min(spec.count, Math.round(visibleCount ? visibleCount(state) : spec.count))
    m.count = spec.count
    instances.forEach((inst, i) => {
      const p = inst.phase
      tmp.position.set(
        inst.home.x + amp * (Math.sin(t * 1.3 + p) + 0.5 * Math.sin(t * 3.1 + p * 2)),
        inst.home.y + amp * (Math.sin(t * 1.7 + p * 3) + 0.5 * Math.sin(t * 2.3 + p)),
        inst.home.z + amp * (Math.sin(t * 1.1 + p * 5) + 0.5 * Math.sin(t * 2.9 + p * 4)),
      )
      if (!reducedMotion) inst.rot.y += inst.spin * delta
      tmp.rotation.copy(inst.rot)
      tmp.scale.setScalar(i < shown ? 1 : 0)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
    })
    m.instanceMatrix.needsUpdate = true
    // Tap hit-testing culls by bounding sphere; compute it once the instances are placed.
    if (!bounded.current) {
      m.computeBoundingSphere()
      m.boundingSphere?.expandByPoint(center)
      bounded.current = true
    }

    const mat = m.material as THREE.MeshStandardMaterial
    const dimmed = selection !== null && selection !== cardId
    const selected = selection === cardId
    tmpColor.copy(baseColor)
    if (dimmed) tmpColor.lerp(GREY, 0.6)
    mat.color.lerp(tmpColor, 0.15)
    mat.opacity += ((dimmed ? baseOpacity * 0.4 : baseOpacity) - mat.opacity) * 0.15
    mat.emissiveIntensity += ((selected ? 0.55 : 0.06) - mat.emissiveIntensity) * 0.15
  })

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    simStore.getState().select(cardId)
  }

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, undefined, spec.count]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
      name={cardId}
    >
      <meshStandardMaterial
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={0.06}
        roughness={0.55}
        metalness={0.05}
        transparent
        opacity={baseOpacity}
        depthWrite={baseOpacity > 0.8}
      />
    </instancedMesh>
  )
}
