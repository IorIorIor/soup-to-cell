import { AnimatePresence, motion } from 'framer-motion'
import { useSim } from '../sim/store'
import { goToChapter } from './routing'

export function ChapterMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const chapters = useSim((s) => s.chapters)
  const current = useSim((s) => s.chapterIndex)

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          className="chapter-menu glass"
          aria-label="Chapters"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <header>
            <h2>Chapters</h2>
            <button className="icon-btn" onClick={onClose} aria-label="Close chapters">
              ✕
            </button>
          </header>
          <ol>
            {chapters.map((ch, i) => (
              <li key={ch.id}>
                <button
                  aria-current={i === current ? 'step' : undefined}
                  onClick={() => {
                    goToChapter(i)
                    onClose()
                  }}
                >
                  <span className="num">{ch.number}</span>
                  <span>
                    <strong>{ch.title}</strong>
                    <small>{ch.tagline}</small>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
