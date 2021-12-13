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
    adjacencies[from].add(to);
    if (to !== DefinedNode.End) {
      adjacencies[to].add(from);
    }
  }
  debug && console.log(adjacencies);

  let paths = 0;

  const visited: Record<string, boolean> = {};
  const wandering: string[] = [];

  function wander(node: string) {
    if (node === DefinedNode.End) {
      paths++;
      debug && console.log(wandering.join(',') + ',end');
    }
    wandering.push(node);
    if (oneTimers.has(node)) {
      visited[node] = true;
    }
    for (const option of adjacencies[node].values()) {
      if (visited[option]) continue;
      wander(option);
    }
    visited[node] = false;
    wandering.pop();
  }
  wander(DefinedNode.Start);

  console.log('total paths:', paths);
})();
