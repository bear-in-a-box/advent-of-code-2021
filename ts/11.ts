import { promises as fs } from 'fs';

const steps = 100;
const width = 10;
const height = 10;
const debug = process.argv.slice(2).includes('debug');

function showOctopuses(o: number[][]): void {
  console.log(
    o
      .map((l) =>
        l.map((c) => (c === 0 ? `\x1b[41m\x1b[33m0\x1b[0m` : c)).join('')
      )
      .join('\n')
  );
}

function isCandidate([x, y]: number[]): boolean {
  return x > -1 && y > -1 && x < width && y < height;
}

function getCandidates(x: number, y: number): [number, number][] {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ].filter(isCandidate) as [number, number][];
}

const flashKey = ([x, y]: [number, number]) => `${x},${y}`;

(async () => {
  const input = (await fs.readFile('../inputs/11.txt')).toString();
  const octopuses: number[][] = input
    .split('\n')
    .map((line) => line.split('').map((v) => +v));
  debug && console.log('before changes');
  debug && showOctopuses(octopuses);
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    const flashed: Record<string, boolean> = {};
    const toFlash: [number, number][] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        ++octopuses[y][x];
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (octopuses[y][x] > 9) {
          toFlash.push([x, y]);
          let candidate: [number, number] | undefined;
          while ((candidate = toFlash.pop())) {
            if (!flashed[flashKey(candidate)]) {
              flashes++;
            }
            flashed[flashKey(candidate)] = true;
            const [cx, cy] = candidate;
            octopuses[cy][cx] = 0;
            const neighbors = getCandidates(cx, cy).filter(
              (c) =>
                !flashed[flashKey(c)] &&
                !toFlash.some(([cx1, cy1]) => cx === cx1 && cy === cy1)
            );
            for (const [x, y] of neighbors) {
              if (++octopuses[y][x] > 9) {
                toFlash.push([x, y]);
              }
            }
          }
        }
      }
    }
    if (debug && (step + 1) % 10 === 0) {
      console.log('after step', step + 1);
      showOctopuses(octopuses);
    }
  }
  console.log('flashes', flashes);
})();
