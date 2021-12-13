import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/01.txt')).toString();
  const values: number[] = input.split('\n').map((v) => +v);

  const threes: number[] = [];
  for (let i = 0; i < values.length - 2; i++) {
    const three = values.slice(i, i + 3).reduce((acc, v) => acc + v, 0);
    threes.push(three);
  }

  const result = threes.reduce(
    (acc, v, i, a) => (i === 0 || v > a[i - 1] ? acc + 1 : acc),
    -1
  );
  console.log(result);
})();
