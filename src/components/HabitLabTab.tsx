import { useState } from 'react'
import { simulateHands } from '../lib/baccarat'
import { runHabitSimulation } from '../lib/habits'
import type { BetType, HabitResult } from '../types'
import StatCard from './StatCard'

const habits: { value: BetType; label: string }[] = [
  {
    value: 'flat-banker',
    label: 'Flat Banker',
  },
  {
    value: 'follow-streak',
    label: 'Follow Streak',
  },
  {
    value: 'against-streak',
    label: 'Against Streak',
  },
  {
    value: 'monkey-chaser',
    label: 'Monkey Chaser',
  },
  {
    value: 'raise-loss',
    label: 'Raise on Loss',
  },
]

export default function HabitLabTab() {
  const [habit, setHabit] = useState<BetType>('follow-streak')
  const [result, setResult] = useState<HabitResult | null>(null)
  const [running, setRunning] = useState(false)

  function runSimulation() {
    setRunning(true)

    window.setTimeout(() => {
      const hands = simulateHands(5000)
      const simulation = runHabitSimulation(
        hands,
        habit,
        5000,
      )

      setResult(simulation)
      setRunning(false)
    }, 50)
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <div className="eyebrow">TAB 2</div>
          <h2>My Habit Lab</h2>
          <p>
            Test betting behavior against the same fair simulated
            baccarat population.
	    Bankroll: $5000. Base bet: $25. Raise on Loss start at $25, then doubles after a loss, up to $500
          </p>
        </div>
      </div>

      <div className="control-card">
        <label htmlFor="habit">
          Betting habit
        </label>

        <select
          id="habit"
          value={habit}
          onChange={(event) =>
            setHabit(event.target.value as BetType)
          }
        >
          {habits.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <button
          className="primary-button"
          onClick={runSimulation}
          disabled={running}
        >
          {running ? 'Running...' : 'Run 5,000 Hands'}
        </button>
      </div>

      {result && (
        <>
          <div className="stats-grid">
            <StatCard
              label="Ending Bankroll"
              value={`$${result.bankroll.toFixed(2)}`}
            />
            <StatCard
              label="Profit / Loss"
              value={`$${result.profit.toFixed(2)}`}
            />
            <StatCard
              label="Bets"
              value={result.bets.toString()}
            />
            <StatCard
              label="Wins"
              value={result.wins.toString()}
            />
            <StatCard
              label="Losses"
              value={result.losses.toString()}
            />
            <StatCard
              label="Max Drawdown"
              value={`$${result.maxDrawdown.toFixed(2)}`}
            />
          </div>

          <div className="notice">
            <strong>Interpretation</strong>
            <span>
              A single simulation is noisy. Repeat the experiment
              many times before drawing conclusions about a betting
              habit.
            </span>
          </div>
        </>
      )}

      <div className="info-card">
        <h3>What this experiment can demonstrate</h3>

        <ul>
          <li>
            Betting patterns don't change the underlying fair
            shoe.
          </li>
          <li>
            Increasing bet size increases bankroll volatility.
          </li>
          <li>
            Loss-chasing can dramatically increase drawdown.
          </li>
          <li>
            Short simulations can produce misleading results.
          </li>
        </ul>
      </div>
    </section>
  )
}
