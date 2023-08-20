import { type Node } from "./types";

const Node8: Node = {
  id: "8",
  value: "8",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node7: Node = {
  id: "7",
  value: "7",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node6: Node = {
  id: "6",
  value: "6",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node5: Node = {
  id: "5",
  value: "5",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node4: Node = {
  id: "4",
  value: "4",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node3: Node = {
  id: "3",
  value: "3",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node2: Node = {
  id: "2",
  value: "2",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

const Node1: Node = {
  id: "1",
  value: "1",
  parent: null,
  leftChild: null,
  rightChild: null,
  visited: false,
};

Node2.parent = Node1;
Node3.parent = Node1;
Node4.parent = Node2;
Node5.parent = Node2;
Node6.parent = Node3;
Node7.parent = Node3;
Node8.parent = Node4;

Node1.leftChild = Node2;
Node1.rightChild = Node3;
Node2.leftChild = Node4;
Node2.rightChild = Node5;
Node3.leftChild = Node6;
Node3.rightChild = Node7;
Node4.leftChild = Node8;

export default Node1;
