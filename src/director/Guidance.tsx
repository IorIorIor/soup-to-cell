import { currentChapter, simStore, useSim } from '../sim/store'

/** Guided prompt that opens each chapter. Skippable at any time. */
export function Guidance() {
  const chapter = useSim(currentChapter)
  const step = useSim((s) => s.guidanceStep)
  const done = useSim((s) => s.guidanceDone)
  const cardOpen = useSim((s) => s.selection !== null)
  if (done || cardOpen) return null
  const last = step >= chapter.guidance.length - 1
  const { advanceGuidance, skipGuidance } = simStore.getState()

  return (
    <aside className="guidance glass" aria-label="Guide">
      <p>{chapter.guidance[step]}</p>
      <div className="row">
        <button onClick={advanceGuidance}>{last ? 'Got it' : 'Next'}</button>
        {!last && (
          <button className="quiet" onClick={skipGuidance}>
            Skip
          </button>
        )}
      </div>
    </aside>
  )
}
