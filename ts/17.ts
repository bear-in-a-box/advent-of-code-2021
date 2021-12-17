import { promises as fs } from 'fs';
import { performance } from 'perf_hooks';

(async () => {
  const input = (await fs.readFile('../inputs/17.txt')).toString();
  const [xFrom, xTo, yFrom, yTo] = input
    .match(/^target area: x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)$/)!
    .slice(1, 5)
    .map((v) => +v);
  const yPastArea = Math.min(0, yFrom, yTo);
  console.log('Range:', `x = [${xFrom}; ${xTo}]`, `x = [${yFrom}; ${yTo}]`);
  function inArea(x: number, y: number): boolean {
    return x >= xFrom && x <= xTo && y >= yFrom && y <= yTo;
  }
  function pastArea(x: number, y: number): boolean {
    return x < 0 || x >= xTo || y < yPastArea;
  }
  /**
   * @returns max height if target was reached
   */
  function fire(
    vx: number,
    vy: number,
    currentYMax: number
  ): number | undefined {
    let x = 0,
      y = 0,
      yMax = -Infinity;

    while (true) {
      x += vx;
      y += vy;
      if (y > yMax) {
        yMax = y;
      }
      if (inArea(x, y)) {
        return yMax;
      }
      if (pastArea(x, y)) {
        return;
      }
      if (vx > 0) vx--;
      else if (vx < 0) vx++;
      if (--vy === 0 && yMax < currentYMax) {
        return;
      }
    }
  }
  const start = performance.now();
  let yMax = -Infinity;
  for (let vy = 100; vy >= yFrom; vy--) {
    for (let vx = xTo; vx >= 0; vx--) {
      const result = fire(vx, vy, yMax);
      if (result !== undefined && result > yMax) {
        yMax = result;
      }
    }
  }
  const end = performance.now();
  console.log('Result:', yMax);
  console.log('Time elapsed:', end - start, 'ms');
})();
