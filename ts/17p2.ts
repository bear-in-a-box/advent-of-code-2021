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
  function pastArea(x: number, y: number, vx: number, vy: number): boolean {
    return x < 0 || x > xTo || (y < yPastArea && vx === 0 && x <= xTo);
  }
  /**
   * @returns max height if target was reached
   */
  function fire(vx: number, vy: number): boolean {
    let x = 0,
      y = 0;

    while (true) {
      x += vx;
      y += vy;
      if (inArea(x, y)) {
        return true;
      }
      if (pastArea(x, y, vx, vy)) {
        return false;
      }
      if (vx > 0) vx--;
      else if (vx < 0) vx++;
      vy--;
    }
  }
  const start = performance.now();
  let options = 0;
  // it's so naive, gotta think about it in spare time
  for (let vy = 1000; vy >= -200; vy--) {
    for (let vx = xTo * xTo; vx >= 0; vx--) {
      if (fire(vx, vy)) {
        options++;
      }
    }
  }
  const end = performance.now();
  console.log('Result:', options);
  console.log('Time elapsed:', end - start, 'ms');
})();
