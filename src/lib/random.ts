export function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

export function fisherYates<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}
