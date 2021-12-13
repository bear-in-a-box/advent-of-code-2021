import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/02.txt')).toString();
  const values: [string, number][] = input.split('\n').map((v) => {
    const [dir, units] = v.split(' ');
    return [dir, +units];
  });
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  for (const [dir, units] of values) {
    switch (dir) {
      case 'forward':
        horizontal += units;
        depth += aim * units;
        break;
      case 'down':
        aim += units;
        break;
      case 'up':
        aim -= units;
        break;
    }
  }
  console.log(`${horizontal} * ${depth} = ${horizontal * depth}`);
})();
