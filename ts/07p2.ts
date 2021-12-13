import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/07.txt')).toString();
  const positions = input
    .split(',')
    .map((v) => +v)
    .sort((a, b) => a - b);
  const min = positions[0];
  const max = positions[positions.length - 1];
  const stepCosts: Record<number, number> = {
    [min]: 0,
  };
  for (let i = min + 1; i <= max; i++) {
    stepCosts[i] = stepCosts[i - 1] + (i - min);
  }
  const calculateFuel = (target: number) =>
    positions.reduce((acc, v) => acc + stepCosts[Math.abs(target - v)], 0);
  const fuel = Math.min(
    ...[...Array(max - min + 1).keys()].map((t) => calculateFuel(min + t))
  );
  console.log(fuel);
})();
