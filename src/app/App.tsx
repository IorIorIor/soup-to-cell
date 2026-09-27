import { useState } from 'react'
import { ChapterMenu } from '../director/ChapterMenu'
import { Guidance } from '../director/Guidance'
import { goToChapter, useChapterRouting } from '../director/routing'
import { Stage } from '../scene/Stage'
import { currentChapter, simStore, useSim } from '../sim/store'
import { Caption } from '../ui/Caption'
import { EnvDrawer } from '../ui/EnvDrawer'
import { usePrefersReducedMotion } from '../ui/hooks'
import { LearnCard } from '../ui/LearnCard'
import { ObjectsList } from '../ui/ObjectsList'
import { ScaleRuler } from '../ui/ScaleRuler'
import { TimeBar } from '../ui/TimeBar'
import { Vitals } from '../ui/Vitals'

export function App() {
  useChapterRouting()
  const reducedMotion = usePrefersReducedMotion()
  const chapter = useSim(currentChapter)
  const count = useSim((s) => s.chapters.length)
  const canUndo = useSim((s) => s.history.length > 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const { undo, reset } = simStore.getState()

  return (
    <div className="app">
      <Stage reducedMotion={reducedMotion} resetSignal={resetSignal} onDoubleTap={() => setResetSignal((n) => n + 1)} />

      <header className="top">
        <button className="pill glass chapter-btn" onClick={() => setMenuOpen(true)} aria-label="Open chapter menu">
          <span className="num">{chapter.number}</span>
          <h1>{chapter.title}</h1>
        </button>
        <div className="top-actions">
          <button className="icon-btn glass" onClick={undo} disabled={!canUndo} aria-label="Undo last edit">
            ↶
          </button>
          <button className="icon-btn glass" onClick={reset} aria-label="Reset chapter">
            ⟲
          </button>
        </div>
      </header>

      {chapter.hypothesis && <p className="honesty">This part of the story is a best current hypothesis.</p>}
      {chapter.id === 'cell' && <p className="honesty">Modelled on JCVI-syn3.0, a real synthetic cell.</p>}

      <Caption />
      <Guidance />
      <Vitals />

      <div className="side">
        <ObjectsList />
        <EnvDrawer />
      </div>

      <footer className="bottom">
        <ScaleRuler reducedMotion={reducedMotion} />
        <div className="chapter-nav">
          <button className="icon-btn glass" disabled={chapter.number === 0} onClick={() => goToChapter(chapter.number - 1)} aria-label="Previous chapter">
            ‹
          </button>
          <button className="icon-btn glass" disabled={chapter.number === count - 1} onClick={() => goToChapter(chapter.number + 1)} aria-label="Next chapter">
            ›
          </button>
        </div>
        <TimeBar />
      </footer>

      <LearnCard />
      <ChapterMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
