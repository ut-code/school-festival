export function objectiveFunction(x: number, y: number) {
  return 0.002 * ((x - 200) ** 2 + (y - 100) ** 2);
}
