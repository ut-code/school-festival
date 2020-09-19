export function randInt(maxExcluded: number, minIncluded = 0) {
  return Math.floor(Math.random() * (maxExcluded - minIncluded) + minIncluded);
}
