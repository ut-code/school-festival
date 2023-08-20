import React, { createContext, useContext, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { DrawArrow } from "../common/DrawArrow";
import { DrawCircle } from "../common/DrawCircle";
import { distanceToRoot } from "../common/utils";

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
  current: boolean;
};

type TreeProps = {
  node: Node | null;
};

type TreeRendererProps = {
  rootNode: Node;
  coordinateX: number;
  coordinateY: number;
};

type TreeContextType = {
  rootNode: Node | null;
};

const defaultTreeContext: TreeContextType = {
  rootNode: null,
};

export const TreeContext = createContext<TreeContextType>(defaultTreeContext);

function RecursiveTree(props: TreeProps) {
  const { rootNode } = useContext(TreeContext);
  const { node } = props;
  if (!node || !rootNode) {
    return <Box />;
  }
  const absoluteX = node.coordinate?.absoluteX || 0;
  const absoluteY = node.coordinate?.absoluteY || 0;
  const parentAbsoluteX = node.parent?.coordinate?.absoluteX;
  const parentAbsoluteY = node.parent?.coordinate?.absoluteY;
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

  let color;
  if (node.visited) {
    color = "lightblue";
  } else if (node.current) {
    color = "orange";
  } else {
    color = "white";
  }

  return (
    <Box>
      {node && parentAbsoluteX && parentAbsoluteY && (
        <DrawArrow
          sourceX={absoluteX}
          sourceY={absoluteY}
          destinationX={parentAbsoluteX}
          destinationY={parentAbsoluteY}
        />
      )}
      {node && (
        <DrawCircle
          color={color}
          value={node.value}
          absoluteY={absoluteY}
          absoluteX={absoluteX}
        />
      )}

      {node.leftChild && (
        <RecursiveTree
          key={`${node.id}${node.visited}`}
          node={node.leftChild}
        />
      )}
      {node.rightChild && (
        <RecursiveTree
          key={`${node.id}${node.visited}`}
          node={node.rightChild}
        />
      )}
    </Box>
  );
}

export function TreeRenderer(props: TreeRendererProps) {
  const { rootNode, coordinateX, coordinateY } = props;
  const contextValue = useMemo(() => {
    return {
      rootNode: props.rootNode,
    };
  }, [props.rootNode]);

  rootNode.coordinate = {
    absoluteX: coordinateX + 200,
    absoluteY: coordinateY + 200,
  };

  return (
    <TreeContext.Provider value={contextValue}>
      <RecursiveTree key={`${props.rootNode.visited}`} node={props.rootNode} />
    </TreeContext.Provider>
  );
}
