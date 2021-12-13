import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/07.txt')).toString();
  const positions = input
    .split(',')
    .map((v) => +v)
    .sort((a, b) => a - b);
  const median = (() => {
    const half = positions.length / 2;
    if (positions.length % 2 === 0) {
      return (positions[half] + positions[half - 1]) / 2;
    }
    return positions[half];
  })();
  console.log(median);
  const fuel = positions.reduce((acc, v) => acc + Math.abs(v - median), 0);
  console.log(fuel);
})();
