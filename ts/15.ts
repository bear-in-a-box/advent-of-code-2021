import { promises as fs } from 'fs';

type Node = {
  risk: number;
  ways: Node[];
  visited: boolean;
  distance: number;
  coords: [number, number];
};

const getNeighborsCoords = (n: number, x: number, y: number) =>
  [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ].filter(
    ([cx, cy]) =>
      !(cx === 0 && cy === 0) && cx > -1 && cy > -1 && cx < n && cy < n
  );

(async () => {
  const input = (await fs.readFile('../inputs/15.txt')).toString();
  const lines = input.split('\n');
  const n = lines.length;
  const nodes: Node[][] = lines.map((line, y) =>
    line.split('').map<Node>((v, x) => ({
      distance: x === 0 && y === 0 ? 0 : Infinity,
      visited: false,
      ways: [],
      risk: +v,
      coords: [x, y],
    }))
  );
  const startNode = nodes[0][0];
  const endNode = nodes[n - 1][n - 1];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const node = nodes[y][x];
      if (node === endNode) {
        continue;
      }
      const neighbors = getNeighborsCoords(n, x, y).map(
        ([nx, ny]) => nodes[ny][nx]
      );
      node.ways.push(...neighbors);
    }
  }
  function go(node: Node) {
    node.visited = true;

    for (const neighbor of node.ways) {
      if (neighbor.visited) {
        continue;
      }
      const distanceCandidate = node.distance + neighbor.risk;
      if (distanceCandidate > endNode.distance) {
        continue;
      }
      if (distanceCandidate < neighbor.distance) {
        neighbor.distance = distanceCandidate;
        go(neighbor);
      }
    }

    node.visited = false;
  }
  go(startNode);
  console.log(endNode.distance);
})();
