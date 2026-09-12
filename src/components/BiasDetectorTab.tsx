import { useMemo, useState } from 'react'
import { simulateHands } from '../lib/baccarat'
import {
  calculatePositionBuckets,
  calculateStatistics,
  generateBiasSample,
} from '../lib/statistics'
import type { HandRecord } from '../types'
import StatCard from './StatCard'

const SAMPLE_SIZE = 500

export default function BiasDetectorTab() {
  const [text, setText] = useState('')
  const [hands, setHands] = useState<HandRecord[]>([])
  const [injectBias, setInjectBias] = useState(false)

  const stats = useMemo(
    () => calculateStatistics(hands),
    [hands],
  )

  const positions = useMemo(
    () => calculatePositionBuckets(hands, 10),
    [hands],
  )

  function simulate() {
    const sample = simulateHands(SAMPLE_SIZE)

    const finalSample = injectBias
      ? generateBiasSample(sample, 3)
      : sample

    setHands(finalSample)
  }

  function parseText() {
    const tokens = text
      .toUpperCase()
      .replace(/[^PBT]/g, '')
      .split('')

    const parsed: HandRecord[] = tokens.map(
      (outcome, index) => ({
        handNumber: index + 1,
        outcome: outcome as 'P' | 'B' | 'T',
        playerTotal: 0,
        bankerTotal: 0,
        dragon7: false,
      }),
    )

    setHands(parsed)
  }

  const pValueFlag = stats.chiSquarePValue < 0.05
  const dragonFlag = stats.dragon7Pct > 3.5

  return (
    <section>
      <div className="section-heading">
        <div>
          <div className="eyebrow">TAB 3</div>
          <h2>Bias Detector</h2>
          <p>
            Examine recorded outcomes for statistical deviations
            from your selected baseline.
          </p>
        </div>
      </div>

      <div className="warning-panel">
        <strong>Important</strong>
        <span>
          A statistical flag is an investigation signal, not proof
          that a casino, shuffler, dealer, or AI system manipulated
          the game.
        </span>
      </div>

      <div className="control-card">
        <label htmlFor="history">
          Paste recorded outcomes
        </label>

        <textarea
          id="history"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Example: PPBBPBTBP..."
          rows={5}
        />

        <div className="button-row">
          <button
            className="primary-button"
            onClick={parseText}
          >
            Analyze Recorded Hands
          </button>

          <button
            className="secondary-button"
            onClick={simulate}
          >
            Simulate 500 Hands
          </button>
        </div>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={injectBias}
            onChange={(event) =>
              setInjectBias(event.target.checked)
            }
          />
          <span>
            Inject 3% streak-break bias
            <small>Educational simulation only</small>
          </span>
        </label>
      </div>

      {hands.length > 0 && (
        <>
          <div className="stats-grid">
            <StatCard
              label="Sample"
              value={stats.total.toString()}
              detail="hands"
            />

            <StatCard
              label="Player"
              value={`${stats.playerPct.toFixed(2)}%`}
              detail={`${stats.player} hands`}
            />

            <StatCard
              label="Banker"
              value={`${stats.bankerPct.toFixed(2)}%`}
              detail={`${stats.banker} hands`}
            />

            <StatCard
              label="Tie"
              value={`${stats.tiePct.toFixed(2)}%`}
              detail={`${stats.ties} hands`}
            />

            <StatCard
              label="Dragon 7"
              value={`${stats.dragon7Pct.toFixed(2)}%`}
              detail={`${stats.dragon7} observed`}
            />

            <StatCard
              label="Average Streak"
              value={stats.avgStreak.toFixed(2)}
            />
          </div>

          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>Chi-square B/P/T</h3>

              <div className={pValueFlag ? 'flag red' : 'flag green'}>
                {pValueFlag
                  ? 'STATISTICAL FLAG'
                  : 'NO FLAG'}
              </div>

              <p>
                χ² = {stats.chiSquare.toFixed(3)}
              </p>

              <p>
                Approximate p-value ={' '}
                {stats.chiSquarePValue.toFixed(4)}
              </p>

              <small>
                This test compares the observed B/P/T counts with
                an equal-frequency baseline. A different baseline
                should be used if your research question requires
                actual baccarat probabilities.
              </small>
            </div>

            <div className="analysis-card">
              <h3>Dragon 7</h3>

              <div className={dragonFlag ? 'flag red' : 'flag green'}>
                {dragonFlag
                  ? 'ABOVE THRESHOLD'
                  : 'WITHIN SCREENING RANGE'}
              </div>

              <p>
                Observed: {stats.dragon7Pct.toFixed(2)}%
              </p>

              <small>
                This is a screening threshold, not a definitive
                fairness test.
              </small>
            </div>

            <div className="analysis-card">
              <h3>Runs</h3>

              <p>
                Average streak:{' '}
                <strong>
                  {stats.avgStreak.toFixed(2)}
                </strong>
              </p>

              <p>
                Longest streak:{' '}
                <strong>
                  {stats.longestStreak}
                </strong>
              </p>

              <small>
                Runs should be compared against simulations of the
                same game model rather than treated as evidence by
                themselves.
              </small>
            </div>
          </div>

          <div className="road-card">
            <h3>Transitions</h3>

            <div className="transition-grid">
              {[
                'PP',
                'PB',
                'BP',
                'BB',
                'PT',
                'BT',
                'TP',
                'TB',
                'TT',
              ].map((key) => (
                <div className="transition-cell" key={key}>
                  <strong>{key}</strong>
                  <span>
                    {stats.transitions[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="road-card">
            <h3>Position-in-Sample Analysis</h3>

            <div className="position-table">
              <div className="position-header">
                <span>Position</span>
                <span>P</span>
                <span>B</span>
                <span>T</span>
              </div>

              {positions.map((bucket) => (
                <div
                  className="position-row"
                  key={`${bucket.start}-${bucket.end}`}
                >
                  <span>
                    {bucket.start}-{bucket.end}
                  </span>
                  <span>{bucket.player}</span>
                  <span>{bucket.banker}</span>
                  <span>{bucket.ties}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
