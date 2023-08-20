import React, { createContext, useContext, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { DrawArrow } from "../common/DrawArrow";
import { DrawCircle } from "../common/DrawCircle";
import { distanceToRoot } from "../common/utils";
import { type Node } from "../common/types";

const X_DISTANCE = 160;
const Y_DISTANCE = 70;

type TreeProps = {
  node: Node | null;
};

type TreeRendererProps = {
  rootNode: Node;
  coordinateX: number;
  coordinateY: number;
  currentNodeId: string;
};

type TreeContextType = {
  currentNodeId: string;
};

const defaultTreeContext: TreeContextType = {
  currentNodeId: "_",
};

export const TreeContext = createContext<TreeContextType>(defaultTreeContext);

function RecursiveTree(props: TreeProps) {
  const { currentNodeId } = useContext(TreeContext);
  const { node } = props;
  if (!node) {
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
    // color = "lightblue";
    color = "lightblue";
  } else if (node.id === currentNodeId) {
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
  const { rootNode, coordinateX, coordinateY, currentNodeId } = props;
  const contextValue = useMemo(() => {
    return {
      currentNodeId,
    };
  }, [currentNodeId]);

  rootNode.coordinate = {
    absoluteX: coordinateX + 200,
    absoluteY: coordinateY + 170,
  };

  return (
    <TreeContext.Provider value={contextValue}>
      <RecursiveTree key={`${props.rootNode.visited}`} node={props.rootNode} />
    </TreeContext.Provider>
  );
}
