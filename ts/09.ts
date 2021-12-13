import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/09.txt')).toString();
  const lines = input.split('\n');
  const heightMap: number[][] = lines.map((line) =>
    line.split('').map((c) => +c)
  );
  const [{ length: width }] = heightMap;
  const { length: height } = heightMap;
  let totalRisk = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const adjacents = [
        y > 0 && [x, y - 1],
        y < height - 1 && [x, y + 1],
        x > 0 && [x - 1, y],
        x < width - 1 && [x + 1, y],
      ].filter((a) => a !== false) as [number, number][];
      const point = heightMap[y][x];
      if (adjacents.every(([x, y]) => point < heightMap[y][x])) {
        totalRisk += point + 1;
      }
    }
  }
  console.log(totalRisk);
})();
