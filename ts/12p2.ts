import { promises as fs } from 'fs';

const debug = process.argv.slice(2).includes('debug');

const enum DefinedNode {
  Start = 'start',
  End = 'end',
}

(async () => {
  const input = (await fs.readFile('../inputs/12.txt')).toString();
  const lines = input.split('\n');
  const edges = lines.map((line) => line.split('-'));

  const adjacencies: Record<string, Set<string>> = {};
  const oneTimers = new Set<string>(
    edges.flat().filter((n) => n === n.toLowerCase())
  );
  for (const [from, to] of edges) {
    if (!adjacencies[from]) adjacencies[from] = new Set<string>();
    if (!adjacencies[to]) adjacencies[to] = new Set<string>();
    if (to !== DefinedNode.Start && from !== DefinedNode.End) {
      adjacencies[from].add(to);
    }
    if (to !== DefinedNode.End && from !== DefinedNode.Start) {
      adjacencies[to].add(from);
    }
  }

  let paths: number = 0;

  const visited: Record<string, number> = Object.fromEntries(
    Object.keys(adjacencies).map((key) => [key, 0])
  );
  const wandering: string[] = [];
  let aSmallCaveEnteredTwice: boolean = false;

  function wander(node: string) {
    if (node === DefinedNode.End) {
      paths++;
      const path = wandering.join(',');
      debug && console.log(path + ',end');
    }
    wandering.push(node);
    if (++visited[node] === 2 && oneTimers.has(node)) {
      aSmallCaveEnteredTwice = true;
    }
    for (const option of adjacencies[node].values()) {
      if (oneTimers.has(option)) {
        const limit = aSmallCaveEnteredTwice ? 1 : 2;
        const visitCount = visited[option];
        if (visitCount >= limit) continue;
      }
      wander(option);
    }
    visited[node] = Math.max(visited[node] - 1, 0);
    if ([...oneTimers.values()].every((k) => visited[k] < 2)) {
      aSmallCaveEnteredTwice = false;
    }
    wandering.pop();
  }
  wander(DefinedNode.Start);

  console.log('total paths:', paths);
})();
