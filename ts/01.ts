import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/01.txt')).toString();
  const values: number[] = input.split('\n').map((v) => +v);

  const result = values.reduce(
    (acc, v, i, a) => (i === 0 || v > a[i - 1] ? acc + 1 : acc),
    -1
  );

  console.log(result);
})();
