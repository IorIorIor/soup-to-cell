import { SPEEDS } from '../sim/clock'
import { currentChapter, simStore, useSim } from '../sim/store'

export function TimeBar() {
  const playing = useSim((s) => s.clock.playing)
  const speed = useSim((s) => s.clock.speed)
  const realDuration = useSim((s) => currentChapter(s).realDuration)
  const { setPlaying, setSpeed } = simStore.getState()

  return (
    <div className="time-bar glass" role="group" aria-label="Simulation time">
      <button
        className="icon-btn"
        onClick={() => setPlaying(!playing)}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className="speeds" role="radiogroup" aria-label="Speed">
        {SPEEDS.map((s) => (
          <button key={s} role="radio" aria-checked={s === speed} className={s === speed ? 'active' : ''} onClick={() => setSpeed(s)}>
            {s}×
          </button>
        ))}
      </div>
      <p className="time-note">Sped up · {realDuration}</p>
    </div>
  )
}
