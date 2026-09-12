import { useState } from 'react'
import {
  createEightDeckShoe,
  dealBaccaratHand,
} from '../lib/baccarat'
import type { HandRecord } from '../types'
import StatCard from './StatCard'
import OutcomeBadge from './OutcomeBadge'

export default function SimulatorTab() {
  const [shoe, setShoe] = useState(createEightDeckShoe)
  const [hands, setHands] = useState<HandRecord[]>([])
  const [shoeNumber, setShoeNumber] = useState(1)

  function deal() {
    if (shoe.length < 6 || hands.length >= 80) {
      resetShoe()
      return
    }

    const newShoe = [...shoe]

    const hand = dealBaccaratHand(
      newShoe,
      hands.length + 1,
    )

    setShoe(newShoe)
    setHands((current) => [...current, hand])
  }

  function resetShoe() {
    setShoe(createEightDeckShoe())
    setHands([])
    setShoeNumber((value) => value + 1)
  }

  const player = hands.filter((h) => h.outcome === 'P').length
  const banker = hands.filter((h) => h.outcome === 'B').length
  const ties = hands.filter((h) => h.outcome === 'T').length

  return (
    <section>
      <div className="section-heading">
        <div>
          <div className="eyebrow">TAB 1</div>
          <h2>Fair Shuffle Simulator</h2>
          <p>
            Pure Fisher-Yates shuffle using eight standard decks.
            No betting input and no adaptive behavior.
          </p>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={deal}>
            Deal Hand
          </button>

          <button className="secondary-button" onClick={resetShoe}>
            New Shoe
          </button>
        </div>
      </div>

      <div className="notice">
        <strong>Fair-mode baseline</strong>
        <span>
          This simulator deliberately has no AI intervention or
          player tracking. It provides a control population for
          statistical comparisons.
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Shoe"
          value={`#${shoeNumber}`}
          detail={`${shoe.length} cards remaining`}
        />
        <StatCard
          label="Hands"
          value={hands.length.toString()}
        />
        <StatCard
          label="Player"
          value={player.toString()}
        />
        <StatCard
          label="Banker"
          value={banker.toString()}
        />
        <StatCard
          label="Tie"
          value={ties.toString()}
        />
      </div>

      <div className="road-card">
        <h3>Bead Plate</h3>

        <div className="bead-grid">
          {hands.map((hand) => (
            <div
              key={hand.handNumber}
              title={`Hand ${hand.handNumber}`}
            >
              <OutcomeBadge outcome={hand.outcome} />
            </div>
          ))}
        </div>
      </div>

      <div className="road-card">
        <h3>Recent Hands</h3>

        <div className="hand-list">
          {[...hands].reverse().slice(0, 20).map((hand) => (
            <div className="hand-row" key={hand.handNumber}>
              <span>#{hand.handNumber}</span>
              <OutcomeBadge outcome={hand.outcome} />
              <span>
                P {hand.playerTotal} / B {hand.bankerTotal}
              </span>
              {hand.dragon7 && (
                <span className="warning-tag">
                  Dragon 7
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
