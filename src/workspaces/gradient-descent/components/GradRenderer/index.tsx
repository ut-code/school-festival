import { useEffect, useRef } from "react";
import { Box, Button, Icon } from "@chakra-ui/react";
import { BsCameraReels } from "react-icons/bs";
import { GradGraph } from "./graph";

const width = 350;
const height = 350;

export function GradRenderer(props: {
  x: number;
  y: number;
  xAnswer: number;
  yAnswer: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<GradGraph>();
  const reqIdRef = useRef<number>();

  useEffect(() => {
    const graph = new GradGraph({
      xAnswer: props.xAnswer,
      yAnswer: props.yAnswer,
      width,
      height,
      canvas: canvasRef.current as HTMLCanvasElement,
    });
    graphRef.current = graph;
  }, [props.xAnswer, props.yAnswer]);

  useEffect(() => {
    if (!canvasRef) throw new Error("invarient error");
    function tick() {
      graphRef.current?.controlsUpdate();
      graphRef.current?.update(props.x, props.y, props.xAnswer, props.yAnswer);
      graphRef.current?.render();
      reqIdRef.current = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }
    };
  }, [props.x, props.y, props.xAnswer, props.yAnswer]);

  return (
    <>
      <Box mb={3}>
        <canvas ref={canvasRef} />
      </Box>
      <Button
        leftIcon={<Icon as={BsCameraReels} />}
        onClick={() => {
          graphRef.current?.resetCamera();
        }}
      >
        カメラの位置をリセットする
      </Button>
    </>
  );
}
