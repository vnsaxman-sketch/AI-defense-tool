import type {
  BetType,
  HandRecord,
  HabitResult,
  Outcome,
} from '../types'

function resolvesBet(
  bet: 'B' | 'P',
  outcome: Outcome,
): 'win' | 'loss' | 'push' {
  if (outcome === 'T') return 'push'
  return bet === outcome ? 'win' : 'loss'
}

function chooseBet(
  hands: HandRecord[],
  index: number,
  type: BetType,
): 'B' | 'P' {
  if (type === 'flat-banker') {
    return 'B'
  }

  const previous = hands[index - 1]?.outcome

  if (!previous || previous === 'T') {
    return 'B'
  }

  if (type === 'follow-streak') {
    return previous
  }

  if (type === 'against-streak') {
    return previous === 'B' ? 'P' : 'B'
  }

  if (type === 'monkey-chaser') {
    const lastTwo = hands
      .slice(Math.max(0, index - 2), index)
      .map((h) => h.outcome)
      .filter((x): x is 'B' | 'P' => x !== 'T')

    if (
      lastTwo.length === 2 &&
      lastTwo[0] === lastTwo[1]
    ) {
      return lastTwo[0] === 'B' ? 'P' : 'B'
    }

    return previous
  }

  return previous
}

export function runHabitSimulation(
  hands: HandRecord[],
  type: BetType,
  startingBankroll = 5000,
): HabitResult {
  let bankroll = startingBankroll
  let peak = startingBankroll
  let maxDrawdown = 0
  let wagered = 0
  let bets = 0
  let wins = 0
  let losses = 0
  let pushes = 0

  let currentBet = 25

  for (let i = 1; i < hands.length; i += 1) {
    if (bankroll < currentBet) break

    const bet = chooseBet(hands, i, type)

    bankroll -= currentBet
    wagered += currentBet
    bets += 1

    const result = resolvesBet(bet, hands[i].outcome)

    if (result === 'win') {
      const payout = bet === 'B'
        ? currentBet * 0.95
        : currentBet

      bankroll += currentBet + payout
      wins += 1

      currentBet = 25
    } else if (result === 'push') {
      bankroll += currentBet
      pushes += 1
    } else {
      losses += 1

      if (type === 'raise-loss') {
        currentBet = Math.min(currentBet * 2, 500)
      } else {
        currentBet = 25
      }
    }

    peak = Math.max(peak, bankroll)
    maxDrawdown = Math.max(
      maxDrawdown,
      peak - bankroll,
    )
  }

  return {
    bankroll,
    profit: bankroll - startingBankroll,
    wagered,
    bets,
    wins,
    losses,
    pushes,
    maxDrawdown,
    returnPct:
      wagered > 0
        ? ((bankroll - startingBankroll) / wagered) * 100
        : 0,
  }
}
