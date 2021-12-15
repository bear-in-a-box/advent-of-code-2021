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

const tileShifts = [
  [0, 1, 2, 3, 4],
  [1, 2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [3, 4, 5, 6, 7],
  [4, 5, 6, 7, 8],
];

(async () => {
  const input = (await fs.readFile('../inputs/15.txt')).toString();
  const lines = input.split('\n');
  const tile = lines.map((line) => line.split('').map((v) => +v));
  const n = tile.length * 5;
  const area: number[][] = [...Array(n)].map(() => [...Array(n)]);
  for (let ty = 0; ty < 5; ty++) {
    for (let tx = 0; tx < 5; tx++) {
      for (let y = 0; y < tile.length; y++) {
        for (let x = 0; x < tile.length; x++) {
          const v = tile[y][x] + tileShifts[ty][tx];
          area[y + tile.length * ty][x + tile.length * tx] = v < 10 ? v : v - 9;
        }
      }
    }
  }
  // console.log(area.map((l) => l.map((v) => v ?? '?').join('')).join('\n'));
  // console.log(tile.map((l) => l.join('')).join('\n'));
  const nodes: Node[][] = area.map((line, y) =>
    line.map<Node>((v, x) => ({
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
