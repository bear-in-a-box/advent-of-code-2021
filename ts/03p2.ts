import { promises as fs } from 'fs';

function getMostCommon(values: number[][], bit: number): number {
  return values.reduce((acc, v) => acc + v[bit], 0) >= values.length / 2
    ? 1
    : 0;
}

function calculateRating(source: number[][], mostCommon: boolean): number {
  const bits = source[0].length;

  let values = source.map((v) => v.slice());
  for (let i = 0; i < bits && values.length > 1; i++) {
    const mostCommonBit = getMostCommon(values, i);
    values = values.filter((value) =>
      mostCommon ? value[i] === mostCommonBit : value[i] !== mostCommonBit
    );
  }
  return parseInt(values[0].join(''), 2);
}

(async () => {
  const input = (await fs.readFile('../inputs/03.txt')).toString();
  const values: number[][] = input
    .split('\n')
    .map((v) => v.split('').map((c) => +c));
  const oxygen = calculateRating(values, true);
  const co2 = calculateRating(values, false);
  console.log('oxygen', oxygen);
  console.log('co2', co2);
})();
