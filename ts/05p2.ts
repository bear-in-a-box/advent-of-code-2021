import { promises as fs } from 'fs';

type Coords = [number, number];
type CoordsPair = [Coords, Coords];

function parseVents(lines: string[]) {
  let width = 0;
  let height = 0;
  const vents = lines.map(
    (line) =>
      line.split(' -> ').map((coords) => {
        const values = coords.split(',').map((coord) => +coord) as Coords;
        if (values[0] > width) {
          width = values[0];
        }
        if (values[1] > height) {
          height = values[1];
        }
        return values;
      }) as CoordsPair
  );
  width++;
  height++;
  return {
    width,
    height,
    vents,
  };
}

class Diagram {
  private fields: number[][];
  private _overlaps: number = 0;

  constructor(public readonly width: number, public readonly height: number) {
    this.fields = [...Array(height)].map(() => [...Array(width)].map(() => 0));
  }

  layVent([[x1, y1], [x2, y2]]: CoordsPair) {
    const xStep = x1 === x2 ? 0 : x1 < x2 ? 1 : -1;
    const yStep = y1 === y2 ? 0 : y1 < y2 ? 1 : -1;
    const steps = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    for (let step = 0; step <= steps; step++) {
      const x = x1 + xStep * step;
      const y = y1 + yStep * step;
      try {
        if (++this.fields[y][x] === 2) {
          this._overlaps++;
        }
      } catch (e) {
        console.error('crash', {
          x,
          y,
          x1,
          y1,
          x2,
          y2,
          xStep,
          yStep,
          step,
          width: this.width,
          height: this.height,
        });
        process.exit(1);
      }
    }
  }

  get overlaps() {
    return this._overlaps;
  }

  toString() {
    return this.fields.map((y) => y.map((v) => v || '.').join('')).join('\n');
  }
}

(async () => {
  const input = (await fs.readFile('../inputs/05.txt')).toString();
  const lines = input.split('\n');
  const { width, height, vents } = parseVents(lines);
  const diagram = new Diagram(width, height);
  for (const vent of vents) {
    diagram.layVent(vent);
  }
  process.argv.pop() === 'diagram' && console.log('' + diagram);
  console.log(diagram.overlaps);
})();
