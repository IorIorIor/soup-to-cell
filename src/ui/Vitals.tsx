import { useSim } from '../sim/store'

/** Live numbers from the chapter model, if it reports any. */
export function Vitals() {
  const model = useSim((s) => s.model)
  const state = useSim((s) => s.state)
  const env = useSim((s) => s.env)
  const vitals = model.vitals?.(state, env)
  if (!vitals?.length) return null
  return (
    <dl className="vitals glass" aria-live="off">
      {vitals.map((v) => (
        <div key={v.label}>
          <dt>{v.label}</dt>
          <dd>{v.value}</dd>
        </div>
      ))}
    </dl>
  )
}
