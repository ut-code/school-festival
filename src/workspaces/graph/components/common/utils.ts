import { type Node } from "./types";

export function distanceToLeaf(node: Node | null): number {
  if (!node) {
    return 0;
  }
  const leftHeight = distanceToLeaf(node.leftChild);
  const rightHeight = distanceToLeaf(node.rightChild);
  return Math.max(leftHeight, rightHeight) + 1;
}

export function distanceToRoot(node: Node | null): number {
  if (!node) {
    return 0;
  }
  const height = distanceToRoot(node.parent);
  return height + 1;
}

export function numberOfNodes(node: Node | null): number {
  if (!node) {
    return 0;
  }
  const leftHeight = numberOfNodes(node.leftChild);
  const rightHeight = numberOfNodes(node.rightChild);
  return leftHeight + rightHeight + 1;
}

export function initializeNode(props: { node: Node | null }) {
  const { node } = props;
  if (!node) {
    return;
  }
  node.visited = false;
  initializeNode({ node: node.leftChild });
  initializeNode({ node: node.rightChild });
}

export function allNodeIsVisited(props: { node: Node | null }): boolean {
  const { node } = props;
  if (!node) {
    return true;
  }
  return (
    node.visited &&
    allNodeIsVisited({ node: node.leftChild }) &&
    allNodeIsVisited({ node: node.rightChild })
  );
}
