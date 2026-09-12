import type {
  HandRecord,
  Outcome,
  PositionBucket,
  Statistics,
} from '../types'

const outcomes: Outcome[] = ['P', 'B', 'T']

function chiSquarePValueApprox(
  statistic: number,
  degreesOfFreedom: number,
): number {
  if (degreesOfFreedom !== 2) {
    return Math.exp(-statistic / 2)
  }

  return Math.exp(-statistic / 2)
}

export function calculateChiSquare(
  hands: HandRecord[],
): { statistic: number; pValue: number } {
  if (hands.length === 0) {
    return { statistic: 0, pValue: 1 }
  }

  const counts = outcomes.map(
    (outcome) => hands.filter((h) => h.outcome === outcome).length,
  )

  const expected = hands.length / 3

  const statistic = counts.reduce(
    (sum, observed) =>
      sum + ((observed - expected) ** 2) / expected,
    0,
  )

  return {
    statistic,
    pValue: chiSquarePValueApprox(statistic, 2),
  }
}

function calculateStreaks(hands: HandRecord[]) {
  if (hands.length === 0) {
    return {
      average: 0,
      longest: 0,
    }
  }

  const streaks: number[] = []
  let current = 1

  for (let i = 1; i < hands.length; i += 1) {
    if (hands[i].outcome === hands[i - 1].outcome) {
      current += 1
    } else {
      streaks.push(current)
      current = 1
    }
  }

  streaks.push(current)

  return {
    average:
      streaks.reduce((sum, value) => sum + value, 0) /
      streaks.length,
    longest: Math.max(...streaks),
  }
}

export function calculateStatistics(hands: HandRecord[]): Statistics {
  const total = hands.length

  const player = hands.filter((h) => h.outcome === 'P').length
  const banker = hands.filter((h) => h.outcome === 'B').length
  const ties = hands.filter((h) => h.outcome === 'T').length

  const dragon7 = hands.filter((h) => h.dragon7).length

  const streaks = calculateStreaks(hands)
  const chi = calculateChiSquare(hands)

  const transitions: Record<string, number> = {}

  for (let i = 1; i < hands.length; i += 1) {
    const key = `${hands[i - 1].outcome}${hands[i].outcome}`
    transitions[key] = (transitions[key] ?? 0) + 1
  }

  return {
    total,
    player,
    banker,
    ties,
    playerPct: total ? (player / total) * 100 : 0,
    bankerPct: total ? (banker / total) * 100 : 0,
    tiePct: total ? (ties / total) * 100 : 0,
    dragon7,
    dragon7Pct: total ? (dragon7 / total) * 100 : 0,
    avgStreak: streaks.average,
    longestStreak: streaks.longest,
    chiSquare: chi.statistic,
    chiSquarePValue: chi.pValue,
    transitions,
  }
}

export function calculatePositionBuckets(
  hands: HandRecord[],
  bucketSize = 10,
): PositionBucket[] {
  const maxPosition = Math.max(
    ...hands.map((hand) => hand.handNumber),
    0,
  )

  const buckets: PositionBucket[] = []

  for (let start = 1; start <= maxPosition; start += bucketSize) {
    const end = start + bucketSize - 1

    const group = hands.filter(
      (hand) =>
        hand.handNumber >= start &&
        hand.handNumber <= end,
    )

    if (group.length === 0) continue

    buckets.push({
      start,
      end,
      total: group.length,
      player: group.filter((h) => h.outcome === 'P').length,
      banker: group.filter((h) => h.outcome === 'B').length,
      ties: group.filter((h) => h.outcome === 'T').length,
    })
  }

  return buckets
}

export function generateBiasSample(
  hands: HandRecord[],
  biasPercent = 3,
): HandRecord[] {
  if (hands.length < 2) return hands

  const result = hands.map((hand) => ({ ...hand }))
  const probability = biasPercent / 100

  for (let i = 1; i < result.length; i += 1) {
    if (Math.random() < probability) {
      const previous = result[i - 1].outcome

      if (result[i].outcome === previous) {
        continue
      }

      const alternative: Outcome =
        previous === 'P' ? 'B' : 'P'

      result[i] = {
        ...result[i],
        outcome: alternative,
      }
    }
  }

  return result
}
