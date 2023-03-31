import { AspectRatio, Box, Grid, chakra } from "@chakra-ui/react";
import { Fragment } from "react";

export type CellularAutomatonWorkspaceWorldRendererProps = {
  cells: boolean[][];
  onCellClicked?(position: { x: number; y: number }): void;
};

export function CellularAutomatonWorkspaceWorldRenderer(
  props: CellularAutomatonWorkspaceWorldRendererProps
): JSX.Element {
  return (
    <AspectRatio ratio={1}>
      <Box>
        <Grid
          width="100%"
          height="100%"
          templateColumns="repeat(30, 1fr)"
          autoRows="1fr"
        >
          {props.cells.map((row, y) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={y}>
              {row.map((cell, x) => (
                <chakra.button
                  // eslint-disable-next-line react/no-array-index-key
                  key={x}
                  bgColor={cell ? "gray.800" : "white"}
                  _hover={props.onCellClicked && { filter: "invert(0.2)" }}
                  onClick={() => {
                    props.onCellClicked?.({ x, y });
                  }}
                />
              ))}
            </Fragment>
          ))}
        </Grid>
      </Box>
    </AspectRatio>
  );
}
