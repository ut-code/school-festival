import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import { DrawArrow } from "./DrawArrow";
import { DrawCircle } from "./DrawCircle";
import { distanceToRoot } from "./utils";
import { TreeContext } from "../TreeRenderer";

const X_DISTANCE = 160;
const Y_DISTANCE = 70;

type Coordinate = {
  absoluteX: number;
  absoluteY: number;
};

type Node = {
  id: string;
  value: string;
  parent: Node | null;
  leftChild: Node | null;
  rightChild: Node | null;
  coordinate?: Coordinate;
  visited: boolean;
};

type TreeProps = {
  node: Node | null;
};

export function RecursiveTree(props: TreeProps) {
  const { rootNode } = useContext(TreeContext);
  const { node } = props;
  if (!node || !rootNode) {
    return <Box />;
  }
  const absoluteX = node.coordinate?.absoluteX || 700;
  const absoluteY = node.coordinate?.absoluteY || 250;
  const parentAbsoluteX = node.parent?.coordinate?.absoluteX || 700;
  const parentAbsoluteY = node.parent?.coordinate?.absoluteY || 250;
  const depth = distanceToRoot(node);

  if (node.leftChild) {
    node.leftChild.coordinate = {
      absoluteX: absoluteX - X_DISTANCE / 2 ** depth,
      absoluteY: absoluteY + Y_DISTANCE,
    };
  }

  if (node.rightChild) {
    node.rightChild.coordinate = {
      absoluteX: absoluteX + X_DISTANCE / 2 ** depth,
      absoluteY: absoluteY + Y_DISTANCE,
    };
  }

  return (
    <Box>
      <Box>{rootNode.value + rootNode.id}</Box>
      <DrawArrow
        sourceX={absoluteX}
        sourceY={absoluteY}
        destinationX={parentAbsoluteX}
        destinationY={parentAbsoluteY}
      />
      <DrawCircle
        color={node.visited ? "blue" : "black"}
        value={node.value + depth}
        absoluteY={absoluteY}
        absoluteX={absoluteX}
      />

      {/* {node.leftChild && <RecursiveTree node={node.leftChild} />} */}
      {/* {node.rightChild && <RecursiveTree node={node.rightChild} />} */}
    </Box>
  );
}
