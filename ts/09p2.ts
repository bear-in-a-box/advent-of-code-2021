import { promises as fs } from 'fs';

(async () => {
  const input = (await fs.readFile('../inputs/09.txt')).toString();
  const lines = input.split('\n');
  const heightMap: number[][] = lines.map((line) =>
    line.split('').map((c) => +c)
  );
  const [{ length: width }] = heightMap;
  const { length: height } = heightMap;
  const visited: boolean[][] = [...Array(height)].map(() =>
    [...Array(width)].map(() => false)
  );

  function isCandidate([x, y]: number[]): boolean {
    return (
      x > -1 &&
      y > -1 &&
      x < width &&
      y < height &&
      !visited[y][x] &&
      heightMap[y][x] !== 9
    );
  }

  function getCandidates(x: number, y: number): [number, number][] {
    return [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ].filter((c) => isCandidate(c)) as [number, number][];
  }

  const basinSizes: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (visited[y][x]) {
        continue;
      }
      const point = heightMap[y][x];
      if (point === 9) {
        visited[y][x] = true;
        continue;
      }
      const basin: [number, number][] = [];
      const candidates: [number, number][] = [[x, y]];
      let candidate: [number, number] | undefined;
      while ((candidate = candidates.pop())) {
        basin.push(candidate);
        const [x, y] = candidate;
        visited[y][x] = true;
        candidates.push(
          ...getCandidates(x, y).filter(
            ([cx, cy]) =>
              !candidates.some(([ecx, ecy]) => cx === ecx && cy === ecy)
          )
        );
      }
      basinSizes.push(basin.length);
    }
  }
  const result = basinSizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, v) => acc * v);
  console.log(result);
})();
