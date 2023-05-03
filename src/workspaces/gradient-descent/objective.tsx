export function objectiveFunction(
  x: number,
  y: number,
  xAnswer: number,
  yAnswer: number
) {
  const zMagnification = -0.002;
  return zMagnification * ((x - xAnswer) ** 2 + (y - yAnswer) ** 2) + 300;
}
