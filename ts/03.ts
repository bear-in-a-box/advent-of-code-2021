import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/03.txt')).toString();
  const values: number[][] = input
    .split('\n')
    .map((v) => v.split('').map((c) => +c));
  const bits = [...Array(values.length).keys()];
  const calcBit = (n: number) =>
    bits.map((i) => values[i][n]).reduce((acc, v) => acc + v, 0) >
    values.length / 2
      ? 1
      : 0;
  const gamma = [...Array(values[0].length).keys()].map(calcBit);
  const epsilon = gamma.map((v) => v ^ 1);
  console.log(parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2));
})();
