import React from "react";

type DrawArrowProps = {
  sourceX: number;
  sourceY: number;
  destinationX: number;
  destinationY: number;
};

export function DrawArrow({
  sourceX,
  sourceY,
  destinationX,
  destinationY,
}: DrawArrowProps) {
  const deltaX = destinationX - sourceX;
  const deltaY = destinationY - sourceY;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  const styles = {
    line: {
      position: "absolute" as const,
      top: sourceY,
      left: sourceX,
      height: "1px",
      width: `${length}px`,
      backgroundColor: "black",
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0% 0%",
      zIndex: 1,
    },
    arrow: {
      position: "absolute" as const,
      top: destinationY - 5, // 5px is half the height of the arrow
      left: destinationX,
      width: "10px",
      height: "10px",
      clipPath: "polygon(100% 50%, 0% 0%, 0% 100%)",
      backgroundColor: "black",
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0% 50%",
      zIndex: 1,
    },
  };

  return (
    <>
      <div style={styles.line} />
      <div style={styles.arrow} />
    </>
  );
}
