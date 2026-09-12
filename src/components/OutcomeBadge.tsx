import type { Outcome } from '../types'

export default function OutcomeBadge({
  outcome,
}: {
  outcome: Outcome
}) {
  return (
    <span className={`outcome outcome-${outcome}`}>
      {outcome === 'P'
        ? 'PLAYER'
        : outcome === 'B'
          ? 'BANKER'
          : 'TIE'}
    </span>
  )
}
