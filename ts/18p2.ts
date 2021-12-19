import { promises as fs } from 'fs';
import assert from 'assert/strict';
import { inspect } from 'util';

type Node = { depth: number; parent?: ParentNode };
type SingleNode = Node & { value: number };
type ParentNode = Node & { children: Node[] };

function isSingle(node: Node): node is SingleNode {
  return 'value' in node;
}

function isParent(node: Node): node is ParentNode {
  return 'children' in node;
}

function parseNode(
  input: (number | number[])[],
  depth: number = 0,
  parent?: ParentNode
): Node {
  const root: ParentNode = { depth, children: [], parent };
  for (const candidate of input) {
    if (typeof candidate === 'number') {
      const value: SingleNode = {
        depth: depth + 1,
        value: candidate,
        parent: root,
      };
      root.children.push(value);
    } else {
      root.children.push(parseNode(candidate, depth + 1, root));
    }
  }
  return root;
}

function findIndexInParent(node: Readonly<Node>) {
  return node.parent?.children.indexOf(node);
}

enum DiveType {
  Left,
  Right,
}
function dive(
  start: Readonly<ParentNode>,
  type: DiveType
): SingleNode | undefined {
  let node: Readonly<ParentNode> = start;
  while (isParent(node)) {
    const c = node.children[type === DiveType.Right ? 1 : 0];
    if (isSingle(c)) return c;
    if (isParent(c)) node = c;
  }
}

function findExplodeLeftCandidate(
  start: Readonly<Node>
): SingleNode | undefined {
  let node: Node | undefined = start;
  do {
    const index = findIndexInParent(node);
    if (index === undefined) {
      return;
    }
    const canGoLeft = index > 0;
    const siblings = node.parent!.children;
    if (canGoLeft) {
      const c = siblings[0];
      if (isSingle(c)) return c;
      if (isParent(c)) return dive(c, DiveType.Right);
      return;
    }
  } while ((node = node.parent));
}
function findExplodeRightCandidate(
  start: Readonly<Node>
): SingleNode | undefined {
  let node: Node | undefined = start;
  do {
    const index = findIndexInParent(node);
    if (index === undefined) {
      return;
    }
    const siblings = node.parent!.children;
    const canGoRight = index < siblings.length - 1;
    if (canGoRight) {
      const c = siblings[1];
      if (isSingle(c)) return c;
      if (isParent(c)) return dive(c, DiveType.Left);
      return;
    }
  } while ((node = node.parent));
}

function findNodeToExplode(node: Readonly<Node>): ParentNode | undefined {
  if (isSingle(node)) {
    return;
  }
  if (isParent(node)) {
    if (node.depth === 4 && node.children.every((c) => isSingle(c))) {
      return node;
    }
    for (const child of node.children) {
      const candidate = findNodeToExplode(child);
      if (candidate) {
        return candidate;
      }
    }
  }
}

function explode(node: ParentNode): void {
  const whereIsTheNode = findIndexInParent(node);
  if (whereIsTheNode === undefined) {
    return;
  }
  const singleNode: SingleNode = {
    depth: node.depth,
    value: 0,
    parent: node.parent,
  };

  let leftCandidate: SingleNode | undefined;
  let rightCandidate: SingleNode | undefined;
  let n: Node | undefined = node;
  do {
    const index = findIndexInParent(n);
    if (index === undefined) {
      break;
    }
    if (!leftCandidate) leftCandidate = findExplodeLeftCandidate(n);
    if (!rightCandidate) rightCandidate = findExplodeRightCandidate(n);
    if (leftCandidate && rightCandidate) {
      break;
    }
  } while ((n = n.parent));
  node.parent!.children[whereIsTheNode] = singleNode;
  const children = node.children as [SingleNode, SingleNode];
  if (leftCandidate) {
    const [{ value }] = children;
    leftCandidate.value += value;
  }
  if (rightCandidate) {
    const [, { value }] = children;
    rightCandidate.value += value;
  }
}

function findNodeToSplit(node: Readonly<Node>): SingleNode | undefined {
  if (isSingle(node) && node.value >= 10) {
    return node;
  }
  if (isParent(node)) {
    for (const child of node.children) {
      const candidate = findNodeToSplit(child);
      if (candidate) {
        return candidate;
      }
    }
  }
}

function split(node: SingleNode): void {
  const index = findIndexInParent(node);
  if (index === undefined) {
    console.log(node);
    return;
  }
  const { value, depth, parent } = node;
  const left = Math.floor(value / 2);
  const leftNode: SingleNode = { depth: depth + 1, value: left };
  const rightNode: SingleNode = { depth: depth + 1, value: value - left };
  const newNode: ParentNode = {
    depth,
    parent,
    children: [leftNode, rightNode],
  };
  leftNode.parent = newNode;
  rightNode.parent = newNode;
  node.parent!.children[index] = newNode;
}

function updateDepths(node: Node, depth: number = 0) {
  node.depth = depth;
  if (isParent(node)) {
    for (const child of node.children) {
      updateDepths(child, depth + 1);
    }
  }
}

function add(a: ParentNode, b: ParentNode): ParentNode {
  assert.equal(a?.depth, b?.depth);
  const joined: ParentNode = {
    depth: a.depth,
    children: [a, b],
    parent: a.parent,
  };
  a.parent = joined;
  b.parent = joined;
  updateDepths(joined);
  let lastResult = serializeNode(joined);
  // console.log('start  ', lastResult);
  while (true) {
    let toExplode: ParentNode | undefined;
    if ((toExplode = findNodeToExplode(joined))) {
      explode(toExplode);
      const serialized = serializeNode(joined);
      // console.log('explode', serialized);
      assert.notStrictEqual(
        lastResult,
        serialized,
        'Nothing changed after explode'
      );
      lastResult = serialized;
    }

    let toSplit: SingleNode | undefined;
    if (!toExplode && (toSplit = findNodeToSplit(joined))) {
      split(toSplit);
      const serialized = serializeNode(joined);
      // console.log('split  ', serialized);
      assert.notStrictEqual(
        lastResult,
        serialized,
        'Nothing changed after split'
      );
      lastResult = serialized;
    }

    if (!toExplode && !toSplit) {
      break;
    }
  }

  return joined;
}

function getMagnitude(node: Readonly<Node>): number {
  if (isSingle(node)) {
    return node.value;
  }
  if (isParent(node)) {
    const [a, b] = node.children;
    return 3 * getMagnitude(a) + 2 * getMagnitude(b);
  }
  return 0;
}

function serializeNode(node: Readonly<Node>, depth: number = 0): string {
  assert(isSingle(node) || isParent(node));
  try {
    assert.equal(node.depth, depth);
  } catch {
    console.log(inspect(node, { depth: 1 }));
    process.exit(1);
  }
  if (isSingle(node)) {
    return node.value.toString();
  } else if (isParent(node)) {
    return `[${node.children
      .map((c) => serializeNode(c, depth + 1))
      .join(',')}]`;
  } else {
    return '';
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/18.txt')).toString();
  const lines = input.split('\n').map((line) => JSON.parse(line));
  let maxMagnitude = 0;
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines.length; j++) {
      if (i === j) {
        continue;
      }
      const magnitude = getMagnitude(
        add(
          parseNode(lines[i]) as ParentNode,
          parseNode(lines[j]) as ParentNode
        )
      );
      if (magnitude > maxMagnitude) {
        maxMagnitude = magnitude;
      }
    }
  }
  console.log('Result max magnitude:', maxMagnitude);
})();
