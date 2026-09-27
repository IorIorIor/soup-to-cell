import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js'
import { currentChapter, simStore, useSim } from '../sim/store'
import { ChapterScene } from './ChapterScene'
import { clusterCenters } from './ObjectCluster'
import { palette } from './palette'

const HOME_POSITION = new THREE.Vector3(0, 1.6, 7.5)
const ORIGIN = new THREE.Vector3()

/** Advances the simulation from the render loop; the store owns the fixed tick. */
function SimDriver() {
  useFrame((_, delta) => simStore.getState().tick(Math.min(delta, 0.25)))
  return null
}

/** Eases the orbit target toward the selection, and home again on reset. */
function CameraRig({ resetSignal }: { resetSignal: number }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const camera = useThree((s) => s.camera)
  const homing = useRef(false)

  useEffect(() => {
    if (resetSignal > 0) homing.current = true
  }, [resetSignal])

  useFrame(() => {
    if (!controls) return
    const { selection } = simStore.getState()
    const focus = (selection && clusterCenters.get(selection)) || ORIGIN
    controls.target.lerp(focus, 0.06)
    if (homing.current) {
      camera.position.lerp(HOME_POSITION, 0.08)
      if (camera.position.distanceTo(HOME_POSITION) < 0.02) homing.current = false
    }
    controls.update()
  })
  return null
}

export function Stage({ reducedMotion, resetSignal, onDoubleTap }: {
  reducedMotion: boolean
  resetSignal: number
  onDoubleTap: () => void
}) {
  const chapter = useSim(currentChapter)
  const lastTap = useRef(0)

  return (
    <Canvas
      className="stage"
      dpr={[1, 2]}
      camera={{ position: HOME_POSITION.toArray(), fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => simStore.getState().select(null)}
      onPointerUp={() => {
        const now = performance.now()
        if (now - lastTap.current < 300) onDoubleTap()
        lastTap.current = now
      }}
      aria-hidden
    >
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.background, 7, 16]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fff1e0" />
      <pointLight position={[-5, -2, -4]} intensity={18} color="#5b7cff" />
      <ChapterScene key={chapter.id} chapter={chapter} reducedMotion={reducedMotion} />
      <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={12} enableDamping />
      <CameraRig resetSignal={resetSignal} />
      <SimDriver />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
