const zMagnification = -0.002;

export const maxHeight = 300;

export function objectiveFunction(
  x: number,
  y: number,
  xAnswer: number,
  yAnswer: number
) {
  return zMagnification * ((x - xAnswer) ** 2 + (y - yAnswer) ** 2) + maxHeight;
}
