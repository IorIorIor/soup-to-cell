import { useEffect, useRef, useState } from 'react'
import { currentChapter, useSim } from '../sim/store'
import { formatLength, hairComparison, logLerp, niceLength } from './scale'

const RULER_MAX_PX = 96
/** Share of the viewport width the ruler may represent at most. */
const RULER_MAX_SHARE = 0.25

/** Always-on ruler. Ticks over in log space during the 2-second chapter zoom. */
export function ScaleRuler({ reducedMotion }: { reducedMotion: boolean }) {
  const target = useSim((s) => currentChapter(s).viewWidthMeters)
  const [width, setWidth] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const run = (now: number) => {
      const t = reducedMotion ? 1 : Math.min(1, (now - start) / 2000)
      const w = logLerp(a, target, t)
      from.current = w
      setWidth(w)
      if (t < 1) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [target, reducedMotion])

  const length = niceLength(width * RULER_MAX_SHARE)
  const px = Math.max(24, (length / (width * RULER_MAX_SHARE)) * RULER_MAX_PX)

  return (
    <div className="ruler" aria-label={`Scale: this bar is ${formatLength(length)}, ${hairComparison(length)}`} role="img">
      <div className="ruler-bar" style={{ width: px }} />
      <div className="ruler-text">
        <strong>{formatLength(length)}</strong>
        <span>{hairComparison(length)}</span>
      </div>
    </div>
  )
}
