import { fisherYates } from './random'
import type { HandRecord, Outcome, ShoeResult } from '../types'

export type Card = number

export function createEightDeckShoe(): Card[] {
  const shoe: Card[] = []

  for (let deck = 0; deck < 8; deck += 1) {
    for (let rank = 1; rank <= 13; rank += 1) {
      for (let suit = 0; suit < 4; suit += 1) {
        if (rank >= 10) {
          shoe.push(0)
        } else {
          shoe.push(rank)
        }
      }
    }
  }

  return fisherYates(shoe)
}

function baccaratTotal(cards: Card[]): number {
  return cards.reduce((sum, card) => sum + card, 0) % 10
}

function shouldBankerDraw(
  bankerTotal: number,
  playerThirdCard: number | undefined,
): boolean {
  if (playerThirdCard === undefined) {
    return bankerTotal <= 5
  }

  if (bankerTotal <= 2) return true
  if (bankerTotal === 3) return playerThirdCard !== 8
  if (bankerTotal === 4) return playerThirdCard >= 2 && playerThirdCard <= 7
  if (bankerTotal === 5) return playerThirdCard >= 4 && playerThirdCard <= 7
  if (bankerTotal === 6) return playerThirdCard === 6 || playerThirdCard === 7

  return false
}

export function dealBaccaratHand(
  shoe: Card[],
  handNumber: number,
): HandRecord {
  const playerCards = [shoe.shift()!, shoe.shift()!]
  const bankerCards = [shoe.shift()!, shoe.shift()!]

  let playerTotal = baccaratTotal(playerCards)
  let bankerTotal = baccaratTotal(bankerCards)

  const natural =
    playerTotal >= 8 ||
    bankerTotal >= 8

  let playerThirdCard: number | undefined

  if (!natural) {
    if (playerTotal <= 5) {
      playerThirdCard = shoe.shift()!
      playerCards.push(playerThirdCard)
      playerTotal = baccaratTotal(playerCards)
    }

    if (shouldBankerDraw(bankerTotal, playerThirdCard)) {
      bankerCards.push(shoe.shift()!)
      bankerTotal = baccaratTotal(bankerCards)
    }
  }

  let outcome: Outcome

  if (playerTotal > bankerTotal) {
    outcome = 'P'
  } else if (bankerTotal > playerTotal) {
    outcome = 'B'
  } else {
    outcome = 'T'
  }

  const dragon7 =
    outcome === 'P' &&
    playerTotal === 7 &&
    playerCards.length === 3

  return {
    handNumber,
    outcome,
    playerTotal,
    bankerTotal,
    dragon7,
  }
}

export function simulateShoe(maxHands = 80): ShoeResult {
  const shoe = createEightDeckShoe()
  const hands: HandRecord[] = []

  while (hands.length < maxHands && shoe.length >= 6) {
    hands.push(dealBaccaratHand(shoe, hands.length + 1))
  }

  return summarizeHands(hands)
}

export function simulateHands(
  count: number,
  maxHandsPerShoe = 80,
): HandRecord[] {
  const allHands: HandRecord[] = []
  let shoe = createEightDeckShoe()
  let shoePosition = 0

  while (allHands.length < count) {
    if (shoePosition >= maxHandsPerShoe || shoe.length < 6) {
      shoe = createEightDeckShoe()
      shoePosition = 0
    }

    const hand = dealBaccaratHand(shoe, shoePosition + 1)

    allHands.push({
      ...hand,
      handNumber: allHands.length + 1,
    })

    shoePosition += 1
  }

  return allHands
}

export function summarizeHands(hands: HandRecord[]): ShoeResult {
  const player = hands.filter((h) => h.outcome === 'P').length
  const banker = hands.filter((h) => h.outcome === 'B').length
  const ties = hands.filter((h) => h.outcome === 'T').length
  const dragon7 = hands.filter((h) => h.dragon7).length

  return {
    hands,
    totalHands: hands.length,
    player,
    banker,
    ties,
    dragon7,
  }
}
