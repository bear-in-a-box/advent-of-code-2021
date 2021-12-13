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
  public fields: number[][];
  private _overlaps: number = 0;

  constructor(public readonly width: number, public readonly height: number) {
    this.fields = [...Array(height)].map(() => [...Array(width)].map(() => 0));
  }

  layVent([[x1, y1], [x2, y2]]: CoordsPair) {
    if (!(x1 === x2 || y1 === y2)) {
      return;
    }
    const xFrom = Math.min(x1, x2);
    const xTo = Math.max(x1, x2);
    const yFrom = Math.min(y1, y2);
    const yTo = Math.max(y1, y2);
    for (let y = yFrom; y <= yTo; y++) {
      for (let x = xFrom; x <= xTo; x++) {
        if (++this.fields[y][x] === 2) {
          this._overlaps++;
        }
      }
    }
  }

  get overlaps() {
    return this._overlaps;
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
  console.log(diagram.overlaps);
})();
