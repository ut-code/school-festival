export function randInt(maxExcluded: number, minIncluded = 0): number {
  return Math.floor(Math.random() * (maxExcluded - minIncluded) + minIncluded);
}
