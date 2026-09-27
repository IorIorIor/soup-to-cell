import { useState } from 'react'
import { cards } from '../content'
import { currentChapter, simStore, useSim } from '../sim/store'

/** Keyboard and screen-reader route to every tappable object in the scene. */
export function ObjectsList() {
  const objects = useSim((s) => currentChapter(s).objects)
  const selection = useSim((s) => s.selection)
  const [open, setOpen] = useState(false)

  return (
    <div className="objects">
      <button className="pill glass" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="objects-list">
        Objects in this scene
      </button>
      {open && (
        <ul id="objects-list" className="objects-list glass">
          {objects.map((id) => (
            <li key={id}>
              <button aria-pressed={selection === id} onClick={() => simStore.getState().select(id)}>
                {cards[id].name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
