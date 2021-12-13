import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/02.txt')).toString();
  const values: [string, number][] = input.split('\n').map((v) => {
    const [dir, units] = v.split(' ');
    return [dir, +units];
  });
  let horizontal = 0;
  let depth = 0;
  for (const [dir, units] of values) {
    switch (dir) {
      case 'forward':
        horizontal += units;
        break;
      case 'down':
        depth += units;
        break;
      case 'up':
        depth -= units;
        break;
    }
  }
  console.log(`${horizontal} * ${depth} = ${horizontal * depth}`);
})();
