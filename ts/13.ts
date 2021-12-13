import { promises as fs } from 'fs';

interface FoldStrategy {
  shouldDotMove: (dim: number, dot: [number, number]) => boolean;
  dotMapper: (dim: number, dot: [number, number]) => [number, number];
}

const FoldUpStrategy: FoldStrategy = {
  shouldDotMove: (h, [, y]) => y >= h,
  dotMapper: (dim, [x, y]) => [x, dim * 2 - y],
};
const FoldLeftStrategy: FoldStrategy = {
  shouldDotMove: (w, [x]) => x >= w,
  dotMapper: (dim, [x, y]) => [dim * 2 - x, y],
};

class Paper {
  private dots: [number, number][] = [];

  placeDot(x: number, y: number) {
    if (this.dots.some(([dx, dy]) => dx === x && dy === y)) {
      return;
    }
    this.dots.push([x, y]);
  }

  fold(dim: number, strategy: FoldStrategy) {
    const dotsToStay: [number, number][] = [];
    const dotsToMove: [number, number][] = [];
    for (const dot of this.dots) {
      (strategy.shouldDotMove(dim, dot) ? dotsToMove : dotsToStay).push(dot);
    }
    this.dots = dotsToStay;
    const newDots: [number, number][] = dotsToMove.map((dot) =>
      strategy.dotMapper(dim, dot)
    );
    this.dots.push(...newDots);
    this.deduplicate();
  }

  foldUp(h: number) {
    return this.fold(h, FoldUpStrategy);
  }

  foldLeft(w: number) {
    return this.fold(w, FoldLeftStrategy);
  }

  deduplicate() {
    const newDots: [number, number][] = [];
    for (const [x, y] of this.dots) {
      if (!newDots.some(([nx, ny]) => nx === x && ny === y)) {
        newDots.push([x, y]);
      }
    }
    this.dots = newDots;
  }

  get dotsCount(): number {
    return this.dots.length;
  }

  get width(): number {
    return Math.max(...this.dots.map(([x]) => x)) + 1;
  }

  get height(): number {
    return Math.max(...this.dots.map(([, y]) => y)) + 1;
  }

  display() {
    const visual = [...Array(this.height)].map(() =>
      [...Array(this.width)].map(() => '.')
    );
    for (const [x, y] of this.dots) {
      visual[y][x] = '#';
    }
    console.log(visual.map((line) => line.join('')).join('\n'));
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/13.txt')).toString();
  const lines = input.split('\n');
  const dots = lines
    .filter((line) => line.match(/^\d+,\d+$/))
    .map((line) => line.split(',').map((v) => +v) as [number, number]);
  const foldMatcher = /^fold along ([xy])=(\d+)/;
  const folds: [string, number][] = lines
    .filter((line) => line.match(/^fold along/))
    .map((line) => {
      const [dir, dim] = line.match(foldMatcher)!.slice(1, 3);
      return [dir, +dim];
    })
    .slice(0, 1) as [string, number][];
  const paper = new Paper();
  for (const [x, y] of dots) {
    paper.placeDot(x, y);
  }
  for (const [dir, dim] of folds) {
    switch (dir) {
      case 'x':
        paper.foldLeft(dim);
        break;
      case 'y':
        paper.foldUp(dim);
        break;
    }
    console.log('fold', dir, dim);
  }
  console.log('dots:', paper.dotsCount);
})();
