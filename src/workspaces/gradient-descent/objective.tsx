const zMagnification = 400;

const zBias = 1;

export const maxHeight = zMagnification - zBias;

export function objectiveFunction(
  x: number,
  y: number,
  xAnswer: number,
  yAnswer: number
) {
  // return zMagnification * ((x - xAnswer) ** 2 + (y - yAnswer) ** 2) + maxHeight;
  return (
    zMagnification *
      Math.exp(-0.00001 * ((x - xAnswer) ** 2 + (y - yAnswer) ** 2)) -
    zBias
  );
}
