import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSim } from '../sim/store'

const SHOW_MS = 4500

/** One-line consequence caption for the latest edit. Real text, announced politely. */
export function Caption() {
  const caption = useSim((s) => s.caption)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!caption) return setVisible(false)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), SHOW_MS)
    return () => clearTimeout(t)
  }, [caption])

  return (
    <div className="caption-slot" aria-live="polite">
      <AnimatePresence mode="wait">
        {visible && caption && (
          <motion.p
            key={caption.seq}
            className="caption glass"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {caption.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
