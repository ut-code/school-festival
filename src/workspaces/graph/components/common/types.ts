export type Coordinate = {
  absoluteX: number;
  absoluteY: number;
};

export type Node = {
  id: string;
  value: string;
  parent: Node | null;
  leftChild: Node | null;
  rightChild: Node | null;
  coordinate?: Coordinate;
  visited: boolean;
  current: boolean;
};
