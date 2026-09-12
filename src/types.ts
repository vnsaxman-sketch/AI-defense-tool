export type Outcome = 'P' | 'B' | 'T'

export type BetType =
  | 'flat-banker'
  | 'follow-streak'
  | 'against-streak'
  | 'monkey-chaser'
  | 'raise-loss'

export type Tab = 'simulator' | 'habit' | 'bias'

export interface HandRecord {
  handNumber: number
  outcome: Outcome
  playerTotal: number
  bankerTotal: number
  dragon7: boolean
}

export interface ShoeResult {
  hands: HandRecord[]
  totalHands: number
  player: number
  banker: number
  ties: number
  dragon7: number
}

export interface Statistics {
  total: number
  player: number
  banker: number
  ties: number
  playerPct: number
  bankerPct: number
  tiePct: number
  dragon7: number
  dragon7Pct: number
  avgStreak: number
  longestStreak: number
  chiSquare: number
  chiSquarePValue: number
  transitions: Record<string, number>
}

export interface HabitResult {
  bankroll: number
  profit: number
  wagered: number
  bets: number
  wins: number
  losses: number
  pushes: number
  maxDrawdown: number
  returnPct: number
}

export interface PositionBucket {
  start: number
  end: number
  total: number
  player: number
  banker: number
  ties: number
}
