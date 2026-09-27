import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { cards, type CardStatus } from '../content'
import { currentChapter, simStore, useSim } from '../sim/store'

const STATUS_LABEL: Record<CardStatus, string> = {
  established: 'Established',
  likely: 'Likely',
  'open-question': 'Open question',
}

const DEPTHS = ['One line', 'How it works', 'Go deeper'] as const

/** Bottom sheet for the current selection. Swipe up for more depth, down to go back or close. */
export function LearnCard() {
  const selection = useSim((s) => s.selection)
  const chapter = useSim(currentChapter)
  const [depth, setDepth] = useState(0)
  const card = selection ? cards[selection] : undefined

  useEffect(() => setDepth(0), [selection])

  const close = () => simStore.getState().select(null)
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -40) setDepth((d) => Math.min(2, d + 1))
    else if (info.offset.y > 40) depth === 0 ? close() : setDepth((d) => d - 1)
  }

  return (
    <AnimatePresence mode="wait">
      {card && (
        <motion.section
          key={card.id}
          className="learn-card glass"
          role="dialog"
          aria-labelledby="learn-card-title"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={onDragEnd}
        >
          <div className="grabber" aria-hidden />
          <header className="learn-card-head">
            <h2 id="learn-card-title">{card.name}</h2>
            <span className={`badge badge-${card.status}`}>{STATUS_LABEL[card.status]}</span>
            <button className="icon-btn" onClick={close} aria-label="Close card">
              ✕
            </button>
          </header>
          <p className="one-line">{card.oneLine}</p>

          {depth >= 1 && (
            <div className="depth">
              <p>{card.howItWorks}</p>
              <p className="meta">
                Real size: {card.realSize} · {card.sizeComparison}
              </p>
            </div>
          )}
          {depth >= 2 && (
            <div className="depth">
              <p>{card.deeper}</p>
              <p className="meta">Simplified here: {card.simplification}</p>
              {card.relatedIds.length > 0 && (
                <div className="related">
                  {card.relatedIds.map((id) => (
                    <button
                      key={id}
                      className="chip"
                      onClick={() => simStore.getState().select(id)}
                      aria-label={`Open card: ${cards[id].name}${chapter.objects.includes(id) ? '' : ' (not in this scene)'}`}
                    >
                      {cards[id].name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <nav className="depth-tabs" aria-label="Card depth">
            {DEPTHS.map((label, i) => (
              <button key={label} className={i === depth ? 'active' : ''} aria-pressed={i === depth} onClick={() => setDepth(i)}>
                {label}
              </button>
            ))}
          </nav>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
