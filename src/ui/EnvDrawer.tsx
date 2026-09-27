import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { currentChapter, simStore, useSim } from '../sim/store'

/** Environment sliders, only the ones this chapter declares. */
export function EnvDrawer() {
  const sliders = useSim((s) => currentChapter(s).sliders)
  const env = useSim((s) => s.env)
  const [open, setOpen] = useState(false)
  if (sliders.length === 0) return null

  return (
    <div className="env">
      <button className="pill glass" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="env-panel">
        Environment
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="env-panel"
            className="env-panel glass"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {sliders.map((s) => (
              <label key={s.id} className="slider">
                <span>
                  {s.label}
                  <output>
                    {Number.isInteger(s.step) ? env[s.id] : Math.round(env[s.id] * 100) + '%'}
                    {Number.isInteger(s.step) ? s.unit : ''}
                  </output>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={env[s.id]}
                  onChange={(e) => simStore.getState().setEnv(s.id, Number(e.target.value))}
                />
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
